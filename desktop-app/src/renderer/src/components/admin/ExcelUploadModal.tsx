import React, { useState } from 'react';
import * as XLSX from 'xlsx';

interface ExcelUploadModalProps {
  onUpload: (tests: any[]) => void;
  onClose: () => void;
}

export default function ExcelUploadModal({ onUpload, onClose }: ExcelUploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.name.match(/\.(xlsx|xls)$/)) {
      alert('Please select a valid Excel file (.xlsx or .xls)');
      return;
    }

    setFile(selectedFile);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Map Excel columns to our format
        const mappedData = jsonData.map((row: any) => ({
          test_code: row['Test Code'] || row['test_code'] || '',
          test_name: row['Test Name'] || row['test_name'] || '',
          test_category: row['Category'] || row['test_category'] || 'General',
          price: parseFloat(row['Price'] || row['price'] || '0'),
          sample_type: row['Sample Type'] || row['sample_type'] || '',
          department: row['Department'] || row['department'] || '',
          normal_range: row['Normal Range'] || row['normal_range'] || '',
          description: row['Description'] || row['description'] || '',
          preparation_notes: row['Preparation'] || row['preparation_notes'] || '',
          report_time: row['Report Time'] || row['report_time'] || '',
          is_active: true
        })).filter(test => test.test_code && test.test_name); // Only valid tests

        setPreviewData(mappedData);
        setIsProcessing(false);
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        alert('Error reading Excel file. Please check the format.');
        setIsProcessing(false);
      }
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  const handleUpload = () => {
    if (previewData.length === 0) {
      alert('No valid data found to upload');
      return;
    }

    onUpload(previewData);
  };

  const downloadTemplate = () => {
    const template = [
      {
        'Test Code': 'CBC',
        'Test Name': 'Complete Blood Count',
        'Category': 'Hematology',
        'Price': 300,
        'Sample Type': 'Blood',
        'Department': 'Pathology',
        'Normal Range': 'WBC: 4,000-10,000/μL',
        'Description': 'Complete blood count with differential',
        'Preparation': 'No fasting required',
        'Report Time': '2-4 hours'
      },
      {
        'Test Code': 'FBS',
        'Test Name': 'Fasting Blood Sugar',
        'Category': 'Biochemistry',
        'Price': 150,
        'Sample Type': 'Blood',
        'Department': 'Pathology',
        'Normal Range': '70-100 mg/dL',
        'Description': 'Glucose level after fasting',
        'Preparation': '8-12 hours fasting required',
        'Report Time': '1-2 hours'
      }
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(template);
    XLSX.utils.book_append_sheet(wb, ws, 'Tests Template');
    XLSX.writeFile(wb, 'tests_template.xlsx');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflow: 'auto',
        padding: '32px'
      }}>
        <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#134252', marginBottom: '8px' }}>
          📊 Bulk Upload Tests from Excel
        </h3>
        <p style={{ fontSize: '14px', color: '#626C71', marginBottom: '24px' }}>
          Upload multiple tests at once using an Excel file
        </p>

        {!file ? (
          <div>
            {/* File Drop Zone */}
            <div
              style={{
                border: `2px dashed ${dragActive ? '#21808D' : '#D1D5DB'}`,
                borderRadius: '12px',
                padding: '48px 24px',
                textAlign: 'center',
                background: dragActive ? '#F0F9FF' : '#F9FAFB',
                marginBottom: '24px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
              <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#134252', marginBottom: '8px' }}>
                Drop your Excel file here
              </h4>
              <p style={{ fontSize: '14px', color: '#626C71', marginBottom: '16px' }}>
                Or click to select a file
              </p>
              <p style={{ fontSize: '12px', color: '#9CA3AF' }}>
                Supports .xlsx and .xls files
              </p>
            </div>

            <input
              id="file-input"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />

            {/* Template Download */}
            <div style={{
              background: '#FEF3C7',
              border: '1px solid #FDE68A',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#92400E', marginBottom: '8px' }}>
                📋 Need a template?
              </h5>
              <p style={{ fontSize: '13px', color: '#92400E', marginBottom: '12px' }}>
                Download our Excel template with the correct column format
              </p>
              <button
                onClick={downloadTemplate}
                style={{
                  padding: '8px 16px',
                  background: '#F59E0B',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                📥 Download Template
              </button>
            </div>
          </div>
        ) : (
          <div>
            {isProcessing ? (
              <div style={{ textAlign: 'center', padding: '48px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
                <p style={{ fontSize: '16px', color: '#626C71' }}>Processing Excel file...</p>
              </div>
            ) : (
              <div>
                <div style={{
                  background: '#F0F9FF',
                  border: '1px solid #BAE6FD',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '24px'
                }}>
                  <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#0369A1', marginBottom: '8px' }}>
                    📄 File: {file.name}
                  </h5>
                  <p style={{ fontSize: '13px', color: '#0369A1' }}>
                    Found {previewData.length} valid test records
                  </p>
                </div>

                {previewData.length > 0 && (
                  <div style={{
                    maxHeight: '300px',
                    overflow: 'auto',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    marginBottom: '24px'
                  }}>
                    <table style={{ width: '100%', fontSize: '13px' }}>
                      <thead style={{ background: '#F9FAFB', position: 'sticky', top: 0 }}>
                        <tr>
                          <th style={{ padding: '12px', textAlign: 'left' }}>Code</th>
                          <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                          <th style={{ padding: '12px', textAlign: 'left' }}>Category</th>
                          <th style={{ padding: '12px', textAlign: 'left' }}>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.slice(0, 10).map((test, index) => (
                          <tr key={index} style={{ borderBottom: '1px solid #E5E7EB' }}>
                            <td style={{ padding: '12px' }}>{test.test_code}</td>
                            <td style={{ padding: '12px' }}>{test.test_name}</td>
                            <td style={{ padding: '12px' }}>{test.test_category}</td>
                            <td style={{ padding: '12px' }}>₹{test.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {previewData.length > 10 && (
                      <div style={{ padding: '12px', textAlign: 'center', color: '#9CA3AF', fontSize: '12px' }}>
                        ... and {previewData.length - 10} more tests
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 24px',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              background: 'white',
              color: '#374151',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          
          {file && previewData.length > 0 && (
            <button
              onClick={handleUpload}
              style={{
                padding: '10px 24px',
                border: 'none',
                borderRadius: '8px',
                background: '#21808D',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              📤 Upload {previewData.length} Tests
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
