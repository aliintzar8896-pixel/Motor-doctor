import nodemailer from 'nodemailer';
import config from '../config/env.js';

let cachedTransporter = null;

/**
 * Creates or retrieves a configured Nodemailer transporter.
 * Supports production SMTP credentials and automatic Ethereal test account for local dev.
 */
async function getTransporter() {
  // If production SMTP credentials provided
  if (config.SMTP_USER && config.SMTP_PASS) {
    return nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: config.SMTP_SECURE,
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS,
      },
    });
  }

  // If already created in-memory transporter
  if (cachedTransporter) {
    return cachedTransporter;
  }

  // Development fallback: Try Ethereal test account or JSON fallback
  try {
    const testAccount = await nodemailer.createTestAccount();
    cachedTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log(`📧 Nodemailer: Created Ethereal test mailer for local environment: ${testAccount.user}`);
    return cachedTransporter;
  } catch (err) {
    console.warn('⚠️ Nodemailer: Ethereal test account creation failed; using jsonTransport fallback:', err.message);
    cachedTransporter = nodemailer.createTransport({
      jsonTransport: true,
    });
    return cachedTransporter;
  }
}

/**
 * Sends an email notification to Admin (Intzar Ali <aliintzar8896@gmail.com>)
 * after a service request is confirmed and saved.
 *
 * @param {Object} serviceRequest - The saved ServiceRequest object
 * @returns {Promise<Object>} Delivery result object
 */
