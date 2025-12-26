import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { messages, conversationName } = await req.json();
    
    console.log(`Generating summary for conversation: ${conversationName}`);
    console.log(`Number of messages: ${messages?.length || 0}`);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Format messages for context
    const messageContext = messages
      ?.slice(-50) // Last 50 messages for context
      ?.map((m: { sender_name: string; content: string; created_at: string }) => 
        `[${m.sender_name}]: ${m.content}`
      )
      .join('\n') || 'No messages available';

    const systemPrompt = `You are an AI assistant that creates concise, actionable summaries of chat conversations. 
Your summaries should:
- Highlight key discussion points
- Extract action items if any
- Note important decisions made
- Be formatted with bullet points for easy scanning
- Be professional yet conversational

Format your response with clear sections:
**Key Discussion Points:**
• Point 1
• Point 2

**Decisions Made:** (if any)
• Decision 1

**Action Items:** (if any)
1. Action 1
2. Action 2

Keep the summary concise but comprehensive.`;

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
            content: `Please summarize this conversation from "${conversationName}":\n\n${messageContext}` 
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        console.error("Payment required");
        return new Response(JSON.stringify({ error: "AI credits depleted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content || "Unable to generate summary.";
    
    console.log("Summary generated successfully");

    return new Response(JSON.stringify({ summary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error in ai-summary function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
