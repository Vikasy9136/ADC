import React, { useState } from 'react';

// Define the shape of credentials
export interface Credentials {
  username: string;
  password: string;
  role: string;
}

// Explicitly type props for the modal
interface CredentialsModalProps {
  credentials: Credentials;
  onClose: () => void;
}

export default function CredentialsModal({ credentials, onClose }: CredentialsModalProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    const text = `Username: ${credentials.username}\nPassword: ${credentials.password}\nRole: ${credentials.role}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert("Could not copy. Please focus this window and try again.");
    }
  };

  const downloadCredentials = () => {
    const text = `ASHWANI DIAGNOSTIC CENTER - LOGIN CREDENTIALS\n\nUsername: ${credentials.username}\nPassword: ${credentials.password}\nRole: ${credentials.role}\n\nGenerated: ${new Date().toLocaleString()}\nPlease keep these credentials safe and secure.`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `credentials_${credentials.username}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="credentials-box">
          <div><label>USERNAME</label>
            <div className="mono">{credentials.username}</div>
          </div>
          <div><label>PASSWORD</label>
            <div className="mono password">{credentials.password}</div>
          </div>
          <div><label>ROLE</label>
            <div className="role">{credentials.role}</div>
          </div>
        </div>
        <div className="important-note">
          <strong>Important:</strong> Please share these credentials securely with the staff member. They will need them to login to the system.
        </div>
        <div className="button-row">
          <button onClick={copyToClipboard}>{copied ? "✅ Copied!" : "📋 Copy"}</button>
          <button onClick={downloadCredentials}>📥 Download</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
      {/* Add CSS for modal overlay, layout, styles as desired */}
    </div>
  );
}
