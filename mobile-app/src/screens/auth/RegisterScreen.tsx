import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import authService from '../../services/auth.service';

export default function RegisterScreen({ navigation }: any) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    role: 'patient', // default role
  });
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'patient' | 'phlebotomist'>('patient');

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }

    if (!formData.phone || formData.phone.length !== 10) {
      Alert.alert('Error', 'Please enter valid 10-digit phone number');
      return false;
    }

    if (formData.email && !isValidEmail(formData.email)) {
      Alert.alert('Error', 'Please enter valid email address');
      return false;
    }

    return true;
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);

    // First, register user in database
    const userData = {
      ...formData,
      role: selectedRole,
      phone: `+91${formData.phone}`,
    };

    const registerResult = await authService.register(userData);

    if (registerResult.success) {
      // Then send OTP for verification
      const otpResult = await authService.sendOTP(`+91${formData.phone}`);

      setLoading(false);

      if (otpResult.success) {
        Alert.alert(
          'Success',
          'Registration successful! Please verify your phone number.',
          [
            {
              text: 'OK',
              onPress: () =>
                navigation.navigate('OTPScreen', {
                  phone: `+91${formData.phone}`,
                }),
            },
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to send OTP. Please try again.');
      }
    } else {
      setLoading(false);
      Alert.alert('Error', registerResult.error || 'Registration failed');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.icon}>📝</Text>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Fill in your details to get started</Text>

        {/* Full Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            autoCapitalize="words"
          />
        </View>

        {/* Phone Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number *</Text>
          <View style={styles.phoneInputContainer}>
            <Text style={styles.prefix}>+91</Text>
            <TextInput
              style={styles.phoneInput}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              maxLength={10}
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
            />
          </View>
        </View>

        {/* Email (Optional) */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="your.email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
          />
        </View>

        {/* Role Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Register As *</Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                selectedRole === 'patient' && styles.roleButtonActive,
              ]}
              onPress={() => setSelectedRole('patient')}
            >
              <Text style={styles.roleIcon}>👤</Text>
              <Text
                style={[
                  styles.roleText,
                  selectedRole === 'patient' && styles.roleTextActive,
                ]}
              >
                Patient
              </Text>
              <Text style={styles.roleDescription}>
                Book tests and view reports
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleButton,
                selectedRole === 'phlebotomist' && styles.roleButtonActive,
              ]}
              onPress={() => setSelectedRole('phlebotomist')}
            >
              <Text style={styles.roleIcon}>🩺</Text>
              <Text
                style={[
                  styles.roleText,
                  selectedRole === 'phlebotomist' && styles.roleTextActive,
                ]}
              >
                Phlebotomist
              </Text>
              <Text style={styles.roleDescription}>
                Collect samples from patients
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Register Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>

        {/* Terms */}
        <Text style={styles.termsText}>
          By registering, you agree to our{' '}
          <Text style={styles.termsLink}>Terms & Conditions</Text> and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>

        {/* Already have account */}
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('LoginScreen')}
        >
          <Text style={styles.linkText}>
            Already have an account? <Text style={styles.linkBold}>Login</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFCF9',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    color: '#21808D',
  },
  icon: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#134252',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#626C71',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#134252',
    marginBottom: 8,
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(94, 82, 64, 0.2)',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#134252',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(94, 82, 64, 0.2)',
  },
  prefix: {
    fontSize: 16,
    color: '#134252',
    paddingLeft: 16,
    paddingRight: 8,
    fontWeight: '500',
  },
  phoneInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#134252',
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(94, 82, 64, 0.2)',
    padding: 16,
    alignItems: 'center',
  },
  roleButtonActive: {
    borderColor: '#21808D',
    backgroundColor: 'rgba(33, 128, 141, 0.05)',
  },
  roleIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  roleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#626C71',
    marginBottom: 4,
  },
  roleTextActive: {
    color: '#21808D',
  },
  roleDescription: {
    fontSize: 11,
    color: '#626C71',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#21808D',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  termsText: {
    fontSize: 12,
    color: '#626C71',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  termsLink: {
    color: '#21808D',
    fontWeight: '500',
  },
  linkButton: {
    alignItems: 'center',
    marginTop: 8,
  },
  linkText: {
    fontSize: 14,
    color: '#626C71',
  },
  linkBold: {
    color: '#21808D',
    fontWeight: '600',
  },
});
