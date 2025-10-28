import { supabase, isSupabaseConfigured } from '../config/supabase';

// Explicit interface for credentials used everywhere in this module
export interface UserCredentials {
  id: string;
  username: string;
  password: string;
  role: 'staff' | 'phlebotomist' | 'admin';
  personId: string;
  isActive: boolean;
}

export interface Person {
  id: string;
  name: string;
  phone: string;
  email: string;
  designation: string;
  salary: number;
  joiningDate: string;
  photo: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  syncStatus?: 'pending' | 'synced';
  role?: 'staff' | 'phlebotomist';
}

interface SyncQueueItem {
  id: string;
  table: 'staff' | 'phlebotomist' | 'users';
  operation: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
  retries: number;
}

class DatabaseService {
  from(arg0: string) {
      throw new Error('Method not implemented.');
  }
  private STAFF_KEY = 'ashwani_staff';
  private PHLEBO_KEY = 'ashwani_phlebotomist';
  private CREDENTIALS_KEY = 'ashwani_credentials';
  private SYNC_QUEUE_KEY = 'ashwani_sync_queue';
  private isOnline = navigator.onLine;
  private syncInProgress = false;
  private supabaseEnabled = isSupabaseConfigured();

  constructor() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('🟢 Online - Starting sync...');
      if (this.supabaseEnabled) {
        this.syncQueue();
      }
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('🔴 Offline - Sync paused');
    });

    // Auto-sync every 30 seconds when online
    setInterval(() => {
      if (this.isOnline && !this.syncInProgress && this.supabaseEnabled) {
        this.syncQueue();
      }
    }, 30000);

    // Initial sync on startup (only if configured)
    if (this.isOnline && this.supabaseEnabled) {
      setTimeout(() => this.initialSync(), 2000);
    } else {
      if (!this.supabaseEnabled) {
        console.log('ℹ️ Running in OFFLINE MODE (Supabase not configured)');
      }
    }
  }

  // ============================================
  // INITIAL SYNC
  // ============================================

  private async initialSync(): Promise<void> {
    if (!this.supabaseEnabled) {
      console.log('⚠️ Supabase not configured - running in offline mode');
      return;
    }

    try {
      console.log('🔄 Initial sync from Supabase...');
      
      // Try to sync staff with error handling
      try {
        const { data: staffData, error: staffError } = await supabase
          .from('staff')
          .select('*')
          .is('deleted_at', null)
          .order('created_at', { ascending: false });

        if (staffError) {
          console.warn('⚠️ Staff table sync failed:', staffError.message);
          console.log('ℹ️ This is normal if table doesn\'t exist yet');
        } else if (staffData && staffData.length > 0) {
          const localStaff = staffData.map((s) => this.supabaseToLocal(s, 'staff'));
          const existing = this.getByRole('staff');
          const merged = this.mergeData(existing, localStaff);
          this.saveByRole('staff', merged);
          console.log(`✅ Synced ${staffData.length} staff from Supabase`);
        } else {
          console.log('ℹ️ No staff data in Supabase yet');
        }
      } catch (err: any) {
        console.warn('⚠️ Staff sync error:', err.message);
      }

      // Try to sync phlebotomists with error handling
      try {
        const { data: phleboData, error: phleboError } = await supabase
          .from('phlebotomist')
          .select('*')
          .is('deleted_at', null)
          .order('created_at', { ascending: false });

        if (phleboError) {
          console.warn('⚠️ Phlebotomist table sync failed:', phleboError.message);
          console.log('ℹ️ This is normal if table doesn\'t exist yet');
        } else if (phleboData && phleboData.length > 0) {
          const localPhlebo = phleboData.map((p) => this.supabaseToLocal(p, 'phlebotomist'));
          const existing = this.getByRole('phlebotomist');
          const merged = this.mergeData(existing, localPhlebo);
          this.saveByRole('phlebotomist', merged);
          console.log(`✅ Synced ${phleboData.length} phlebotomists from Supabase`);
        } else {
          console.log('ℹ️ No phlebotomist data in Supabase yet');
        }
      } catch (err: any) {
        console.warn('⚠️ Phlebotomist sync error:', err.message);
      }

      console.log('✅ Initial sync completed');
    } catch (error: any) {
      console.error('❌ Initial sync failed:', error.message);
      console.log('ℹ️ App will continue in offline mode');
    }
  }

  private mergeData(local: Person[], remote: Person[]): Person[] {
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

  // ============================================
  // CRUD OPERATIONS
  // ============================================

  getAllStaff(): Person[] {
    const staff = this.getByRole('staff').map(s => ({ ...s, role: 'staff' as const }));
    const phlebo = this.getByRole('phlebotomist').map(p => ({ ...p, role: 'phlebotomist' as const }));
    return [...staff, ...phlebo];
  }

  getStaffById(id: string): Person | undefined {
    const all = this.getAllStaff();
    return all.find(s => s.id === id);
  }

  createStaff(staffData: Omit<Person, 'id' | 'createdAt' | 'updatedAt'> & { role: 'staff' | 'phlebotomist' }): { person: Person; credentials: UserCredentials } | { error: string } {
  // Check for duplicate email
  if (staffData.email && staffData.email.trim() !== '') {
    const allStaff = this.getAllStaff();
    const existingEmail = allStaff.find(s => 
      s.email.toLowerCase() === staffData.email.toLowerCase()
    );
    
    if (existingEmail) {
      console.error('❌ Email already exists:', staffData.email);
      return { error: 'Email already exists. Please use a different email.' };
    }
  }

  // Check for duplicate phone
  const allStaff = this.getAllStaff();
  const existingPhone = allStaff.find(s => s.phone === staffData.phone);
  
  if (existingPhone) {
    console.error('❌ Phone number already exists:', staffData.phone);
    return { error: 'Phone number already exists. Please use a different phone number.' };
  }

  const newPerson: Person = {
    ...staffData,
    id: this.generateId(staffData.role),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    syncStatus: 'pending'
  };

  // Generate unique username
  let username = this.generateUsername(newPerson.name, newPerson.phone);
  let counter = 1;
  
  // Check if username already exists
  const allCredentials = this.getAllCredentials();
  while (allCredentials.find(c => c.username === username)) {
    username = `${this.generateUsername(newPerson.name, newPerson.phone)}${counter}`;
    counter++;
  }

    // Generate login credentials
  const credentials: UserCredentials = {
    id: this.generateId('user'),
    username: username,
    password: this.generatePassword(),
    role: staffData.role,
    personId: newPerson.id,
    isActive: true
  };

    const table = staffData.role === 'phlebotomist' ? 'phlebotomist' : 'staff';
    const existing = this.getByRole(staffData.role);
    existing.push(newPerson);
    this.saveByRole(staffData.role, existing);

    // Save credentials locally
    this.saveCredentials(credentials);

    // Add to sync queue (both person and credentials)
    this.addToSyncQueue(table, 'create', newPerson);
    this.addToSyncQueue('users', 'create', credentials);

    console.log(`✅ ${staffData.role} created locally:`, newPerson.name);
    console.log(`🔑 Credentials:`, {
      username: credentials.username,
      password: credentials.password
    });

    return { person: newPerson, credentials };
  }



  updateStaff(id: string, updates: Partial<Person>): Person | null {
    const person = this.getStaffById(id);
    if (!person) return null;

    const role = person.role || 'staff';
    const data = this.getByRole(role);
    const index = data.findIndex(s => s.id === id);

    if (index === -1) return null;

    data[index] = {
      ...data[index],
      ...updates,
      updatedAt: new Date().toISOString(),
      syncStatus: 'pending'
    };

    this.saveByRole(role, data);

    const table = role === 'phlebotomist' ? 'phlebotomist' : 'staff';
    this.addToSyncQueue(table, 'update', data[index]);

    console.log(`✅ ${role} updated locally:`, data[index].name);
    return data[index];
  }

  async deleteStaff(id: string): Promise<boolean> {
    const person = this.getStaffById(id);
    if (!person) return false;

    const role = person.role || 'staff';
    
    // Remove from local storage
    const data = this.getByRole(role);
    const filtered = data.filter(s => s.id !== id);
    this.saveByRole(role, filtered);

    // Remove credentials
    this.removeCredentialsByPersonId(id);

    const table = role === 'phlebotomist' ? 'phlebotomist' : 'staff';
    
    // HARD DELETE
    this.addToSyncQueue(table, 'delete', { id, hardDelete: true });
    this.addToSyncQueue('users', 'delete', { personId: id, hardDelete: true });

    console.log(`✅ ${role} deleted permanently:`, person.name);
    return true;
  }

  

  // ============================================
  // CREDENTIALS MANAGEMENT
  // ============================================

  private generateUsername(name: string, phone: string): string {
    const cleanName = name.toLowerCase().replace(/\s+/g, '');
    const lastFourDigits = phone.slice(-4);
    return `${cleanName}${lastFourDigits}`;
  }

  private generatePassword(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  private saveCredentials({ username, password, role, isActive, id = '' }: UserCredentials): void {
    const existing: UserCredentials[] = this.getAllCredentials();
    const idx = existing.findIndex((c) => c.username === username);
    const credential: UserCredentials = {
      id: id || this.generateId('user'),
      username,
      password,
      role,
      personId: '', // Set appropriately if available
      isActive,
    };
    if (idx >= 0) {
      existing[idx] = credential;
    } else {
      existing.push(credential);
    }
    localStorage.setItem(this.CREDENTIALS_KEY, JSON.stringify(existing));
  }

  getAllCredentials(): UserCredentials[] {
    const data = localStorage.getItem(this.CREDENTIALS_KEY);
    return data ? JSON.parse(data) : [];
  }

  private removeCredentialsByPersonId(personId: string): void {
    const credentials = this.getAllCredentials();
    const filtered = credentials.filter(c => c.personId !== personId);
    localStorage.setItem(this.CREDENTIALS_KEY, JSON.stringify(filtered));
  }

  getCredentialsByPersonId(personId: string): UserCredentials | undefined {
    const credentials = this.getAllCredentials();
    return credentials.find(c => c.personId === personId);
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  private getByRole(role: 'staff' | 'phlebotomist'): Person[] {
    const key = role === 'phlebotomist' ? this.PHLEBO_KEY : this.STAFF_KEY;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private saveByRole(role: 'staff' | 'phlebotomist', data: Person[]): void {
    const key = role === 'phlebotomist' ? this.PHLEBO_KEY : this.STAFF_KEY;
    localStorage.setItem(key, JSON.stringify(data));
  }

  // ============================================
  // SYNC QUEUE
  // ============================================

  private addToSyncQueue(table: 'staff' | 'phlebotomist' | 'users', operation: string, data: any): void {
    const queue = this.getSyncQueue();
    
    const queueItem: SyncQueueItem = {
      id: this.generateId('sync'),
      table,
      operation: operation as any,
      data,
      timestamp: Date.now(),
      retries: 0
    };

    queue.push(queueItem);
    this.saveSyncQueue(queue);

    console.log('📝 Added to sync queue:', {
      table,
      operation,
      queueSize: queue.length
    });

    if (this.isOnline && !this.syncInProgress && this.supabaseEnabled) {
      setTimeout(() => this.syncQueue(), 500);
    }
  }

  private getSyncQueue(): SyncQueueItem[] {
    const data = localStorage.getItem(this.SYNC_QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveSyncQueue(queue: SyncQueueItem[]): void {
    localStorage.setItem(this.SYNC_QUEUE_KEY, JSON.stringify(queue));
  }

  async syncQueue(): Promise<void> {
    if (!this.isOnline) {
      return;
    }

    if (!this.supabaseEnabled) {
      // Clear queue if Supabase not configured
      this.saveSyncQueue([]);
      return;
    }

    if (this.syncInProgress) {
      return;
    }

    const queue = this.getSyncQueue();
    if (queue.length === 0) return;

    this.syncInProgress = true;
    console.log(`🔄 Syncing ${queue.length} items to Supabase...`);

    const processed: string[] = [];
    const failed: SyncQueueItem[] = [];

    for (const item of queue) {
      try {
        await this.syncItemToSupabase(item);
        processed.push(item.id);
        console.log(`  ✅ ${item.table} ${item.operation}`);
      } catch (error: any) {
        // Better error handling
        const errorMessage = error?.message || error?.error_description || String(error) || 'Unknown error';
        console.error(`  ❌ ${item.table} ${item.operation}:`, error.message);

        item.retries++;
        if (item.retries < 3) {
          failed.push(item);
        }else{
            console.error(`  ⛔ Max retries reached for ${item.table}/${item.operation}, discarding`);
        }
      }
    }

    this.saveSyncQueue(failed);

    if (processed.length > 0) {
      this.updateSyncStatus();
    }

    this.syncInProgress = false;
    console.log(`✅ Sync complete. ${processed.length} synced, ${failed.length} pending`);
  }

  private async syncItemToSupabase(item: SyncQueueItem): Promise<void> {

    if (!item || !item.table || !item.operation || !item.data) {
    console.error('Invalid sync item:', item);
    throw new Error('Invalid sync queue item structure');
  }

  const { table, operation, data } = item;

    

   try {
    switch (operation) {
      case 'create':
        if (table === 'users') {
          const userData = {
            id: data.id,
            username: data.username,
            password_hash: this.hashPassword(data.password),
            role: data.role,
            person_id: data.personId,
            is_active: data.isActive !== undefined ? data.isActive : true
          };
          
          console.log('📤 Creating user:', userData.username);
          
          const { error: userError } = await supabase.from('users').insert(userData);
          if (userError) {
            if (userError.code === '23505') {
              console.warn('⚠️ Username already exists, skipping');
              return;
            }
            console.error('User creation error:', userError);
            throw new Error(userError.message || 'Failed to create user');
          }
        } else {
          const createData = this.localToSupabase(data);
          delete (createData as any).role;
          
          console.log(`📤 Creating ${table}:`, createData.name);
          
          const { error: createError } = await supabase.from(table).insert(createData);
          if (createError) {
            if (createError.code === '23505') {
              console.warn(`⚠️ ${table} record already exists, skipping`);
              return;
            }
            console.error(`${table} creation error:`, createError);
            throw new Error(createError.message || `Failed to create ${table}`);
          }
        }
        break;

      case 'update':
        if (!data.id) {
          throw new Error('Update operation requires an id');
        }
        
        const updateData = this.localToSupabase(data);
        delete (updateData as any).role;
        
        console.log(`📤 Updating ${table}:`, data.id);
        
        const { error: updateError } = await supabase
          .from(table)
          .update(updateData)
          .eq('id', data.id);
        
        if (updateError) {
          console.error(`${table} update error:`, updateError);
          throw new Error(updateError.message || `Failed to update ${table}`);
        }
        break;

      case 'delete':
        if (!data.hardDelete) {
          console.warn('Soft delete not implemented, skipping');
          return;
        }
        
        if (table === 'users') {
          if (!data.personId) {
            throw new Error('Delete user operation requires personId');
          }
          
          console.log('📤 Deleting user with person_id:', data.personId);
          
          const { error: deleteUserError } = await supabase
            .from('users')
            .delete()
            .eq('person_id', data.personId);
          
          if (deleteUserError) {
            console.error('User deletion error:', deleteUserError);
            throw new Error(deleteUserError.message || 'Failed to delete user');
          }
        } else {
          if (!data.id) {
            throw new Error(`Delete ${table} operation requires an id`);
          }
          
          console.log(`📤 Deleting ${table}:`, data.id);
          
          const { error: deleteError } = await supabase
            .from(table)
            .delete()
            .eq('id', data.id);
          
          if (deleteError) {
            console.error(`${table} deletion error:`, deleteError);
            throw new Error(deleteError.message || `Failed to delete ${table}`);
          }
        }
        break;

      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  } catch (error: any) {
    // Re-throw with better error message
    const errorMsg = error?.message || error?.error_description || String(error) || 'Unknown sync error';
    throw new Error(`${table}/${operation}: ${errorMsg}`);
  }
}


  private hashPassword(password: string): string {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  // ============================================
  // DATA CONVERSION
  // ============================================

  private localToSupabase(person: Person): any {
    return {
      id: person.id,
      name: person.name,
      phone: person.phone,
      email: person.email || null,
      designation: person.designation,
      salary: person.salary,
      joining_date: person.joiningDate,
      photo: person.photo,
      status: person.status,
      created_at: person.createdAt,
      updated_at: person.updatedAt
    };
  }

  private supabaseToLocal(data: any, role: 'staff' | 'phlebotomist'): Person {
    return {
      id: data.id,
      name: data.name,
      phone: data.phone,
      email: data.email || '',
      designation: data.designation,
      salary: data.salary,
      joiningDate: data.joining_date,
      photo: data.photo || '👤',
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      syncStatus: 'synced',
      role
    };
  }

  private updateSyncStatus(): void {
    ['staff', 'phlebotomist'].forEach((role) => {
      const data = this.getByRole(role as any);
      let updated = false;

      data.forEach(s => {
        if (s.syncStatus === 'pending') {
          s.syncStatus = 'synced';
          updated = true;
        }
      });

      if (updated) {
        this.saveByRole(role as any, data);
      }
    });
  }

  // ============================================
  // UTILITY
  // ============================================

  private generateId(type: string): string {
    return `${type}_${Date.now().toString(36)}${Math.random().toString(36).substr(2, 9)}`;
  }

  getOnlineStatus(): boolean {
    return this.isOnline;
  }

  getPendingSyncCount(): number {
    return this.getSyncQueue().length;
  }

  isSupabaseEnabled(): boolean {
    return this.supabaseEnabled;
  }

  async forceSyncNow(): Promise<void> {
    await this.syncQueue();
  }

  initializeSampleData(): void {
    const existingStaff = this.getByRole('staff');
    const existingPhlebo = this.getByRole('phlebotomist');
    
    if (existingStaff.length === 0 && existingPhlebo.length === 0) {
      this.createStaff({
        name: 'Rajesh Kumar',
        role: 'staff',
        phone: '9876543210',
        email: 'rajesh@ashwani.com',
        designation: 'Lab Technician',
        salary: 25000,
        joiningDate: '2024-01-15',
        photo: '👨‍🔬',
        status: 'active'
      });

      this.createStaff({
        name: 'Priya Sharma',
        role: 'phlebotomist',
        phone: '9876543211',
        email: 'priya@ashwani.com',
        designation: 'Phlebotomist',
        salary: 20000,
        joiningDate: '2024-03-20',
        photo: '👩‍⚕️',
        status: 'active'
      });

      console.log('📝 Sample data initialized');
    }
  }
  
}


// Add this logic for local credential storage and retrieval
const CREDENTIALS_KEY = "adc_credentials";

// Save or Update a credential (for global utility function)
export function saveCredential({
  username,
  password,
  role,
  isActive,
}: {
  username: string;
  password: string;
  role: string;
  isActive: boolean;
}): void {
  const credentials: UserCredentials[] = JSON.parse(localStorage.getItem(CREDENTIALS_KEY) || "[]");
  const idx = credentials.findIndex((c) => c.username === username);
  const credential: UserCredentials = {
    id: '', // Add id if available
    username,
    password,
    role: role as UserCredentials['role'],
    personId: '', // Set appropriately if available
    isActive,
  };
  if (idx >= 0) {
    credentials[idx] = credential;
  } else {
    credentials.push(credential);
  }
  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
}

// Fetch all credentials (for offline login)
export function getAllCredentials(): UserCredentials[] {
  return JSON.parse(localStorage.getItem(CREDENTIALS_KEY) || "[]");
}

// Find by username and password, offline use
export function getCredentialByUsernameAndPassword(username: string, password: string): UserCredentials | undefined {
  const credentials: UserCredentials[] = JSON.parse(localStorage.getItem(CREDENTIALS_KEY) || "[]");
  return credentials.find((c) => c.username === username && c.password === password);
}

export const db = new DatabaseService();
export { supabase };


