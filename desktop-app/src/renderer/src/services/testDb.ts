import { supabase, isSupabaseConfigured } from '../config/supabase';

export interface Test {
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
}

// Only uses localStorage for ‘offline’, else Supabase directly.
class TestDatabaseService {
  private TESTS_KEY = 'ashwani_tests';
  private isOnline = typeof window !== 'undefined' && navigator.onLine;
  private supabaseEnabled = isSupabaseConfigured();

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => { this.isOnline = true; });
      window.addEventListener('offline', () => { this.isOnline = false; });
    }
  }

  async getAllTests(): Promise<Test[]> {
    if (this.isOnline && this.supabaseEnabled) {
      const { data, error } = await supabase.from('tests').select('*').order('created_at', { ascending: false });
      if (error) { console.warn("Supabase fetch failed", error); return this.getAllTestsLocal(); }
      const remapped = (data ?? []).map(this.supabaseToLocal);
      this.saveTests(remapped); // Always update cache!
      return remapped;
    } else {
      return this.getAllTestsLocal();
    }
  }

  getAllTestsLocal(): Test[] {
    const data = localStorage.getItem(this.TESTS_KEY);
    return data ? JSON.parse(data) : [];
  }
  saveTests(tests: Test[]): void { localStorage.setItem(this.TESTS_KEY, JSON.stringify(tests)); }
  generateId(): string { return `test_${Date.now().toString(36)}${Math.random().toString(36).substr(2, 9)}`; }
  supabaseToLocal(data: any): Test {
    return {
      id: String(data.id),
      test_code: data.test_code,
      test_name: data.test_name,
      test_category: data.test_category,
      price: Number(data.price ?? 0),
      sample_type: data.sample_type,
      department: data.department,
      normal_range: data.normal_range,
      description: data.description,
      preparation_notes: data.preparation_notes,
      report_time: data.report_time,
      is_active: !!data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at ?? data.created_at,
    };
  }
  localToSupabase(test: Test): any {
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
      updated_at: test.updatedAt,
    };
  }

  async createTest(testData: Omit<Test, 'id' | 'createdAt' | 'updatedAt'>): Promise<Test | { error: string }> {
    const newTest: Test = {
      ...testData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (this.isOnline && this.supabaseEnabled) {
      const { error } = await supabase.from('tests').insert([this.localToSupabase(newTest)]);
      if (error) return { error: error.message || "Supabase error" };
    } else {
      // fallback for truly offline
      const all = this.getAllTestsLocal(); all.push(newTest); this.saveTests(all);
    }
    return newTest;
  }

  async updateTest(id: string, updates: Partial<Test>): Promise<Test | null> {
    if (this.isOnline && this.supabaseEnabled) {
      const updateData: any = { ...updates, updatedAt: new Date().toISOString() };
      const { error } = await supabase.from('tests').update(updateData).eq('id', id);
      if (error) return null;
    } else {
      const all = this.getAllTestsLocal();
      const idx = all.findIndex(t => t.id === id);
      if (idx === -1) return null;
      all[idx] = { ...all[idx], ...updates, updatedAt: new Date().toISOString() };
      this.saveTests(all);
    }
    return { ...updates, id } as Test;
  }

  async deleteTest(id: string): Promise<boolean> {
    if (this.isOnline && this.supabaseEnabled) {
      const { error } = await supabase.from('tests').delete().eq('id', id);
      if (error) return false;
    } else {
      const all = this.getAllTestsLocal().filter(t => t.id !== id);
      this.saveTests(all);
    }
    return true;
  }

  initializeSampleData(): void {
    const existing = this.getAllTestsLocal();
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
        }
      ];
      sampleTests.forEach(t => this.createTest(t));
    }
  }
}
export const testDb = new TestDatabaseService();
