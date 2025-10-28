export type StaffRole = 'admin' | 'phlebotomist' | 'labstaff' | 'receptionist';

export interface Staff {
  id?: string;
  full_name: string;
  email: string;
  phone?: string;
  role: StaffRole;
  is_active: boolean;
  created_at?: string;
}
