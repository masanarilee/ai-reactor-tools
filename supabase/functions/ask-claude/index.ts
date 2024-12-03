import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt } = await req.json()
    console.log('Received prompt:', prompt)

    if (!prompt) {
      throw new Error('No prompt provided')
    }

    const apiKey = Deno.env.get('CLAUDE_API_KEY')
    if (!apiKey) {
      throw new Error('CLAUDE_API_KEY environment variable is not set')
    }

    console.log('Making request to Claude API...')
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Claude API error response:', errorData)
      throw new Error(`Claude API request failed: ${response.status} - ${errorData}`)
    }

    const data = await response.json()
    console.log('Claude API response received successfully')

    if (!data.content || !data.content[0] || !data.content[0].text) {
      throw new Error('Unexpected response format from Claude API')
    }

    return new Response(
      JSON.stringify({ text: data.content[0].text }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in ask-claude function:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 500 
      }
    )
  }
})