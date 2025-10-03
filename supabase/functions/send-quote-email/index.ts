import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface QuoteEmailRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceType: string;
  address?: string;
  bedrooms?: number;
  bathrooms?: number;
  message?: string;
  extras?: Array<{ id: string; name: string; price: number }>;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const quoteData: QuoteEmailRequest = await req.json();

    const {
      customerName,
      customerEmail,
      customerPhone,
      serviceType,
      address,
      bedrooms,
      bathrooms,
      message,
      extras,
    } = quoteData;

    // Format service type
    const formatServiceType = (type: string) => {
      return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    // Calculate extras total
    const extrasTotal = extras?.reduce((sum, extra) => sum + extra.price, 0) || 0;

    // Create extras list HTML
    const extrasListHtml = extras && extras.length > 0 
      ? `
        <h3 style="color: #333; margin-top: 20px;">Selected Extras:</h3>
        <ul style="list-style: none; padding: 0;">
          ${extras.map(extra => `
            <li style="padding: 8px 0; border-bottom: 1px solid #eee;">
              <strong>${extra.name}</strong>: R${extra.price}
            </li>
          `).join('')}
        </ul>
        <p style="font-size: 16px; margin-top: 10px;">
          <strong>Extras Total: R${extrasTotal}</strong>
        </p>
      `
      : '';

    // Send confirmation email to customer
    const customerEmailResponse = await resend.emails.send({
      from: "Shalean Cleaning Services <onboarding@resend.dev>",
      to: [customerEmail],
      subject: "Quote Request Received - Shalean Cleaning Services",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Quote Request Received!</h1>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; margin-bottom: 20px;">Dear ${customerName},</p>
              
              <p style="font-size: 16px; margin-bottom: 20px;">
                Thank you for requesting a quote from Shalean Cleaning Services! We have received your request and our team will review it shortly.
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="color: #667eea; margin-top: 0;">Your Quote Details:</h2>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Service Type:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${formatServiceType(serviceType)}</td>
                  </tr>
                  ${address ? `
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Address:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${address}</td>
                  </tr>
                  ` : ''}
                  ${bedrooms ? `
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Bedrooms:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${bedrooms}</td>
                  </tr>
                  ` : ''}
                  ${bathrooms ? `
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Bathrooms:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${bathrooms}</td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${customerPhone}</td>
                  </tr>
                </table>
                
                ${extrasListHtml}
                
                ${message ? `
                <div style="margin-top: 20px; padding: 15px; background: #f0f0f0; border-radius: 5px;">
                  <strong>Additional Notes:</strong>
                  <p style="margin: 5px 0 0 0;">${message}</p>
                </div>
                ` : ''}
              </div>
              
              <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; font-size: 14px;">
                  <strong>⏱️ What's Next?</strong><br>
                  Our team will review your request and send you a detailed quote within 24 hours.
                </p>
              </div>
              
              <p style="font-size: 16px; margin-top: 30px;">
                If you have any questions in the meantime, please don't hesitate to reach out to us.
              </p>
              
              <p style="font-size: 16px;">
                Best regards,<br>
                <strong>The Shalean Cleaning Services Team</strong>
              </p>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
              <p>© 2025 Shalean Cleaning Services. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    });

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "Shalean Quote System <onboarding@resend.dev>",
      to: ["admin@shalean.com"], // Replace with actual admin email
      subject: `New Quote Request from ${customerName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🔔 New Quote Request</h1>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="color: #f5576c; margin-top: 0;">Customer Information</h2>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Name:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${customerName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
                      <a href="mailto:${customerEmail}" style="color: #667eea;">${customerEmail}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
                      <a href="tel:${customerPhone}" style="color: #667eea;">${customerPhone}</a>
                    </td>
                  </tr>
                </table>
                
                <h2 style="color: #f5576c; margin-top: 30px;">Service Details</h2>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Service Type:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${formatServiceType(serviceType)}</td>
                  </tr>
                  ${address ? `
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Address:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${address}</td>
                  </tr>
                  ` : ''}
                  ${bedrooms ? `
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Bedrooms:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${bedrooms}</td>
                  </tr>
                  ` : ''}
                  ${bathrooms ? `
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Bathrooms:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${bathrooms}</td>
                  </tr>
                  ` : ''}
                </table>
                
                ${extrasListHtml}
                
                ${message ? `
                <div style="margin-top: 20px; padding: 15px; background: #f0f0f0; border-radius: 5px;">
                  <strong>Customer Message:</strong>
                  <p style="margin: 5px 0 0 0;">${message}</p>
                </div>
                ` : ''}
              </div>
              
              <div style="background: #d1ecf1; border-left: 4px solid #0c5460; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; font-size: 14px;">
                  <strong>⚡ Action Required:</strong><br>
                  Please respond to this customer within 24 hours with a detailed quote.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Customer email sent:", customerEmailResponse);
    console.log("Admin email sent:", adminEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true,
        customerEmailId: customerEmailResponse.data?.id,
        adminEmailId: adminEmailResponse.data?.id
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error sending quote emails:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
