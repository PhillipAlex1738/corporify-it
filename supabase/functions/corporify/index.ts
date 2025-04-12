
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Define CORS headers for browser compatibility
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create a Supabase client for tracking usage (optional)
const supabaseUrl = "https://omxtrdmtdrdovculcywf.supabase.co";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Function invoked: corporify");
    
    // Parse request body
    let requestData;
    try {
      requestData = await req.json();
      console.log("Request data parsed successfully");
    } catch (e) {
      console.error("Failed to parse request body:", e);
      return new Response(
        JSON.stringify({ error: "Invalid request format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { text, userId } = requestData;
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    // Check if the OpenAI API key is available
    if (!openaiApiKey) {
      console.error("Missing OpenAI API key in environment");
      return new Response(
        JSON.stringify({ 
          error: "Server configuration error", 
          details: "OpenAI API key is not configured" 
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (!text) {
      console.error("No text provided in request");
      return new Response(
        JSON.stringify({ error: "No text provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Processing text:", text.substring(0, 50) + (text.length > 50 ? "..." : ""));
    console.log("OpenAI API key available (first 5 chars):", openaiApiKey.substring(0, 5) + "...");
    
    // Call OpenAI API
    console.log("Calling OpenAI API...");
    let responseData;
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Rewrite the user\'s message in a professional, polite corporate tone. Maintain the original intent, but improve tone, clarity, and professionalism.'
            },
            {
              role: 'user',
              content: text
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenAI API error response:', errorData);
        throw new Error(errorData.error?.message || `OpenAI API request failed with status: ${response.status}`);
      }

      responseData = await response.json();
      console.log("OpenAI API responded successfully");
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      return new Response(
        JSON.stringify({ 
          error: "Failed to call OpenAI API", 
          details: error.message || "Unknown OpenAI API error" 
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!responseData || !responseData.choices || !responseData.choices[0] || !responseData.choices[0].message) {
      console.error('Unexpected response format from OpenAI:', responseData);
      return new Response(
        JSON.stringify({ 
          error: "Invalid response format from OpenAI API", 
          details: "Response did not contain expected data structure" 
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const corporateText = responseData.choices[0].message.content;
    console.log("Generated response:", corporateText.substring(0, 50) + (corporateText.length > 50 ? "..." : ""));

    // Log usage in the database (optional)
    if (userId) {
      try {
        await supabase.from('usage_logs').insert({
          user_id: userId,
          prompt: text,
          tokens_used: responseData.usage?.total_tokens || 0
        });
        console.log("Usage logged successfully for user:", userId);
      } catch (logError) {
        console.error("Failed to log usage:", logError);
        // Continue processing even if logging fails
      }
    }

    return new Response(
      JSON.stringify({ corporateText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error('Unhandled error in corporify function:', error);
    return new Response(
      JSON.stringify({ 
        error: "Server error", 
        details: error.message || "Unknown error occurred",
        stack: error.stack
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
