import { supabase } from '../config/supabase';

interface EmailCredentials {
  to: string;
  name: string;
  username: string;
  password: string;
  role: string;
  designation: string;
}

class EmailService {
  // Send credentials email
  async sendCredentialsEmail(credentials: EmailCredentials): Promise<boolean> {
    try {
      console.log('📧 Preparing to send credentials email to:', credentials.to);

      // Call Supabase Edge Function or API to send email
      const { data, error } = await supabase.functions.invoke('send-credentials-email', {
        body: {
          to: credentials.to,
          name: credentials.name,
          username: credentials.username,
          password: credentials.password,
          role: credentials.role,
          designation: credentials.designation
        }
      });

      if (error) throw error;

      console.log('✅ Email sent successfully to:', credentials.to);
      return true;
    } catch (error: any) {
      console.error('❌ Email send failed:', error.message);
      
      // Fallback: Log credentials for manual email
      console.log('📋 Manual email required for:', {
        to: credentials.to,
        username: credentials.username,
        password: credentials.password
      });
      
      return false;
    }
  }

  // Generate email template
  generateEmailTemplate(credentials: EmailCredentials): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #21808D, #32B8C6); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; }
    .credentials { background: white; padding: 20px; border-left: 4px solid #21808D; margin: 20px 0; }
    .credential-item { margin: 10px 0; }
    .credential-label { font-weight: bold; color: #555; }
    .credential-value { font-family: monospace; font-size: 16px; color: #21808D; background: #f0f0f0; padding: 8px; display: inline-block; border-radius: 4px; }
    .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
    .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏥 Ashwani Diagnostic Center</h1>
      <p>Welcome to Our Team!</p>
    </div>
    
    <div class="content">
      <h2>Hello ${credentials.name},</h2>
      
      <p>Welcome to Ashwani Diagnostic Center! Your account has been created successfully.</p>
      
      <p>Your position: <strong>${credentials.designation}</strong></p>
      
      <div class="credentials">
        <h3>Your Login Credentials</h3>
        
        <div class="credential-item">
          <span class="credential-label">Username:</span><br/>
          <span class="credential-value">${credentials.username}</span>
        </div>
        
        <div class="credential-item">
          <span class="credential-label">Password:</span><br/>
          <span class="credential-value">${credentials.password}</span>
        </div>
        
        <div class="credential-item">
          <span class="credential-label">Role:</span><br/>
          <span class="credential-value">${credentials.role}</span>
        </div>
      </div>
      
      <div class="warning">
        <strong>⚠️ Important Security Notice:</strong>
        <ul>
          <li>Please change your password after first login</li>
          <li>Do not share your credentials with anyone</li>
          <li>Keep this email in a secure place</li>
        </ul>
      </div>
      
      <p>If you have any questions or need assistance, please contact your administrator.</p>
      
      <p>Best regards,<br/>
      <strong>Ashwani Diagnostic Center Team</strong></p>
    </div>
    
    <div class="footer">
      <p>© 2025 Ashwani Diagnostic Center. All rights reserved.</p>
      <p>This is an automated email. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }
}

export const emailService = new EmailService();
