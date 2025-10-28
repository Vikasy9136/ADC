import { supabase, isSupabaseConfigured } from '../config/supabase';

interface Test {
  id: string;
  test_code: string;
  test_name: string;
  test_category: string;
  price: number;
  sample_type?: string;
  department?: string;
  normal_range?: string;
  description?: string;
  preparation_notes?: string;
  report_time?: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  syncStatus?: 'pending' | 'synced';
}

interface SyncQueueItem {
  id: string;
  table: 'tests';
  operation: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
  retries: number;
}

class TestDatabaseService {
  private TESTS_KEY = 'ashwani_tests';
  private SYNC_QUEUE_KEY = 'ashwani_test_sync_queue';
  private isOnline = navigator.onLine;
  private syncInProgress = false;
  private supabaseEnabled = isSupabaseConfigured();

  constructor() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('🟢 Online - Starting test sync...');
      if (this.supabaseEnabled) {
        this.syncQueue();
      }
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('🔴 Offline - Test sync paused');
    });

    setInterval(() => {
      if (this.isOnline && !this.syncInProgress && this.supabaseEnabled) {
        this.syncQueue();
      }
    }, 30000);

    if (this.isOnline && this.supabaseEnabled) {
      setTimeout(() => this.initialSync(), 3000);
    }
  }

  // CRUD Operations
  getAllTests(): Test[] {
    const data = localStorage.getItem(this.TESTS_KEY);
    return data ? JSON.parse(data) : [];
  }

  getTestById(id: string): Test | undefined {
    return this.getAllTests().find(t => t.id === id);
  }

  createTest(testData: Omit<Test, 'id' | 'createdAt' | 'updatedAt'>): Test | { error: string } {
    // Check for duplicate test code
    const existing = this.getAllTests();
    const duplicateCode = existing.find(t => 
      t.test_code.toLowerCase() === testData.test_code.toLowerCase()
    );
    
    if (duplicateCode) {
      return { error: 'Test code already exists. Please use a different code.' };
    }

    const newTest: Test = {
      ...testData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      syncStatus: 'pending'
    };

    existing.push(newTest);
    this.saveTests(existing);
    this.addToSyncQueue('create', newTest);

    console.log('✅ Test created:', newTest.test_name);
    return newTest;
  }

  bulkCreateTests(testsData: any[]): { success: number; failed: number } {
    let success = 0;
    let failed = 0;

    testsData.forEach(testData => {
      const result = this.createTest(testData);
      if ('error' in result) {
        failed++;
        console.warn('❌ Failed to create test:', testData.test_name, result.error);
      } else {
        success++;
      }
    });

    console.log(`📊 Bulk import: ${success} success, ${failed} failed`);
    return { success, failed };
  }

  updateTest(id: string, updates: Partial<Test>): Test | null {
    const tests = this.getAllTests();
    const index = tests.findIndex(t => t.id === id);

    if (index === -1) return null;

    tests[index] = {
      ...tests[index],
      ...updates,
      updatedAt: new Date().toISOString(),
      syncStatus: 'pending'
    };

    this.saveTests(tests);
    this.addToSyncQueue('update', tests[index]);

    console.log('✅ Test updated:', tests[index].test_name);
    return tests[index];
  }

  deleteTest(id: string): boolean {
    const tests = this.getAllTests();
    const test = tests.find(t => t.id === id);
    
    if (!test) return false;

    const filtered = tests.filter(t => t.id !== id);
    this.saveTests(filtered);
    this.addToSyncQueue('delete', { id });

    console.log('✅ Test deleted:', test.test_name);
    return true;
  }

  // Sync operations
  private async initialSync(): Promise<void> {
    if (!this.supabaseEnabled) return;

    try {
      console.log('🔄 Initial test sync from Supabase...');
      
      const { data, error } = await supabase
        .from('tests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('⚠️ Test sync failed:', error.message);
        return;
      }

      if (data && data.length > 0) {
        const activeTests = data.filter(test => !test.deleted_at);
      const localTests = activeTests.map(this.supabaseToLocal);
      const existing = this.getAllTests();
      const merged = this.mergeData(existing, localTests);
      this.saveTests(merged);
      console.log(`✅ Synced ${activeTests.length} tests from Supabase`);
      }
    } catch (error: any) {
      console.error('❌ Test sync failed:', error.message);
    }
  }

  private addToSyncQueue(operation: string, data: any): void {
    const queue = this.getSyncQueue();
    
    const queueItem: SyncQueueItem = {
      id: this.generateId(),
      table: 'tests',
      operation: operation as any,
      data,
      timestamp: Date.now(),
      retries: 0
    };

    queue.push(queueItem);
    this.saveSyncQueue(queue);

    if (this.isOnline && !this.syncInProgress && this.supabaseEnabled) {
      setTimeout(() => this.syncQueue(), 500);
    }
  }

  async syncQueue(): Promise<void> {
    if (!this.isOnline || !this.supabaseEnabled || this.syncInProgress) {
      return;
    }

    const queue = this.getSyncQueue();
    if (queue.length === 0) return;

    this.syncInProgress = true;
    console.log(`🔄 Syncing ${queue.length} test items...`);

    const processed: string[] = [];
    const failed: SyncQueueItem[] = [];

    for (const item of queue) {
      try {
        await this.syncItemToSupabase(item);
        processed.push(item.id);
        console.log(`✅ Synced test: ${item.operation}`);
      } catch (error: any) {
        console.error(`❌ Test sync failed:`, error?.message || error);
        item.retries++;
        if (item.retries < 3) {
          failed.push(item);
        }
      }
    }

    this.saveSyncQueue(failed);
    if (processed.length > 0) {
      this.updateSyncStatus();
    }

    this.syncInProgress = false;
    console.log(`✅ Test sync complete. ${processed.length} synced, ${failed.length} pending`);
  }

  private async syncItemToSupabase(item: SyncQueueItem): Promise<void> {
    const { operation, data } = item;

    switch (operation) {
      case 'create':
        const createData = this.localToSupabase(data);
        const { error: createError } = await supabase.from('public.tests').insert(createData);
        if (createError) throw createError;
        break;

      case 'update':
        const updateData = this.localToSupabase(data);
        const { error: updateError } = await supabase
          .from('tests')
          .update(updateData)
          .eq('id', data.id);
        if (updateError) throw updateError;
        break;

      case 'delete':
        const { error: deleteError } = await supabase
          .from('tests')
          .delete()
          .eq('id', data.id);
        if (deleteError) throw deleteError;
        break;
    }
  }

  // Helper methods
  private saveTests(tests: Test[]): void {
    localStorage.setItem(this.TESTS_KEY, JSON.stringify(tests));
  }

  private getSyncQueue(): SyncQueueItem[] {
    const data = localStorage.getItem(this.SYNC_QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveSyncQueue(queue: SyncQueueItem[]): void {
    localStorage.setItem(this.SYNC_QUEUE_KEY, JSON.stringify(queue));
  }

  private generateId(): string {
    return `test_${Date.now().toString(36)}${Math.random().toString(36).substr(2, 9)}`;
  }

  private localToSupabase(test: Test): any {
    return {
      id: test.id,
      test_code: test.test_code,
      test_name: test.test_name,
      test_category: test.test_category,
      price: test.price,
      sample_type: test.sample_type,
      department: test.department,
      normal_range: test.normal_range,
      description: test.description,
      preparation_notes: test.preparation_notes,
      report_time: test.report_time,
      is_active: test.is_active,
      created_at: test.createdAt,
      updated_at: test.updatedAt
    };
  }

  private supabaseToLocal(data: any): Test {
    return {
      id: data.id || this.generateId(),
    test_code: data.test_code || '',
    test_name: data.test_name || 'Unknown Test',
    test_category: data.test_category || 'General',
    price: parseFloat(data.price) || 0,
    sample_type: data.sample_type || '',
    department: data.department || '',
    normal_range: data.normal_range || '',
    description: data.description || '',
    preparation_notes: data.preparation_notes || '',
    report_time: data.report_time || '',
    is_active: data.is_active !== undefined ? data.is_active : true,
    createdAt: data.created_at || new Date().toISOString(),
    updatedAt: data.updated_at || new Date().toISOString(),
    syncStatus: 'synced'
    };
  }

  private mergeData(local: Test[], remote: Test[]): Test[] {
    const merged = [...local];
    
    remote.forEach(remoteItem => {
      const localIndex = merged.findIndex(l => l.id === remoteItem.id);
      
      if (localIndex === -1) {
        merged.push(remoteItem);
      } else {
        if (merged[localIndex].syncStatus !== 'pending') {
          merged[localIndex] = remoteItem;
        }
      }
    });
    
    return merged;
  }

  private updateSyncStatus(): void {
    const tests = this.getAllTests();
    tests.forEach(t => {
      if (t.syncStatus === 'pending') {
        t.syncStatus = 'synced';
      }
    });
    this.saveTests(tests);
  }

  // Public methods
  getOnlineStatus(): boolean {
    return this.isOnline;
  }

  getPendingSyncCount(): number {
    return this.getSyncQueue().length;
  }

  async forceSyncNow(): Promise<void> {
    await this.syncQueue();
  }

  initializeSampleData(): void {
    const existing = this.getAllTests();
    
    if (existing.length === 0) {
      const sampleTests = [
        {
          test_code: 'CBC',
          test_name: 'Complete Blood Count',
          test_category: 'Hematology',
          price: 300,
          sample_type: 'Blood',
          department: 'Pathology',
          normal_range: 'WBC: 4,000-10,000/μL',
          description: 'Complete blood count with differential',
          preparation_notes: 'No fasting required',
          report_time: '2-4 hours',
          is_active: true
        },
        {
          test_code: 'FBS',
          test_name: 'Fasting Blood Sugar',
          test_category: 'Biochemistry',
          price: 150,
          sample_type: 'Blood',
          department: 'Pathology',
          normal_range: '70-100 mg/dL',
          description: 'Glucose level after fasting',
          preparation_notes: '8-12 hours fasting required',
          report_time: '1-2 hours',
          is_active: true
        }
      ];

      sampleTests.forEach(test => this.createTest(test));
      console.log('📝 Sample tests initialized');
    }
  }
}

export const testDb = new TestDatabaseService();
