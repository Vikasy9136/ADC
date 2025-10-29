import React, { useState, useEffect } from 'react';
import TestModal from '../../components/admin/TestModal';
import TestTable from '../../components/admin/TestTable';
import ExcelUploadModal from '../../components/admin/ExcelUploadModal';
import { testDb } from '../../services/testDb';

export default function TestManagement() {
  const [tests, setTests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const loadTests = async () => { setTests(await testDb.getAllTests()); };

  useEffect(() => {
    testDb.initializeSampleData();
    loadTests();
  }, []);

  const handleAdd = () => { setEditingTest(null); setShowModal(true); };
  const handleEdit = (item) => { setEditingTest(item); setShowModal(true); };
  const handleDelete = async (id) => {
    if (window.confirm('Delete?')) { await testDb.deleteTest(id); loadTests(); }
  };
  const handleSave = async (data) => {
    if (editingTest) await testDb.updateTest(editingTest.id, data);
    else {
      const result = await testDb.createTest(data);
      if ('error' in result) { alert(result.error); return; }
    }
    loadTests();
    setShowModal(false);
  };
  const handleExcelUpload = async (testData) => {
    let success = 0, failed = 0;
    for (const t of testData) {
      const res = await testDb.createTest(t); if ('error' in res) failed++; else success++;
    }
    loadTests(); setShowExcelModal(false);
    alert(`Successfully imported ${success} tests. ${failed} failed.`);
  };

  const categories = [...new Set(tests.map(t => t.test_category).filter(Boolean))];
  const filteredTests = tests.filter(t => {
    const matchesSearch = (t.test_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (t.test_code || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || t.test_category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ background: '#FCFEF8', minHeight: '100vh', padding: 0 }}>
      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 12px 0 18px', background: '#FCFEF8' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#134252', margin: 0 }}>Test Management</h2>
        <div>
          <button
            onClick={() => setShowExcelModal(true)}
            style={{
              background: 'orange',
              padding: '8px 16px',
              borderRadius: 8,
              color: '#0f243dff',
              fontWeight: 500,
              border: 'none',
              marginRight: 12,
              fontSize: '1rem',
              cursor: 'pointer'
            }}>
            Bulk Upload (Excel)
          </button>
          <button
            onClick={handleAdd}
            style={{
              background: '#A5D8E9',
              padding: '8px 16px',
              borderRadius: 8,
              color: '#1E3A5C',
              fontWeight: 500,
              border: 'none',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}>
            Add New Test
          </button>
        </div>
      </div>
      {/* Search + Filter */}
      <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 28, margin: '24px 0 0 0' }}>
        <span style={{ marginRight: 8, fontSize: 18, color: '#21808D' }}>🔍</span>
        <input
          type="text"
          placeholder="Search by test name or code..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            border: '1px solid #21808D',
            borderRadius: 8,
            padding: '8px 12px',
            outline: 'none',
            fontSize: 16,
            background: 'transparent',
            color: '#313B42',
            width: 230
          }}
        />
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
          style={{
            border: '1px solid #21808D',
            borderRadius: 8,
            padding: '8px 12px',
            outline: 'none',
            fontSize: 16,
            color: '#21808D',
            fontWeight: 600,
            background: 'transparent',
            marginLeft: 10,
            cursor: 'pointer',
          }}>
          <option value="all">All Categories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
      {/* Table */}
      <div style={{ padding: '24px 16px 0 16px' }}>
        <TestTable
          tests={filteredTests}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      {/* Modal dialogs */}
      {showModal && (
        <TestModal
          test={editingTest}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
      {showExcelModal && (
        <ExcelUploadModal
          onUpload={handleExcelUpload}
          onClose={() => setShowExcelModal(false)}
        />
      )}
    </div>
  );
}
