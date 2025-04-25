
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

// Tone specific system prompts
const tonePrompts = {
  professional: "Rewrite the user's message in a professional, polite corporate tone. Maintain the original intent, but improve tone, clarity, and professionalism.",
  formal: "Rewrite the user's message in a highly formal, proper business tone. Use sophisticated language, complete sentences, and traditional business etiquette.",
  friendly: "Rewrite the user's message in a warm, personable yet professional tone. Keep it polite and business-appropriate while adding a touch of friendliness and approachability.",
  concise: "Rewrite the user's message in a brief, direct, and efficient manner. Remove unnecessary words and get straight to the point while maintaining professionalism.",
  diplomatic: "Rewrite the user's message using tactful, diplomatic language. Focus on constructive framing, avoiding negative implications, and promoting harmony while preserving the core message."
};

serve(async (req) => {
  // Enhanced logging for request debugging
  console.log(`Received ${req.method} request to ${req.url}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Function invoked: corporify");
    
    // Verify environment variables
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    // Check if the OpenAI API key is available and log its status
    if (!openaiApiKey) {
      console.error("Missing OpenAI API key in environment");
      return new Response(
        JSON.stringify({ 
          error: "Server configuration error", 
          details: "OpenAI API key is not configured" 
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      console.log("OpenAI API key found with length:", openaiApiKey.length);
      console.log("OpenAI API key starts with:", openaiApiKey.substring(0, 5) + "...");
    }
    
    // Parse request body
    let requestData;
    try {
      requestData = await req.json();
      console.log("Request data parsed successfully");
      console.log("Request data:", JSON.stringify(requestData, null, 2));
    } catch (e) {
      console.error("Failed to parse request body:", e);
      return new Response(
        JSON.stringify({ error: "Invalid request format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { text, userId, tone = 'professional' } = requestData;
    
    if (!text) {
      console.error("No text provided in request");
      return new Response(
        JSON.stringify({ error: "No text provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Processing text with tone:", tone);
    console.log("Text to process:", text.substring(0, 50) + (text.length > 50 ? "..." : ""));
    
    // Get the appropriate system prompt based on tone
    const systemPrompt = tonePrompts[tone] || tonePrompts.professional;
    
    // Call OpenAI API with enhanced error handling
    console.log("Preparing to call OpenAI API...");
    let responseData;
    try {
      // Log more details about the request
      const requestBody = {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      };
      
      console.log("Request body prepared with tone:", tone);
      
      console.log("Calling OpenAI API at: https://api.openai.com/v1/chat/completions");
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      // Log the raw response status and headers
      console.log(`OpenAI API response status: ${response.status}`);
      console.log(`OpenAI API response statusText: ${response.statusText}`);
      
      // Check for non-OK response
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
          console.error('OpenAI API error response:', errorData);
        } catch (e) {
          console.error('OpenAI API returned non-JSON error:', errorText);
          errorData = { error: { message: `API returned status ${response.status} with non-JSON response` } };
        }
        
        throw new Error(
          errorData.error?.message || 
          `OpenAI API request failed with status: ${response.status} - ${response.statusText}`
        );
      }

      responseData = await response.json();
      console.log("OpenAI API responded successfully with data structure:", Object.keys(responseData).join(', '));
      
      if (responseData.choices && responseData.choices.length > 0) {
        console.log("Got choices array with length:", responseData.choices.length);
        if (responseData.choices[0].message) {
          console.log("Message content excerpt:", responseData.choices[0].message.content.substring(0, 50) + "...");
        } else {
          console.error("Message property missing in first choice");
        }
      } else {
        console.error("Choices array is empty or missing");
      }
      
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      return new Response(
        JSON.stringify({ 
          error: "Failed to call OpenAI API", 
          details: error.message || "Unknown OpenAI API error",
          stack: error.stack || "No stack trace available"
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!responseData || !responseData.choices || !responseData.choices[0] || !responseData.choices[0].message) {
      console.error('Unexpected response format from OpenAI:', responseData);
      return new Response(
        JSON.stringify({ 
          error: "Invalid response format from OpenAI API", 
          details: "Response did not contain expected data structure",
          rawResponse: JSON.stringify(responseData).substring(0, 500) // Only include first 500 chars for security
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
        stack: error.stack || "No stack trace available"
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
