import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const systemPrompt = `You are a child-safety image analyzer. Your job is to analyze images for potentially harmful content that could negatively affect children.

IMPORTANT: You must respond ONLY with valid JSON, no markdown, no code blocks, just raw JSON.

Analyze the provided image and identify any concerning content. For each issue found, categorize it as:

Harm Types:
- "hate-speech": Images containing hateful symbols, gestures, or messaging
- "abuse": Images depicting bullying, violence, or harmful behavior
- "self-harm": Images promoting or showing self-injury
- "explicit": Sexual content, graphic violence, or age-inappropriate imagery

Severity Levels:
- "low": Mildly concerning, educational opportunity
- "medium": Moderately harmful, needs attention  
- "high": Seriously concerning, requires immediate adult attention

Respond with this JSON structure:
{
  "toxicityScore": <number 0-100>,
  "issues": [
    {
      "harmType": "<harm-type>",
      "severity": "<severity>",
      "content": "<brief description of concerning element>",
      "reason": "<short reason for flagging>",
      "explanation": "<child-friendly explanation of why this is concerning, written in a supportive and educational tone>"
    }
  ],
  "overallSafe": <boolean>,
  "friendlyMessage": "<a brief, encouraging message about the image's safety>"
}

If no issues are found, return:
{
  "toxicityScore": 0,
  "issues": [],
  "overallSafe": true,
  "friendlyMessage": "This image looks safe and appropriate! Nice choice."
}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, imageUrl } = await req.json();

    if (!imageBase64 && !imageUrl) {
      return new Response(
        JSON.stringify({ error: "Please provide an image to analyze (base64 or URL)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Analyzing image for safety...");

    // Prepare image content for the API
    const imageContent = imageBase64 
      ? { type: "image_url", image_url: { url: imageBase64 } }
      : { type: "image_url", image_url: { url: imageUrl } };

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: [
              { type: "text", text: "Analyze this image for child safety:" },
              imageContent
            ]
          },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    console.log("AI Response:", content);

    // Parse the JSON response
    let analysis;
    try {
      const cleanedContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      analysis = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      analysis = {
        toxicityScore: 0,
        issues: [],
        overallSafe: true,
        friendlyMessage: "We analyzed the image but couldn't determine specific issues. The image may be safe.",
      };
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error in analyze-image function:", error);
    const errorMessage = error instanceof Error ? error.message : "An error occurred during analysis";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
