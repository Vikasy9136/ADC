import React, { useEffect, useState } from 'react';
import { supabase } from "../../services/supabaseClient";

function randomPassword(len = 10) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$";
  let pass = "";
  for (let i = 0; i < len; i++) pass += chars[Math.floor(Math.random() * chars.length)];
  return pass;
}

interface StaffModalProps {
  staff?: any;
  onSave: (data: any) => void;
  onClose: () => void;
}

export default function StaffModal({ staff, onSave, onClose }: StaffModalProps) {
  const [formData, setFormData] = useState({
    photo: staff?.photo || '👨‍🔬',
    name: staff?.name || '',
    role: staff?.role || 'staff',
    designation: staff?.designation || '',
    phone: staff?.phone || '',
    email: staff?.email || '',
    salary: staff?.salary || '',
    joined_at: staff?.joined_at || '',
    status: staff?.status || 'active',
    branch_id: staff?.branch_id || '',
  });

  const [branches, setBranches] = useState<any[]>([]);
  const [generatedPassword, setGeneratedPassword] = useState("");

  useEffect(() => {
    supabase.from('branches').select('id,name').then(({ data }) => setBranches(data || []));
  }, []);

  const photoOptions = ['👨‍🔬', '👩‍🔬', '👨‍⚕️', '👩‍⚕️', '👨', '👩', '🧑‍🔬', '🧑‍⚕️'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert('Please enter full name');
    if (!formData.designation.trim()) return alert('Please enter designation');
    if (formData.phone.length < 10) return alert('Please enter a valid 10-digit phone number');
    if (!formData.salary || Number(formData.salary) <= 0) return alert('Enter valid salary');
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return alert('Please enter a valid email');

    if (!staff) {
      const password = randomPassword(10);
      setGeneratedPassword(password);

      const { error } = await supabase.from("staff").insert([{
        name: formData.name,
        role: formData.role,
        designation: formData.designation,
        phone: formData.phone,
        email: formData.email,
        salary: Number(formData.salary),
        joined_at: formData.joined_at,
        photo: formData.photo,
        status: formData.status,
        branch_id: formData.branch_id,
        password,
      }]);
      if (error) {
        alert("Error saving staff: " + error.message);
        return;
      }
      // No alert! Just send to parent for modal.
      onSave({ ...formData, branch_id: formData.branch_id, password });
    } else {
      const { error } = await supabase.from("staff").update({
        name: formData.name,
        role: formData.role,
        designation: formData.designation,
        phone: formData.phone,
        email: formData.email,
        salary: Number(formData.salary),
        joined_at: formData.joined_at,
        photo: formData.photo,
        status: formData.status,
        branch_id: formData.branch_id,
      }).eq("id", staff.id);
      if (error) {
        alert("Error updating staff: " + error.message);
        return;
      }
      onSave({ ...formData, id: staff.id, branch_id: formData.branch_id });
    }
    onClose();
  };


  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: 'white', borderRadius: '16px', width: '95%', maxWidth: 600, padding: 32,
        maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.18)'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#134252', marginBottom: 24 }}>
          {staff ? 'Edit Staff Member' : 'Add New Staff Member'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Profile Photo</label>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {photoOptions.map(photo => (
                <button key={photo} type="button"
                  onClick={() => setFormData(f => ({ ...f, photo }))}
                  style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: formData.photo === photo ? "#E0F2F1" : "white",
                    border: formData.photo === photo ? "3px solid #21808D" : "2px solid #E5E7EB",
                    fontSize: 24, cursor: 'pointer'
                  }}
                >{photo}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>Full Name *</label>
              <input type="text" value={formData.name}
                onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>Role *</label>
              <select value={formData.role}
                onChange={e => setFormData(f => ({ ...f, role: e.target.value }))}
                style={inputStyle} required disabled={!!staff}>
                <option value="staff">Staff</option>
                <option value="phlebotomist">Phlebotomist</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Phone Number *</label>
              <input type="tel" value={formData.phone} maxLength={10}
                onChange={e => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 10) setFormData(f => ({ ...f, phone: value }));
                }}
                style={inputStyle} required disabled={!!staff} />
              <small style={{ fontSize: 12, color: '#9CA3AF' }}>
                {formData.phone.length}/10 digits
              </small>
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" value={formData.email}
                onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
                style={inputStyle}
                placeholder="email@example.com" />
              <small style={{ fontSize: 12, color: '#9CA3AF' }}>
                Optional - used for credentials email
              </small>
            </div>
            <div>
              <label style={labelStyle}>Designation *</label>
              <input type="text" value={formData.designation}
                onChange={e => setFormData(f => ({ ...f, designation: e.target.value }))}
                style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>Monthly Salary (₹) *</label>
              <input type="number" value={formData.salary}
                onChange={e => setFormData(f => ({ ...f, salary: e.target.value }))}
                style={inputStyle} min="0" required />
            </div>
            <div>
              <label style={labelStyle}>Joining Date *</label>
              <input type="date" value={formData.joined_at}
                onChange={e => setFormData(f => ({ ...f, joined_at: e.target.value }))}
                style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select value={formData.status}
                onChange={e => setFormData(f => ({ ...f, status: e.target.value }))}
                style={inputStyle}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
            <label style={labelStyle}>Assign to Branch</label>
            <select value={formData.branch_id} onChange={e => setFormData(f => ({ ...f, branch_id: e.target.value }))}
              style={inputStyle} required>
              <option value="">-- Select Branch --</option>
              {branches.map(branch =>
                <option key={branch.id} value={branch.id}>{branch.name}</option>
              )}
            </select>
          </div>
          </div>
          {!staff && generatedPassword &&
            <div style={{
              marginTop: 18, background: "#F0F9FF", padding: 12, borderRadius: 8, color: "#31546b"
            }}>
              <b>Auto-generated password:</b> <code>{generatedPassword}</code>
            </div>
          }
          <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{
              padding: '10px 24px', border: '1px solid #D1D5DB',
              borderRadius: 8, background: 'white', color: '#374151',
              fontSize: 14, fontWeight: 600, cursor: 'pointer'
            }}>Cancel</button>
            <button type="submit" style={{
              padding: '10px 24px', border: 'none',
              borderRadius: 8, background: '#21808D', color: 'white',
              fontSize: 14, fontWeight: 600, cursor: 'pointer'
            }}>
              {staff ? '✅ Update' : '➕ Add'} Staff
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: 6
};
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: '1px solid #D1D5DB', borderRadius: '8px',
  fontSize: '14px', transition: 'all 0.2s', outline: 'none'
};
