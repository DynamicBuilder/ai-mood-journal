import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 200 })
  }

  try {
    const { entry_text } = await req.json()

    if (!entry_text || entry_text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'entry_text is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Call Anthropic Claude API
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') ?? '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 300,
        system:
          'You are a mood analysis assistant. Respond only with valid JSON in this exact format: {"mood_score": <integer 1-10>, "mood_label": "<single word>", "reflection": "<1-2 encouraging sentences>"}. Do not include any other text, markdown, or explanation.',
        messages: [
          {
            role: 'user',
            content: entry_text.trim(),
          },
        ],
      }),
    })

    if (!anthropicResponse.ok) {
      const errText = await anthropicResponse.text()
      throw new Error(`Anthropic API error: ${errText}`)
    }

    const anthropicData = await anthropicResponse.json()
    const rawContent = anthropicData.content[0].text.trim()

    // Parse Claude's JSON response
    let analysis: { mood_score: number; mood_label: string; reflection: string }
    try {
      analysis = JSON.parse(rawContent)
    } catch {
      throw new Error('Failed to parse AI response as JSON')
    }

    // Validate
    if (!analysis.mood_score || !analysis.mood_label || !analysis.reflection) {
      throw new Error('Invalid AI response structure')
    }

    // Save to Supabase using service role
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data, error } = await supabase
      .from('mood_entries')
      .insert({
        entry_text: entry_text.trim(),
        mood_score: Math.min(10, Math.max(1, Math.round(analysis.mood_score))),
        mood_label: analysis.mood_label,
        reflection: analysis.reflection,
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : 'Internal server error',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
