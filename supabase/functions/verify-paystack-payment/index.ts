import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reference } = await req.json();

    if (!reference) {
      throw new Error("Payment reference is required");
    }

    console.log("Verifying Paystack payment:", reference);

    // Verify payment with Paystack
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${Deno.env.get("PAYSTACK_SECRET_KEY")}`,
        },
      }
    );

    const paystackData = await paystackResponse.json();

    if (!paystackData.status) {
      throw new Error(paystackData.message || "Payment verification failed");
    }

    console.log("Paystack verification response:", paystackData);

    // Update booking with payment status
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: booking, error: updateError } = await supabase
      .from("bookings")
      .update({
        paystack_reference: reference,
        payment_status: paystackData.data.status === "success" ? "paid" : "failed",
        booking_status: paystackData.data.status === "success" ? "confirmed" : "pending",
      })
      .eq("reference", paystackData.data.metadata?.booking_reference)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating booking:", updateError);
      throw new Error("Failed to update booking status");
    }

    console.log("Booking updated successfully:", booking);

    return new Response(
      JSON.stringify({
        success: true,
        verified: paystackData.data.status === "success",
        booking,
        transaction: paystackData.data,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error verifying payment:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
