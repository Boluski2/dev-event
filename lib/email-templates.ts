 interface EventInfo {
  title: string;
  date: string;
  time: string;
  location: string;
  mode: string;
  slug: string;
}
export function generateBookingConfirmationEmail(
  email: string,
  event: EventInfo
): { subject: string; html: string } {
  const subject = `🎉 Booking Confirmed: ${event.title}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 0; background-color: #f9fafb; }
            .header { background-color: #4F46E5; color: white; padding: 30px 20px; text-align: center; }
            .content { padding: 30px; }
            .event-details { background-color: white; padding: 25px; border-radius: 10px; margin: 25px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .detail-item { margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #f0f0f0; }
            .detail-item:last-child { border-bottom: none; }
            .button { 
                display: inline-block; 
                background-color: #4F46E5; 
                color: white !important; 
                padding: 14px 28px; 
                text-decoration: none; 
                border-radius: 8px; 
                font-weight: bold;
                font-size: 16px;
                text-align: center;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
            }
            .button:hover { 
                background-color: #4338CA; 
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(79, 70, 229, 0.4);
            }
            .button:active {
                transform: translateY(0);
            }
            .footer { 
                margin-top: 40px; 
                padding-top: 25px; 
                border-top: 1px solid #e5e7eb; 
                color: #6b7280; 
                font-size: 14px; 
            }
            .button-container {
                text-align: center;
                margin: 30px 0;
            }
            h1 { margin: 0; font-size: 28px; }
            h2 { color: #374151; margin-top: 0; }
            strong { color: #1F2937; }
            p { margin: 16px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Booking Confirmed!</h1>
            </div>
            <div class="content">
                <p>Hello,</p>
                <p>Thank you for booking a spot for <strong>${event.title}</strong>. We're excited to have you join us!</p>
                
                <div class="event-details">
                    <h2>📋 Event Details</h2>
                    <div class="detail-item"><strong>📅 Date:</strong> ${event.date}</div>
                    <div class="detail-item"><strong>⏰ Time:</strong> ${event.time}</div>
                    <div class="detail-item"><strong>📍 Location:</strong> ${event.location}</div>
                    <div class="detail-item"><strong>🎯 Mode:</strong> ${event.mode}</div>
                </div>
                
                <p>Your spot has been reserved. Please make sure to mark your calendar and join on time.</p>
                
                <div class="button-container">
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL}/events/${event.slug}" class="button">
                        View Event Details
                    </a>
                </div>
                
                <p>If you need to cancel or have any questions, please contact the event organizer.</p>
                
                <div class="footer">
                    <p>Best regards,<br><strong>The EventHub Team</strong></p>
                    <p><small>This is an automated email. Please do not reply to this message.</small></p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
  
  return { subject, html };
}