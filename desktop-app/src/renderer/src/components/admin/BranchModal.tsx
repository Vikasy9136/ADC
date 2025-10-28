import React, { useState, ChangeEvent, FormEvent } from 'react';
import MapPicker from '../../components/common/MapPicker';

// Accept null | string | number for form compatibility
interface Branch {
  id?: string;
  name: string;
  address: string;
  status: "active" | "coming_soon" | "maintenance";
  latitude: number | string | null;
  longitude: number | string | null;
}

interface BranchModalProps {
  branch?: Branch | null;
  onSave: (branch: Branch) => void;
  onClose: () => void;
}

const BRANCH_STATUS = [
  { value: 'active', label: 'Active' },
  { value: 'coming_soon', label: 'Coming Soon' },
  { value: 'maintenance', label: 'Maintenance' }
];

export default function BranchModal({ branch, onSave, onClose }: BranchModalProps) {
  const [form, setForm] = useState<Branch>(branch || {
    name: '',
    address: '',
    latitude: null,
    longitude: null,
    status: 'active',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({
      ...f,
      [name]: (name === "latitude" || name === "longitude")
        ? (value === "" ? null : value)
        : value
    }));
  };

  function handleLatLng(position: { lat?: number; lng?: number }) {
    setForm(f => ({
      ...f,
      latitude: position.lat ?? null,
      longitude: position.lng ?? null
    }));
  }

  // Always cast to number or undefined before passing to MapPicker
  const latitudeNumber = form.latitude === null || form.latitude === "" ? undefined : Number(form.latitude);
  const longitudeNumber = form.longitude === null || form.longitude === "" ? undefined : Number(form.longitude);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Optionally cast lat/lng to number for saving
    onSave({
      ...form,
      latitude: latitudeNumber ?? null, // for DB
      longitude: longitudeNumber ?? null,
    });
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(33,128,141,0.14)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: "#FFFFFE", border: 'none', borderRadius: 18, minWidth: 340,
        boxShadow: "0 10px 38px rgba(33,128,141,0.08)", padding: "36px 32px 32px 32px", maxWidth: 480
      }}>
        <h2 style={{
          background: "linear-gradient(135deg, #21808D 0%, #32B8C6 100%)",
          backgroundClip: "text", WebkitBackgroundClip: "text",
          color: "transparent", WebkitTextFillColor: "transparent",
          fontWeight: 700, fontSize: 23, margin: "0 0 19px 0"
        }}>
          {branch ? "Edit Branch" : "Add Branch"}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Branch Name"
            required
            style={modalInputStyle}
          />
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Branch Address"
            style={modalInputStyle}
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            style={modalInputStyle}
          >
            {BRANCH_STATUS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <input
            type="number"
            name="latitude"
            value={form.latitude ?? ""}
            onChange={handleChange}
            placeholder="Latitude"
            style={modalInputStyle}
          />
          <input
            type="number"
            name="longitude"
            value={form.longitude ?? ""}
            onChange={handleChange}
            placeholder="Longitude"
            style={modalInputStyle}
          />
          <MapPicker
            lat={latitudeNumber}
            lng={longitudeNumber}
            onChange={({ lat, lng }) => handleLatLng({ lat, lng })}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
            <button type="button" onClick={onClose} style={cancelBtn}>Cancel</button>
            <button type="submit" style={saveBtn}>{branch ? "Update" : "Save"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const modalInputStyle: React.CSSProperties = {
  width: '100%', marginBottom: 14, padding: "12px 14px",
  border: "1px solid rgba(94,82,64,0.2)", borderRadius: 8,
  background: "#F8F9FA", color: "#134252", fontWeight: 600,
  fontSize: 15, outline: "none"
};
const saveBtn: React.CSSProperties = {
  padding: "12px 38px", borderRadius: 8, border: "none",
  fontWeight: 700, fontSize: 16, color: "#fff", background: "linear-gradient(135deg, #21808D 0%, #32B8C6 100%)",
  letterSpacing: ".1px", cursor: "pointer"
};
const cancelBtn: React.CSSProperties = {
  ...saveBtn,
  background: "#F8F9FA",
  border: "1px solid rgba(94,82,64,0.17)",
  color: "#21808D"
};
