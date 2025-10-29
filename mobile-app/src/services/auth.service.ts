import { supabase } from '../config/supabase';
import { User } from '../types';

export class AuthService {
  // Send OTP to phone
  async sendOTP(phone: string) {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: phone,
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
  console.error('Send OTP error:', error);
  return { success: false, error: error.message || JSON.stringify(error) };
}
  }

  // Verify OTP
  async verifyOTP(phone: string, token: string) {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phone,
        token: token,
        type: 'sms',
      });

      if (error) throw error;

      // Get user details
      if (data.user) {
        const userData = await this.getUserByPhone(phone);
        return { success: true, user: userData };
      }

      return { success: false, error: 'User not found' };
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      return { success: false, error: error.message };
    }
  }

  // Sign in with email/password
  async signInWithEmail(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const userData = await this.getUserById(data.user.id);
      return { success: true, user: userData };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  }

  // Register new user
  async register(userData: {
    name: string;
    phone: string;
    email?: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('patients')
        .insert([userData])
        .select()
        .single();

      if (error) throw error;
      return { success: true, user: data };
    } catch (error: any) {
      console.error('Register error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get current session
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  }

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get user by ID
  async getUserById(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  // Get user by phone
  async getUserByPhone(phone: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('phone', phone)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get user by phone error:', error);
      return null;
    }
  }
}

export default new AuthService();
