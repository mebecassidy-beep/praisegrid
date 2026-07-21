import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(request: Request) {
  try {
    const { review_id, location_id, tone, instructions, sign_off_name } = await request.json()

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const { data: review, error: reviewError } = await (supabase
      .from('reviews') as any)
      .select('*')
      .eq('id', review_id)
      .eq('location_id', location_id)
      .single()

    if (reviewError || !review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    const { data: settings } = await (supabase
      .from('ai_settings') as any)
      .select('tone, instructions, sign_off_name')
      .eq('location_id', location_id)
      .maybeSingle()

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })

    const selectedTone = tone || settings?.tone || 'professional'
    const customInstructions = instructions || settings?.instructions || ''
    const signOff = sign_off_name || settings?.sign_off_name || ''

    const prompt = `Write a reply to this customer review.
Tone: ${selectedTone}
Rating: ${review.rating} out of 5 stars
Reviewer Name: ${review.author_name}
Review Body: "${review.body || review.content}"
${customInstructions ? `Additional Instructions: ${customInstructions}` : ''}
${signOff ? `Sign off name: ${signOff}` : ''}

Write only the response message.`

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-latest',
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }]
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

    return NextResponse.json({ response: responseText })
  } catch (error: any) {
    console.error('Error generating AI response:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
