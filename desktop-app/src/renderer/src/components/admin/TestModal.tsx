import React, { useState } from 'react';

interface TestModalProps {
  test?: any;
  onSave: (data: any) => void;
  onClose: () => void;
}

export default function TestModal({ test, onSave, onClose }: TestModalProps) {
  const [formData, setFormData] = useState(test || {
    test_code: '',
    test_name: '',
    test_category: '',
    price: '',
    sample_type: '',
    department: '',
    normal_range: '',
    description: '',
    preparation_notes: '',
    report_time: '',
    is_active: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.test_code.trim() || !formData.test_name.trim()) {
      alert('Test Code and Name are required');
      return;
    }
    if (!formData.test_category.trim()) {
      alert('Category is required');
      return;
    }
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      alert('Please enter a valid price');
      return;
    }

    onSave({ ...formData, price: parseFloat(formData.price) });
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: 'white', borderRadius: '16px', minWidth: '420px', padding: '28px',
        maxWidth: '90vw', maxHeight: '96vh', overflow: 'auto', boxShadow: '0 12px 40px #0001'
      }}>
        <h3 style={{
          fontSize: '20px', fontWeight: '700', color: '#134252', marginBottom: '18px'
        }}>
          {test ? 'Edit Test' : 'Add New Test'}
        </h3>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={labelStyle}>Test Code *</label>
              <input type="text" value={formData.test_code} onChange={e => setFormData({ ...formData, test_code: e.target.value })} style={inputStyle} required disabled={!!test} />
            </div>
            <div>
              <label style={labelStyle}>Test Name *</label>
              <input type="text" value={formData.test_name} onChange={e => setFormData({ ...formData, test_name: e.target.value })} style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>Category *</label>
              <input type="text" value={formData.test_category} onChange={e => setFormData({ ...formData, test_category: e.target.value })} style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>Price (₹) *</label>
              <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} style={inputStyle} min="0" required />
            </div>
            <div>
              <label style={labelStyle}>Sample Type</label>
              <input type="text" value={formData.sample_type} onChange={e => setFormData({ ...formData, sample_type: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Department</label>
              <input type="text" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Normal Range</label>
              <input type="text" value={formData.normal_range} onChange={e => setFormData({ ...formData, normal_range: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Report Time</label>
              <input type="text" value={formData.report_time} onChange={e => setFormData({ ...formData, report_time: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1/3' }}>
              <label style={labelStyle}>Description</label>
              <input type="text" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1/3' }}>
              <label style={labelStyle}>Preparation Notes</label>
              <input type="text" value={formData.preparation_notes} onChange={e => setFormData({ ...formData, preparation_notes: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select value={formData.is_active ? 'active' : 'inactive'} onChange={e => setFormData({ ...formData, is_active: e.target.value === 'active' })} style={inputStyle}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '28px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{
              padding: '10px 24px', border: '1px solid #D1D5DB', borderRadius: '8px',
              background: 'white', color: '#374151', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
            }}>Cancel</button>
            <button type="submit" style={{
              padding: '10px 24px', border: 'none', borderRadius: '8px','background': '#21808D',
              color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
            }}>{test ? 'Update Test' : 'Add Test'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '14px',
  fontWeight: '500',
  color: '#374151',
  marginBottom: '6px'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  border: '1px solid #D1D5DB',
  borderRadius: '8px',
  fontSize: '14px',
  transition: 'all 0.2s',
  outline: 'none'
};
