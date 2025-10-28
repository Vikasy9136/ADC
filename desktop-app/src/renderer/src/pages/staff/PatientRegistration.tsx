import React, { useState } from 'react';

export default function PatientRegistration() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    dob: '',
    gender: '',
    blood_group: '',
    address: '',
    aadhar: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!formData.name || !formData.phone) {
      setMessage({ type: 'error', text: 'Name and phone are required' });
      return;
    }

    if (formData.phone.length !== 10) {
      setMessage({ type: 'error', text: 'Phone must be 10 digits' });
      return;
    }

    setLoading(true);

    // Simulate success (database will be connected later)
    setTimeout(() => {
      setMessage({ type: 'success', text: 'Patient registered successfully! (Demo mode - Database not connected)' });
      setFormData({
        name: '',
        phone: '',
        email: '',
        dob: '',
        gender: '',
        blood_group: '',
        address: '',
        aadhar: '',
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={{ maxWidth: '1024px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#134252', marginBottom: '24px' }}>
        Patient Registration
      </h2>

      {message && (
        <div
          style={{
            marginBottom: '24px',
            padding: '16px',
            borderRadius: '8px',
            backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2',
            border: `1px solid ${message.type === 'success' ? '#86efac' : '#fca5a5'}`,
            color: message.type === 'success' ? '#166534' : '#991b1b',
          }}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Full Name */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#134252', marginBottom: '8px' }}>
              Full Name <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                outline: 'none',
              }}
              placeholder="Enter full name"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#134252', marginBottom: '8px' }}>
              Phone Number <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              maxLength={10}
              style={{
                width: '100%',
                padding: '8px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                outline: 'none',
              }}
              placeholder="10-digit mobile number"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#134252', marginBottom: '8px' }}>
              Email (Optional)
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                outline: 'none',
              }}
              placeholder="email@example.com"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#134252', marginBottom: '8px' }}>
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                outline: 'none',
              }}
            />
          </div>

          {/* Gender */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#134252', marginBottom: '8px' }}>
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                outline: 'none',
              }}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Blood Group */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#134252', marginBottom: '8px' }}>
              Blood Group
            </label>
            <select
              name="blood_group"
              value={formData.blood_group}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                outline: 'none',
              }}
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          {/* Aadhar */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#134252', marginBottom: '8px' }}>
              Aadhar Number (Optional)
            </label>
            <input
              type="text"
              name="aadhar"
              value={formData.aadhar}
              onChange={handleChange}
              maxLength={12}
              style={{
                width: '100%',
                padding: '8px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                outline: 'none',
              }}
              placeholder="12-digit Aadhar number"
            />
          </div>

          {/* Address */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#134252', marginBottom: '8px' }}>
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              style={{
                width: '100%',
                padding: '8px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                outline: 'none',
                resize: 'none',
              }}
              placeholder="Enter complete address"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '24px' }}>
          <button
            type="button"
            onClick={() => setFormData({
              name: '', phone: '', email: '', dob: '', gender: '',
              blood_group: '', address: '', aadhar: '',
            })}
            style={{
              padding: '8px 24px',
              border: '1px solid #d1d5db',
              color: '#134252',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: 'white',
            }}
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '8px 24px',
              backgroundColor: loading ? '#9ca3af' : '#21808D',
              color: 'white',
              borderRadius: '8px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Registering...' : 'Register Patient'}
          </button>
        </div>
      </form>
    </div>
  );
}