export async function sendAdminBookingAlert(serviceRequest) {
  const adminEmail = config.ADMIN_EMAIL || 'aliintzar8896@gmail.com';
  const adminName = config.ADMIN_NAME || 'Intzar Ali';

  const customerName = serviceRequest.userName || 'Vehicle Owner';
  const customerPhone = serviceRequest.userPhone || 'Not provided';
  const vehicleReg = serviceRequest.vehicleNumber || 'Unregistered';
  const vehicleModel = serviceRequest.vehicleModel || 'Car / Bike';
  const vehicleProblem = serviceRequest.description || serviceRequest.issueType || 'Breakdown Assistance';
  const requestId = serviceRequest.id || 'REQ-UNKNOWN';
  const location = serviceRequest.locationName || 'Moradabad Highway Corridor';
  const urgency = (serviceRequest.urgency || 'urgent').toUpperCase();
  const estimatedCost = serviceRequest.estimatedCost ? `₹${serviceRequest.estimatedCost}` : 'Diagnosis Pending';
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const subject = `🚨 Emergency Service Request Confirmed: [${requestId}] - ${customerName}`;

  const textContent = `
=====================================================
MOTOR DOCTOR 24x7 ROAD ASSISTANCE - ADMIN ALERT
=====================================================

Hello ${adminName},

A new emergency vehicle service request has been confirmed and saved to the database.

--- SERVICE REQUEST DETAILS ---
• Service Request ID:       ${requestId}
• Customer Name:            ${customerName}
• Contact / Mobile Number:  ${customerPhone}
• Vehicle Plate Number:     ${vehicleReg}
• Vehicle Make & Model:     ${vehicleModel}
• Reported Problem:         ${vehicleProblem}
• Breakdown Location:       ${location}
• Urgency Level:            ${urgency}
• Estimated Upfront Cost:   ${estimatedCost}
• Submission Time:          ${timestamp}

Assigned Mechanic: ${serviceRequest.mechanic?.name || 'Nearest Highway Partner'}

Access the Admin Management Panel at: http://localhost:8080/admin (or https://motordoctor.in/admin)
=====================================================
`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      margin: 0;
      padding: 24px;
      background-color: #030712;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #f8fafc;
    }
    .container {
      max-width: 620px;
      margin: 0 auto;
      background-color: #0b1120;
      border: 1px solid #1e293b;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }
    .header {
      background: linear-gradient(135deg, #b91c1c 0%, #ea580c 50%, #f59e0b 100%);
      padding: 32px 24px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 24px;
      font-weight: 900;
      letter-spacing: -0.5px;
      text-transform: uppercase;
    }
    .header p {
      margin: 8px 0 0;
      color: #fef08a;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .content {
      padding: 28px 24px;
    }
    .greeting {
      font-size: 16px;
      color: #e2e8f0;
      margin-bottom: 20px;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      background: rgba(239, 68, 68, 0.2);
      border: 1px solid #ef4444;
      color: #fca5a5;
      font-size: 12px;
      font-weight: 700;
      border-radius: 9999px;
    }
    .detail-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 12px;
      margin: 20px 0 24px;
      overflow: hidden;
    }
    .detail-table tr td {
      padding: 12px 18px;
      border-bottom: 1px solid #1f2937;
      font-size: 13px;
    }
    .detail-table tr:last-child td {
      border-bottom: none;
    }
    .label {
      color: #94a3b8;
      font-weight: 600;
      width: 38%;
    }
    .val {
      color: #f8fafc;
      font-weight: 700;
      width: 62%;
    }
    .req-id {
      color: #f59e0b;
      font-family: monospace;
      font-size: 14px;
    }
    .phone-link {
      color: #38bdf8;
      text-decoration: none;
    }
    .problem-box {
      background: #1e1b4b;
      border-left: 4px solid #ef4444;
      padding: 12px 16px;
      border-radius: 0 8px 8px 0;
      margin: 16px 0;
      color: #fed7aa;
      font-size: 13px;
    }
    .footer {
      background: #020617;
      padding: 20px;
      text-align: center;
      border-top: 1px solid #1e293b;
      color: #64748b;
      font-size: 11px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚨 Motor Doctor 24x7</h1>
      <p>NEW CONFIRMED BREAKDOWN SERVICE DISPATCH</p>
    </div>
    <div class="content">
      <div class="greeting">
        Hello <strong>${adminName}</strong>,
      </div>
      <p style="font-size: 13px; color: #cbd5e1; margin-top: 0; line-height: 1.5;">
        A new roadside breakdown service request has been confirmed and saved to the Motor Doctor backend.
      </p>

      <table class="detail-table">
        <tr>
          <td class="label">Request ID</td>
          <td class="val"><strong class="req-id">${requestId}</strong></td>
        </tr>
        <tr>
          <td class="label">Customer Name</td>
          <td class="val">${customerName}</td>
        </tr>
        <tr>
          <td class="label">Contact / Mobile</td>
          <td class="val"><a class="phone-link" href="tel:${customerPhone}">${customerPhone}</a></td>
        </tr>
        <tr>
          <td class="label">Vehicle Plate / Reg</td>
          <td class="val"><span style="background: #1e293b; padding: 2px 8px; border-radius: 4px; border: 1px solid #475569; letter-spacing: 1px;">${vehicleReg}</span></td>
        </tr>
        <tr>
          <td class="label">Vehicle Make & Model</td>
          <td class="val">${vehicleModel}</td>
        </tr>
        <tr>
          <td class="label">Vehicle Problem</td>
          <td class="val" style="color: #fca5a5;">${vehicleProblem}</td>
        </tr>
        <tr>
          <td class="label">Breakdown Location</td>
          <td class="val">${location}</td>
        </tr>
        <tr>
          <td class="label">Urgency Level</td>
          <td class="val"><span class="badge">${urgency}</span></td>
        </tr>
        <tr>
          <td class="label">Estimated Upfront Cost</td>
          <td class="val">${estimatedCost}</td>
        </tr>
        <tr>
          <td class="label">Logged Time</td>
          <td class="val" style="color: #94a3b8; font-weight: normal;">${timestamp}</td>
        </tr>
      </table>

      <div class="problem-box">
        <strong>Reported Issue Details:</strong><br />
        ${vehicleProblem}
      </div>

      <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 24px;">
        Mechanic has been alerted for dispatch. Monitor real-time status in your Motor Doctor Admin Dashboard.
      </p>
    </div>
    <div class="footer">
      Motor Doctor Autonomous Dispatch System &bull; Moradabad Highway Hub &bull; Admin: Intzar Ali
    </div>
  </div>
</body>
</html>
`;

  try {
    const transporter = await getTransporter();

    const info = await transporter.sendMail({
      from: config.SMTP_FROM,
      to: adminEmail,
      subject,
      text: textContent,
      html: htmlContent,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info) || null;
    console.log(`✅ [Nodemailer] Booking notification email sent to ${adminEmail} for ${requestId}`);
    if (previewUrl) {
      console.log(`🔗 [Nodemailer] Test message preview URL: ${previewUrl}`);
    }

    return {
      success: true,
      recipient: adminEmail,
      recipientName: adminName,
      messageId: info.messageId,
      previewUrl,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`❌ [Nodemailer] Failed to send email to ${adminEmail}:`, error.message);
    return {
      success: false,
      recipient: adminEmail,
      recipientName: adminName,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
}

export default {
  sendAdminBookingAlert,
};
