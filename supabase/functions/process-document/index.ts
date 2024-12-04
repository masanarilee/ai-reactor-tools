import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import * as pdfjs from 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.269/build/pdf.min.mjs'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file')

    if (!file) {
      throw new Error('No file uploaded')
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Upload file to storage
    const fileExt = file.name.split('.').pop()
    const filePath = `${crypto.randomUUID()}.${fileExt}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      throw new Error(`Failed to upload file: ${uploadError.message}`)
    }

    // Configure PDF.js worker
    const pdfjsWorker = await import('https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.269/build/pdf.worker.min.mjs')
    pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

    // Get the file buffer for PDF processing
    const arrayBuffer = await file.arrayBuffer()

    // Process PDF and extract text
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
    let textContent = ''

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      const strings = content.items.map((item: any) => item.str)
      textContent += strings.join(' ') + '\n'
    }

    // Save file metadata and text content to database
    const { error: dbError } = await supabase
      .from('documents')
      .insert({
        filename: file.name,
        file_path: filePath,
        content_type: file.type,
        text_content: textContent
      })

    if (dbError) {
      throw new Error(`Failed to save file metadata: ${dbError.message}`)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        text: textContent,
        filePath 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error processing document:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 400
      }
    )
  }
})