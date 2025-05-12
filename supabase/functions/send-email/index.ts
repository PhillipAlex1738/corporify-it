
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data } = await req.json();
    let result;

    switch (type) {
      case 'welcome':
        result = await sendWelcomeEmail(data);
        break;
      case 'purchase':
        result = await sendPurchaseConfirmationEmail(data);
        break;
      default:
        throw new Error(`Unsupported email type: ${type}`);
    }

    return new Response(
      JSON.stringify(result),
      { 
        status: 200,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        }
      }
    );
  } catch (error) {
    console.error('Error in send-email function:', error);
    
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

async function sendWelcomeEmail(data: { email: string, firstName?: string }) {
  const { email, firstName = 'there' } = data;
  
  console.log(`Sending welcome email to ${email}`);
  
  return await resend.emails.send({
    from: 'Corporify <onboarding@resend.dev>',
    to: [email],
    subject: 'Welcome to Corporify',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">Welcome to Corporify!</h1>
        <p>Hi ${firstName},</p>
        <p>Thank you for signing up with Corporify! Your account has been created successfully.</p>
        <p>With Corporify, you can transform your casual messages into polished corporate language with just a few clicks.</p>
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        <div style="text-align: center; margin-top: 30px;">
          <a href="${Deno.env.get('PUBLIC_APP_URL') || 'https://corporifyit.io'}/app" style="background-color: #4361ee; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Get Started</a>
        </div>
        <p style="margin-top: 30px; font-size: 12px; color: #666; text-align: center;">
          © ${new Date().getFullYear()} Corporify. All rights reserved.
        </p>
      </div>
    `,
  });
}

async function sendPurchaseConfirmationEmail(data: { 
  email: string, 
  firstName?: string, 
  plan: string,
  amount: string
}) {
  const { email, firstName = 'there', plan, amount } = data;
  
  console.log(`Sending purchase confirmation email to ${email} for ${plan}`);
  
  return await resend.emails.send({
    from: 'Corporify <onboarding@resend.dev>',
    to: [email],
    subject: 'Thank You for Your Purchase',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">Purchase Confirmation</h1>
        <p>Hi ${firstName},</p>
        <p>Thank you for your purchase! Your payment of <strong>${amount}</strong> for the <strong>${plan}</strong> plan has been processed successfully.</p>
        <p>Your premium features are now active and ready to use.</p>
        <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f8f9fa; border-radius: 5px;">
          <h2 style="color: #4361ee; margin-top: 0;">Order Details</h2>
          <p><strong>Plan:</strong> ${plan}</p>
          <p><strong>Amount:</strong> ${amount}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        <p>If you have any questions or need assistance with your premium features, please contact our support team.</p>
        <div style="text-align: center; margin-top: 30px;">
          <a href="${Deno.env.get('PUBLIC_APP_URL') || 'https://corporifyit.io'}/app" style="background-color: #4361ee; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Start Using Premium Features</a>
        </div>
        <p style="margin-top: 30px; font-size: 12px; color: #666; text-align: center;">
          © ${new Date().getFullYear()} Corporify. All rights reserved.
        </p>
      </div>
    `,
  });
}
