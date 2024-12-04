import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt, options = {} } = await req.json()
    console.log('Received prompt:', prompt)

    if (!prompt) {
      throw new Error('No prompt provided')
    }

    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set')
    }

    const {
      model = 'gpt-4o-mini',
      max_tokens = 4096,
      temperature = 0.7
    } = options;

    console.log('Making request to OpenAI API...')
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens,
        temperature,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenAI API error response:', errorData)
      throw new Error(`OpenAI API request failed: ${response.status} - ${errorData}`)
    }

    const data = await response.json()
    console.log('OpenAI API response received successfully')

    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      throw new Error('Unexpected response format from OpenAI API')
    }

    return new Response(
      JSON.stringify({ text: data.choices[0].message.content }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in ask-gpt function:', error)
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