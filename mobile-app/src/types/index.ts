export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: 'admin' | 'staff' | 'phlebotomist' | 'patient';
  status: 'active' | 'inactive';
  created_at: string;
}

export interface Patient {
  id: string;
  user_id: string;
  dob?: string;
  gender?: 'male' | 'female' | 'other';
  blood_group?: string;
  address?: Address;
  aadhar?: string;
  medical_history?: string[];
  family_members?: FamilyMember[];
}

export interface Address {
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface FamilyMember {
  name: string;
  relation: string;
  dob: string;
}

export interface Test {
  id: string;
  name: string;
  category: string;
  description?: string;
  price: number;
  discounted_price?: number;
  sample_type?: string;
  turnaround_time?: string;
  preparation?: string[];
  popular: boolean;
  status: string;
}

export interface Booking {
  id: string;
  booking_number: string;
  patient_id: string;
  patient_name: string;
  patient_phone: string;
  tests: BookingTest[];
  booking_type: 'lab_visit' | 'home_collection';
  booking_date: string;
  total_amount: number;
  discount: number;
  final_amount: number;
  payment_status: 'pending' | 'paid' | 'failed';
  payment_method?: string;
  status: 'pending' | 'assigned' | 'collected' | 'processing' | 'completed' | 'cancelled';
  created_at: string;
}

export interface BookingTest {
  test_id: string;
  name: string;
  price: number;
}

export interface HomeCollection {
  id: string;
  booking_id: string;
  patient_id: string;
  address: Address;
  scheduled_date: string;
  scheduled_time: string;
  phlebotomist_id?: string;
  phlebotomist_name?: string;
  phlebotomist_phone?: string;
  status: 'scheduled' | 'on_the_way' | 'collected' | 'cancelled';
  collection_time?: string;
  patient_signature?: string;
  notes?: string;
}
