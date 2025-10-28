import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { supabase } from '../../config/supabase';

// Define types used in state and props
interface Branch {
  id?: string; // id may be optional when inserting new
  name: string;
  address: string;
  status: "active" | "coming_soon" | "maintenance";
  latitude: number | string;
  longitude: number | string;
}

interface LatLng {
  lat: number | string;
  lng: number | string;
}

interface MapPickerProps {
  lat: number | string;
  lng: number | string;
  onChange: (pos: LatLng) => void;
}

// Simple map stub for demo. Fixed props typing.
function MapPicker({ lat, lng, onChange }: MapPickerProps) {
  return (
    <div style={{ margin: '8px 0 16px 0', padding: 10, background: '#F3F4F6', borderRadius: 8 }}>
      <label>
        Latitude: 
        <input
          type="number"
          value={lat}
          onChange={(e) => onChange({ lat: +e.target.value, lng })}
          style={{ width: 80 }}
        />
      </label>{' '}
      <label>
        Longitude: 
        <input
          type="number"
          value={lng}
          onChange={(e) => onChange({ lat, lng: +e.target.value })}
          style={{ width: 80 }}
        />
      </label>
      <div style={{ fontSize: 12, color: '#888' }}>
        Use map picker in production for precise selection.
      </div>
    </div>
  );
}

const BRANCH_STATUS = [
  { value: "active", label: "Active" },
  { value: "coming_soon", label: "Coming Soon" },
  { value: "maintenance", label: "Maintenance" }
];


export default function BranchManagement() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editing, setEditing] = useState<Branch | null>(null);
  const [form, setForm] = useState<Branch>({
    name: "",
    address: "",
    status: "active",
    latitude: "",
    longitude: ""
  });


  useEffect(() => {
    loadBranches();
  }, []);


  async function loadBranches() {
    const { data } = await supabase.from("branches").select("*");
    setBranches(data || []);
  }


  const openModal = (item?: Branch) => {
    setEditing(item || null);
    setForm(item || {
      name: "",
      address: "",
      status: "active",
      latitude: "",
      longitude: ""
    });
    setShowModal(true);
  };


  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name) return alert("Branch name required");
    if (editing?.id) {
      await supabase.from("branches").update(form).eq("id", editing.id);
    } else {
      await supabase.from("branches").insert([form]);
    }
    setShowModal(false);
    await loadBranches();
  };


  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (window.confirm("Really delete branch?")) {
      await supabase.from("branches").delete().eq("id", id);
      await loadBranches();
    }
  };


  return (
    <div>
      <h3 style={{ fontWeight: 700, fontSize: 22, margin: "18px 0" }}>Branch Management</h3>
      <button
        onClick={() => openModal()}
        style={{
          marginBottom: 14,
          padding: "8px 22px",
          fontWeight: 'bold',
          background: '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          cursor: "pointer"
        }}
      >
        Add New Branch
      </button>
      <table className="table" style={{ width: '100%', background: '#fff' }}>
        <thead>
          <tr>
            <th>Name</th><th>Address</th><th>Status</th><th>Latitude</th><th>Longitude</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {branches.map(branch => (
            <tr key={branch.id}>
              <td>{branch.name}</td>
              <td>{branch.address}</td>
              <td>{BRANCH_STATUS.find(s => s.value === branch.status)?.label || branch.status}</td>
              <td>{branch.latitude}</td>
              <td>{branch.longitude}</td>
              <td>
                <button onClick={() => openModal(branch)}>Edit</button>
                <button style={{ marginLeft: 8 }} onClick={() => handleDelete(branch.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.18)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: '#fff', padding: 30, borderRadius: 12, minWidth: 350
          }}>
            <h4>{editing ? "Edit Branch" : "Add Branch"}</h4>
            <form onSubmit={handleSave}>
              <input
                type="text"
                placeholder="Branch Name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
                style={{ width: '100%', marginBottom: 10 }}
              />
              <input
                type="text"
                placeholder="Branch Address"
                value={form.address || ""}
                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                style={{ width: '100%', marginBottom: 10 }}
              />
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as Branch['status'] }))}
                style={{ width: '100%', marginBottom: 10 }}
              >
                {BRANCH_STATUS.map(opt =>
                  <option value={opt.value} key={opt.value}>{opt.label}</option>
                )}
              </select>
              <MapPicker
                lat={form.latitude}
                lng={form.longitude}
                onChange={({ lat, lng }) => setForm(f => ({ ...f, latitude: lat, longitude: lng }))}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
