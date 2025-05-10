
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.4.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the Stripe key from environment variables
    const stripeKey = Deno.env.get('STRIPE_KEY');
    if (!stripeKey) {
      throw new Error('Missing Stripe API key');
    }

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

    // Parse the request body
    const { priceId } = await req.json();
    
    // Log the received price ID for debugging
    console.log(`Creating checkout with price ID: ${priceId}`);
    
    // Get auth header to identify the user if logged in
    const authHeader = req.headers.get('Authorization');
    let customerEmail = 'guest@example.com'; // Default for non-authenticated users
    
    // If authenticated, get the user's email
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '');
        // Get user from Supabase auth
        const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
        const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
        
        const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'apikey': supabaseAnonKey
          }
        });
        
        const userData = await response.json();
        if (userData.email) {
          customerEmail = userData.email;
          console.log(`User email found: ${customerEmail}`);
        }
      } catch (error) {
        console.log('Error getting user:', error.message);
        // Continue with guest email
      }
    }
    
    // Create a Checkout Session
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'payment',  // Changed from 'subscription' to 'payment' for one-time payments
        success_url: `${req.headers.get('origin')}/premium?payment=success`,
        cancel_url: `${req.headers.get('origin')}/premium?payment=canceled`,
        customer_email: customerEmail,
      });

      console.log(`Checkout session created successfully: ${session.id}`);
      
      return new Response(
        JSON.stringify({ url: session.url }),
        { 
          status: 200,
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          }
        }
      );
    } catch (stripeError) {
      console.error('Stripe API error:', stripeError);
      
      // Return a more descriptive error message
      return new Response(
        JSON.stringify({ 
          error: stripeError.message,
          type: 'stripe_error'
        }),
        { 
          status: 400,  // Use 400 instead of 500 for Stripe-specific errors
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          }
        }
      );
    }
  } catch (error) {
    console.error('Error in create-payment function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        }
      }
    );
  }
});
