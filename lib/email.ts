import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

interface SendEmailProps {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailProps) {
    try {
        const info = await transporter.sendMail({
            from: `"QuickSell Marketplace" <${process.env.EMAIL_USER}>`, // FIX: EMAIL_USER භාවිත කළා
            to,
            subject,
            html,
        });

        console.log("Message sent successfully:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, error };
    }
}

// Ads Approve
export async function sendAdApprovedEmail(userEmail: string, adTitle: string) {
    const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f5;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 24px; border-radius: 8px;">
        <h2 style="color: #16a34a;">Your Ad is Now Live!</h2>
        <p>Great news! Your advertisement <strong>"${adTitle}"</strong> has been approved by our moderation team and is now visible on QuickSell.</p>
        <a href="http://localhost:3000" style="display: inline-block; background: #4f46e5; color: #ffffff; font-weight: bold; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin-top: 12px;">View Marketplace</a>
      </div>
    </div>
  `;

    return sendEmail({
        to: userEmail,
        subject: `Your Ad "${adTitle}" Has Been Approved!`,
        html,
    });
}

// Ads Reject
export async function sendAdRejectedEmail(userEmail: string, adTitle: string, reason: string) {
    const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f5;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 24px; border-radius: 8px;">
        <h2 style="color: #dc2626;">Action Required: Ad Rejected</h2>
        <p>Unfortunately, your advertisement <strong>"${adTitle}"</strong> was rejected by our moderation team.</p>
        <p style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 12px; font-style: italic;">
          <strong>Reason:</strong> ${reason || "Does not meet our content guidelines."}
        </p>
        <p>Please update your ad details and resubmit.</p>
      </div>
    </div>
  `;

    return sendEmail({
        to: userEmail,
        subject: `Updates Required for Your Ad "${adTitle}"`,
        html,
    });
}