import React, { useState, useEffect } from 'react';
import TestModal from '../../components/admin/TestModal';
import TestTable from '../../components/admin/TestTable';
import ExcelUploadModal from '../../components/admin/ExcelUploadModal';
import StatBox from '../../components/common/StateBox';
import { testDb } from '../../services/testDb';

export default function TestManagement() {
  const [tests, setTests] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [editingTest, setEditingTest] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSync, setPendingSync] = useState(0);

  useEffect(() => {
    testDb.initializeSampleData();
    loadTests();

    const interval = setInterval(() => {
      setIsOnline(testDb.getOnlineStatus());
      setPendingSync(testDb.getPendingSyncCount());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const loadTests = () => {
    const data = testDb.getAllTests();
    setTests(data);
  };

  const handleAdd = () => {
    setEditingTest(null);
    setShowModal(true);
  };

  const handleEdit = (item: any) => {
    setEditingTest(item);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this test?')) {
      testDb.deleteTest(id);
      loadTests();
    }
  };

  const handleSave = (data: any) => {
    if (editingTest) {
      testDb.updateTest(editingTest.id, data);
    } else {
      const result = testDb.createTest(data);
      if ('error' in result) {
        alert(result.error);
        return;
      }
    }
    loadTests();
    setShowModal(false);
  };

  const handleExcelUpload = (testData: any[]) => {
    const results = testDb.bulkCreateTests(testData);
    loadTests();
    setShowExcelModal(false);
    
    alert(`Successfully imported ${results.success} tests. ${results.failed} failed.`);
  };

  const handleManualSync = async () => {
    await testDb.forceSyncNow();
    loadTests();
  };

 const categories = [...new Set(tests.map(t => t.test_category).filter(Boolean))];
  
  const filteredTests = tests.filter(t => {
  const matchesSearch = (t.test_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (t.test_code || '').toLowerCase().includes(searchTerm.toLowerCase());
  const matchesCategory = filterCategory === 'all' || t.test_category === filterCategory;
  return matchesSearch && matchesCategory;
});

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#134252', marginBottom: '4px' }}>
            Test Management
          </h2>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <p style={{ fontSize: '14px', color: '#626C71', margin: 0 }}>
              Manage all diagnostic tests and lab services
            </p>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '12px',
              background: isOnline ? '#DCFCE7' : '#FEE2E2',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: isOnline ? '#10B981' : '#EF4444'
              }} />
              <span style={{ color: isOnline ? '#059669' : '#DC2626' }}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            {pendingSync > 0 && (
              <div style={{
                padding: '4px 12px',
                borderRadius: '12px',
                background: '#FEF3C7',
                color: '#92400E',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                🔄 {pendingSync} pending sync
              </div>
            )}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          {pendingSync > 0 && (
            <button
              onClick={handleManualSync}
              style={{
                padding: '12px 24px',
                background: '#F59E0B',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>🔄</span> Sync Now ({pendingSync})
            </button>
          )}

          <button
            onClick={() => setShowExcelModal(true)}
            style={{
              padding: '12px 24px',
              background: '#10B981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>📊</span> Bulk Upload (Excel)
          </button>

          <button
            onClick={handleAdd}
            style={{
              padding: '12px 24px',
              background: '#21808D',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>➕</span> Add New Test
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        marginBottom: '24px',
        display: 'flex',
        gap: '16px',
        alignItems: 'center'
      }}>
        <input
          type="text"
          placeholder="🔍 Search by test name or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            padding: '10px 16px',
            border: '1px solid #D1D5DB',
            borderRadius: '8px',
            fontSize: '14px'
          }}
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{
            padding: '10px 16px',
            border: '1px solid #D1D5DB',
            borderRadius: '8px',
            fontSize: '14px',
            minWidth: '200px'
          }}
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <StatBox icon="🧪" label="Total Tests" value={tests.length.toString()} color="#3B82F6" />
        <StatBox icon="🩺" label="Active Tests" value={tests.filter(t => t.is_active).length.toString()} color="#10B981" />
        <StatBox icon="📊" label="Categories" value={categories.length.toString()} color="#8B5CF6" />
        <StatBox icon="💰" label="Avg Price" value={`₹${Math.round(tests.reduce((sum, t) => sum + t.price, 0) / tests.length || 0)}`} color="#F59E0B" />
      </div>

      {/* Tests Table */}
      <TestTable
        tests={filteredTests}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modals */}
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
