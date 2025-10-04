import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      booking,
      service,
      cleaner,
      extras,
    } = await req.json();

    console.log("Sending booking confirmation emails for:", booking.reference);

    // Format date and time
    const bookingDate = new Date(booking.booking_date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Customer email
    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #0C53ED; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Booking Confirmed!</h1>
        </div>
        
        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2 style="color: #0C53ED;">Thank you, ${booking.customer_name}!</h2>
          <p>Your cleaning service has been confirmed. Here are your booking details:</p>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0C53ED; margin-top: 0;">Booking Reference</h3>
            <p style="font-size: 18px; font-weight: bold; color: #333;">${booking.reference}</p>
            
            <h3 style="color: #0C53ED;">Service Details</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Service:</strong> ${service.name}</li>
              <li><strong>Bedrooms:</strong> ${booking.bedrooms}</li>
              <li><strong>Bathrooms:</strong> ${booking.bathrooms}</li>
              ${extras.length > 0 ? `<li><strong>Extras:</strong> ${extras.map((e: any) => e.name).join(", ")}</li>` : ""}
            </ul>
            
            <h3 style="color: #0C53ED;">Schedule</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Date:</strong> ${bookingDate}</li>
              <li><strong>Time:</strong> ${booking.booking_time}</li>
              <li><strong>Frequency:</strong> ${booking.frequency}</li>
            </ul>
            
            ${cleaner ? `
              <h3 style="color: #0C53ED;">Your Cleaner</h3>
              <p><strong>${cleaner.name}</strong> - ${cleaner.years_experience} years experience</p>
            ` : ""}
            
            <h3 style="color: #0C53ED;">Payment Summary</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Subtotal:</strong> ₦${booking.subtotal.toLocaleString()}</li>
              ${booking.discount > 0 ? `<li><strong>Discount:</strong> -₦${booking.discount.toLocaleString()}</li>` : ""}
              ${booking.service_fee > 0 ? `<li><strong>Service Fee:</strong> ₦${booking.service_fee.toLocaleString()}</li>` : ""}
              <li style="font-size: 18px; margin-top: 10px;"><strong>Total Paid:</strong> ₦${booking.total_amount.toLocaleString()}</li>
            </ul>
          </div>
          
          ${booking.special_instructions ? `
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #856404; margin-top: 0;">Special Instructions</h3>
              <p style="color: #856404; margin: 0;">${booking.special_instructions}</p>
            </div>
          ` : ""}
          
          <p style="margin-top: 30px;">If you have any questions, please contact us at bookings@shalean.com</p>
          
          <p style="color: #666;">Best regards,<br/>Shalean Cleaning Services</p>
        </div>
        
        <div style="background-color: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">© ${new Date().getFullYear()} Shalean Cleaning Services. All rights reserved.</p>
        </div>
      </div>
    `;

    // Admin email
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #0C53ED; color: white; padding: 20px;">
          <h1 style="margin: 0;">New Booking Received</h1>
        </div>
        
        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2 style="color: #0C53ED;">Booking Reference: ${booking.reference}</h2>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0C53ED; margin-top: 0;">Customer Information</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Name:</strong> ${booking.customer_name}</li>
              <li><strong>Email:</strong> ${booking.customer_email}</li>
              <li><strong>Phone:</strong> ${booking.customer_phone}</li>
            </ul>
            
            <h3 style="color: #0C53ED;">Service Details</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Service:</strong> ${service.name}</li>
              <li><strong>Bedrooms:</strong> ${booking.bedrooms}</li>
              <li><strong>Bathrooms:</strong> ${booking.bathrooms}</li>
              ${extras.length > 0 ? `<li><strong>Extras:</strong> ${extras.map((e: any) => e.name).join(", ")}</li>` : ""}
            </ul>
            
            <h3 style="color: #0C53ED;">Schedule</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Date:</strong> ${bookingDate}</li>
              <li><strong>Time:</strong> ${booking.booking_time}</li>
              <li><strong>Frequency:</strong> ${booking.frequency}</li>
            </ul>
            
            ${cleaner ? `
              <h3 style="color: #0C53ED;">Assigned Cleaner</h3>
              <p><strong>${cleaner.name}</strong></p>
            ` : ""}
            
            <h3 style="color: #0C53ED;">Payment Information</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Subtotal:</strong> ₦${booking.subtotal.toLocaleString()}</li>
              ${booking.discount > 0 ? `<li><strong>Discount:</strong> -₦${booking.discount.toLocaleString()}</li>` : ""}
              ${booking.service_fee > 0 ? `<li><strong>Service Fee:</strong> ₦${booking.service_fee.toLocaleString()}</li>` : ""}
              <li style="font-size: 18px; margin-top: 10px;"><strong>Total Amount:</strong> ₦${booking.total_amount.toLocaleString()}</li>
              <li><strong>Payment Status:</strong> ${booking.payment_status}</li>
              <li><strong>Paystack Reference:</strong> ${booking.paystack_reference}</li>
            </ul>
          </div>
          
          ${booking.special_instructions ? `
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #856404; margin-top: 0;">Special Instructions</h3>
              <p style="color: #856404; margin: 0;">${booking.special_instructions}</p>
            </div>
          ` : ""}
        </div>
      </div>
    `;

    // Send customer email
    const customerEmail = await resend.emails.send({
      from: "Shalean Cleaning Services <bookings@shalean.com>",
      to: [booking.customer_email],
      subject: `Booking Confirmed · ${service.name} on ${bookingDate}`,
      html: customerEmailHtml,
    });

    // Send admin email
    const adminEmail = await resend.emails.send({
      from: "Shalean Bookings <bookings@shalean.com>",
      to: ["bookings@shalean.com"],
      subject: `New Booking · ${service.name} · ${booking.reference}`,
      html: adminEmailHtml,
    });

    console.log("Emails sent successfully");

    return new Response(
      JSON.stringify({
        success: true,
        customerEmailId: customerEmail.data?.id,
        adminEmailId: adminEmail.data?.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error sending emails:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
