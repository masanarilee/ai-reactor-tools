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
    console.log('Starting document processing...')
    const formData = await req.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      throw new Error('No valid file uploaded')
    }

    console.log('File received:', file.name, 'Type:', file.type)

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Upload file to storage
    const fileExt = file.name.split('.').pop()?.toLowerCase()
    const filePath = `${crypto.randomUUID()}.${fileExt}`

    console.log('Uploading file to storage...')
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw new Error(`Failed to upload file: ${uploadError.message}`)
    }

    let textContent = ''

    // Process file based on type
    if (file.type === 'application/pdf') {
      console.log('Processing PDF file...')
      try {
        // Configure PDF.js worker
        const pdfjsWorker = await import('https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.269/build/pdf.worker.min.mjs')
        pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

        const arrayBuffer = await file.arrayBuffer()
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
        
        for (let i = 1; i <= pdf.numPages; i++) {
          console.log(`Processing page ${i} of ${pdf.numPages}`)
          const page = await pdf.getPage(i)
          const content = await page.getTextContent()
          const strings = content.items.map((item: any) => item.str)
          textContent += strings.join(' ') + '\n'
        }
      } catch (error) {
        console.error('PDF processing error:', error)
        throw new Error('Failed to process PDF: ' + error.message)
      }
    } else if (
      file.type === 'application/msword' || 
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      // For Word documents, just store the file and return a placeholder
      console.log('Word document detected')
      textContent = 'Word document content will be processed separately'
    } else if (
      file.type === 'application/vnd.ms-excel' || 
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      // For Excel files, just store the file and return a placeholder
      console.log('Excel file detected')
      textContent = 'Excel file content will be processed separately'
    } else {
      throw new Error('Unsupported file type: ' + file.type)
    }

    // Save file metadata and text content to database
    console.log('Saving to database...')
    const { error: dbError } = await supabase
      .from('documents')
      .insert({
        filename: file.name,
        file_path: filePath,
        content_type: file.type,
        text_content: textContent
      })

    if (dbError) {
      console.error('Database error:', dbError)
      throw new Error(`Failed to save file metadata: ${dbError.message}`)
    }

    console.log('Processing completed successfully')
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