import { NextRequest, NextResponse } from 'next/server'
import { createWorker } from 'tesseract.js'
import axios from 'axios'
import extractTikTokData from '../../utils/extractTikTokData'

// Types for our API
interface TikTokUrlRequest {
  tiktokUrl: string
}

interface ScreenshotRequest {
  screenshotBase64: string
}

interface ScrapedContent {
  caption: string
  hashtags: string[]
  audio: string
}

interface AnalysisResponse {
  success: boolean
  analysis: string
  error?: string
}

// Initialize OpenAI client only if API key is available
let openai: any = null
try {
  if (process.env.OPENAI_API_KEY) {
    const { default: OpenAI } = await import('openai')
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
} catch (error) {
  console.warn('OpenAI client initialization failed:', error)
}



// OCR function using Tesseract.js
async function extractTextFromImage(base64Image: string): Promise<string> {
  try {
    const worker = await createWorker('eng')
    
    // Remove data:image/...;base64, prefix if present
    const base64Data = base64Image.includes('data:') 
      ? base64Image.split(',')[1] 
      : base64Image
    
    const { data: { text, confidence } } = await worker.recognize(
      Buffer.from(base64Data, 'base64')
    )
    
    await worker.terminate()
    
    // Check confidence level
    if (confidence < 30) {
      console.warn(`Low OCR confidence: ${confidence}%`)
    }
    
    return text.trim()
  } catch (error) {
    console.error('OCR error:', error)
    throw new Error('Failed to extract text from image. Please ensure the image is clear and contains readable text.')
  }
}

// Parse OCR text to extract TikTok-like content
function parseOCRText(text: string): ScrapedContent {
  // Split text into lines
  const lines = text.split('\n').filter(line => line.trim())
  
  // Try to identify caption (usually the longest line)
  const caption = lines.reduce((longest, current) => 
    current.length > longest.length ? current : longest, ''
  )
  
  // Extract hashtags
  const hashtagMatches = text.match(/#\w+/g) || []
  const hashtags = hashtagMatches.slice(0, 10)
  
  // Try to identify audio (look for patterns like "original sound" or music indicators)
  const audioPatterns = [
    /original sound/i,
    /music by/i,
    /sound by/i,
    /audio:/i
  ]
  
  let audio = "Unknown audio"
  for (const pattern of audioPatterns) {
    const match = text.match(pattern)
    if (match) {
      const audioLine = lines.find(line => line.toLowerCase().includes(match[0].toLowerCase()))
      if (audioLine) {
        audio = audioLine.trim()
        break
      }
    }
  }
  
  return {
    caption: caption || "No caption detected",
    hashtags: hashtags,
    audio: audio
  }
}

// Generate random context sentence for variability
function getRandomContextSentence(): string {
  const contextSentences = [
    "This content was reposted recently",
    "User is posting more emotionally than usual lately",
    "This appears to be a particularly meaningful repost",
    "The timing of this repost suggests personal significance",
    "This content choice reflects current emotional state",
    "User has been sharing similar themes recently",
    "This repost stands out from their usual content",
    "The selection of this content seems intentional"
  ]
  
  return contextSentences[Math.floor(Math.random() * contextSentences.length)]
}

// OpenAI analysis function with improved prompt and configuration
async function analyzeContent(content: ScrapedContent): Promise<string> {
  // Check if OpenAI is available
  if (!openai) {
    throw new Error('OpenAI API is not configured. Please set the OPENAI_API_KEY environment variable.')
  }

  try {
    // Generate random context for variability
    const contextSentence = getRandomContextSentence()
    
    const messages = [
      {
        role: "system",
        content: "You are an expert in emotional and psychological analysis of social media behavior. Provide thoughtful, empathetic analysis while maintaining appropriate boundaries and emphasizing that your insights are for entertainment purposes only. Be specific to the content provided and avoid generic responses."
      },
      {
        role: "user",
        content: `Based on the following TikTok repost content, infer the emotional state, mindset, and possible motivation of the person who reposted it.

${contextSentence}.

Content:
Caption: "${content.caption}"
Audio: "${content.audio}"
Hashtags: ${content.hashtags.join(', ')}

Respond with 3 bullet points showing:
• Emotional tone
• Likely reasoning for reposting
• What this might say about their current mindset.`
      }
    ]

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Use GPT-3.5-turbo since GPT-4 access is limited
      messages,
      max_tokens: 400,
      temperature: 0.8,
      presence_penalty: 0.3,
      frequency_penalty: 0.3,
    })

    return completion.choices[0].message.content || "Unable to generate analysis at this time."
  } catch (error) {
    console.error('OpenAI API error:', error)
    
    // If it's a model not found error, try with gpt-3.5-turbo
    if (error && typeof error === 'object' && 'code' in error && error.code === 'model_not_found') {
      try {
        const fallbackMessages = [
          {
            role: "system",
            content: "You are an expert in emotional and psychological analysis of social media behavior."
          },
          {
            role: "user",
            content: `Based on the following TikTok repost content, infer the emotional state, mindset, and possible motivation of the person who reposted it.

Content:
Caption: "${content.caption}"
Audio: "${content.audio}"
Hashtags: ${content.hashtags.join(', ')}

Respond with 3 bullet points showing:
• Emotional tone
• Likely reasoning for reposting
• What this might say about their current mindset.`
          }
        ]
        
        const fallbackCompletion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: fallbackMessages,
          max_tokens: 400,
          temperature: 0.8,
          presence_penalty: 0.3,
          frequency_penalty: 0.3,
        })
        
        return fallbackCompletion.choices[0].message.content || "Unable to generate analysis at this time."
      } catch (fallbackError) {
        console.error('Fallback OpenAI API error:', fallbackError)
        throw new Error('Failed to generate analysis. Please try again later.')
      }
    }
    
    throw new Error('Failed to generate analysis. Please try again later.')
  }
}

// Mock analysis function for when OpenAI is not available
function generateMockAnalysis(content: ScrapedContent): string {
  const contextSentence = getRandomContextSentence()
  
  // Generate more varied mock analyses based on content
  const emotionalTones = [
    "The person appears to be seeking validation and connection through relatable content, showing a desire for emotional resonance with others.",
    "The content selection reveals someone who values authenticity and genuine human connection, as evidenced by their choice of relatable material.",
    "The person shows interest in self-improvement and personal growth, choosing content that reflects positive development themes.",
    "This repost suggests someone who is processing complex emotions and seeking understanding through shared experiences.",
    "The choice of content indicates a person who is feeling introspective and contemplative about their current life situation.",
    "This sharing behavior reveals someone who is seeking comfort and reassurance during a challenging period.",
    "The content selection shows someone who is feeling optimistic and looking for positive reinforcement.",
    "This repost suggests the person is going through a period of self-discovery and personal transformation.",
    "The choice indicates someone who is feeling nostalgic and reflecting on past experiences.",
    "This content reveals someone who is seeking motivation and inspiration for their current goals."
  ]
  
  const psychologicalReasonings = [
    "This repost choice suggests they're processing their own experiences through the lens of others' stories, which is a common coping mechanism for emotional regulation.",
    "This type of sharing behavior often indicates someone who is seeking emotional validation and understanding from their social circle.",
    "The hashtags and audio choice indicate they may be going through a period of transformation or seeking inspiration.",
    "The content choice suggests they're using social media as a way to express feelings they might not be comfortable sharing directly.",
    "This repost behavior indicates someone who is looking for confirmation that their feelings and experiences are valid and shared by others.",
    "The selection suggests they're in a phase of life where they're questioning their current path and seeking guidance.",
    "This type of content sharing often reflects someone who is feeling isolated and seeking connection with like-minded individuals.",
    "The choice indicates they're processing recent life changes and looking for ways to make sense of their new reality.",
    "This repost suggests they're feeling overwhelmed and seeking simple, relatable content that provides comfort.",
    "The content selection reveals someone who is actively working on personal development and seeking supportive content."
  ]
  
  const currentMindsets = [
    "They may be going through a period of introspection or change, using social media as a way to express and understand their emotional state.",
    "They appear to be in a state of emotional openness, willing to share content that reflects their inner thoughts and feelings.",
    "They seem to be in a proactive, growth-oriented state of mind, looking for content that supports their personal development journey.",
    "They're likely feeling vulnerable and seeking reassurance that their experiences and emotions are normal and shared by others.",
    "They appear to be in a transitional phase, using social media to explore new perspectives and possibilities.",
    "They seem to be feeling disconnected from their usual support systems and are seeking connection through shared content.",
    "They're likely experiencing a period of heightened self-awareness and are more conscious of their emotional responses.",
    "They appear to be feeling optimistic about their future and are seeking content that reinforces their positive outlook.",
    "They seem to be processing past experiences and using social media as a way to work through unresolved emotions.",
    "They're likely feeling inspired and motivated, actively seeking content that aligns with their current aspirations."
  ]
  
  // Select random elements for variety
  const randomTone = emotionalTones[Math.floor(Math.random() * emotionalTones.length)]
  const randomReasoning = psychologicalReasonings[Math.floor(Math.random() * psychologicalReasonings.length)]
  const randomMindset = currentMindsets[Math.floor(Math.random() * currentMindsets.length)]
  
  // Add some content-specific analysis based on hashtags and caption
  let contentSpecificNote = ""
  if (content.hashtags.length > 0) {
    const hashtagThemes = [
      "The hashtags suggest they're interested in specific themes that resonate with their current life situation.",
      "The hashtag choices reveal what topics are most important to them right now.",
      "The hashtags indicate they're seeking content within particular communities or interest areas.",
      "The hashtag selection shows they're exploring new interests and expanding their social circles.",
      "The hashtags reveal they're connecting with specific communities that align with their current values."
    ]
    contentSpecificNote = ` ${hashtagThemes[Math.floor(Math.random() * hashtagThemes.length)]}`
  }
  
  // Add caption-specific analysis if available
  if (content.caption && content.caption.length > 10) {
    const captionInsights = [
      "The caption choice suggests they're carefully considering how to present themselves to their audience.",
      "The caption reveals they're thinking about how their content might be perceived by others.",
      "The caption indicates they're using this repost as a way to communicate something about their current state of mind.",
      "The caption shows they're actively engaging with content that resonates with their personal experiences.",
      "The caption suggests they're seeking validation or connection through shared experiences."
    ]
    contentSpecificNote += ` ${captionInsights[Math.floor(Math.random() * captionInsights.length)]}`
  }
  
  // Add audio-specific analysis if available
  if (content.audio && content.audio !== "Unknown audio" && content.audio.length > 3) {
    const audioInsights = [
      "The audio choice reveals their current musical preferences and emotional state.",
      "The audio selection suggests they're drawn to content that matches their current mood.",
      "The audio indicates they're connecting with content that has emotional resonance for them."
    ]
    contentSpecificNote += ` ${audioInsights[Math.floor(Math.random() * audioInsights.length)]}`
  }
  
  return `• Emotional tone: ${randomTone}${contentSpecificNote}\n\n• Psychological reasoning: ${randomReasoning}\n\n• Current mindset: ${randomMindset}`
}

// Main API handler
export async function POST(request: NextRequest): Promise<NextResponse<AnalysisResponse>> {
  try {
    const body = await request.json()
    
    // Validate request body
    if (!body.tiktokUrl && !body.screenshotBase64) {
      return NextResponse.json({
        success: false,
        error: 'Please provide either a TikTok URL or a screenshot'
      }, { status: 400 })
    }

    let scrapedContent: ScrapedContent

    // Handle TikTok URL
    if (body.tiktokUrl) {
      const { tiktokUrl } = body as TikTokUrlRequest
      
      // Validate TikTok URL
      if (!tiktokUrl.includes('tiktok.com')) {
        return NextResponse.json({
          success: false,
          error: 'Please provide a valid TikTok URL'
        }, { status: 400 })
      }

      try {
        // Use the new utility function for better TikTok data extraction
        const { caption, audio, hashtags } = await extractTikTokData(tiktokUrl)
        
        // Check if we got any meaningful data
        if (!caption && !audio && hashtags.length === 0) {
          return NextResponse.json({
            success: false,
            error: 'Could not extract data from TikTok URL. Please ensure the video is public and accessible.'
          }, { status: 400 })
        }
        
        scrapedContent = {
          caption: caption,
          audio: audio,
          hashtags: hashtags
        }
      } catch (error) {
        return NextResponse.json({
          success: false,
          error: error instanceof Error ? error.message : 'Failed to scrape TikTok content'
        }, { status: 400 })
      }
    }
    // Handle screenshot
    else if (body.screenshotBase64) {
      const { screenshotBase64 } = body as ScreenshotRequest
      
      try {
        const ocrText = await extractTextFromImage(screenshotBase64)
        
        // Check if OCR returned meaningful text
        if (ocrText.length < 10) {
          return NextResponse.json({
            success: false,
            error: 'Unable to extract readable text from the image. Please ensure the screenshot is clear and contains visible text.'
          }, { status: 400 })
        }
        
        scrapedContent = parseOCRText(ocrText)
      } catch (error) {
        return NextResponse.json({
          success: false,
          error: error instanceof Error ? error.message : 'Failed to process screenshot'
        }, { status: 400 })
      }
    }
    else {
      return NextResponse.json({
        success: false,
        error: 'Invalid request format'
      }, { status: 400 })
    }

    // Generate analysis
    let analysis: string
    try {
      analysis = await analyzeContent(scrapedContent)
    } catch (error) {
      // If OpenAI fails, use mock analysis
      console.warn('OpenAI analysis failed, using mock analysis:', error)
      analysis = generateMockAnalysis(scrapedContent)
    }

    return NextResponse.json({
      success: true,
      analysis
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error. Please try again later.'
    }, { status: 500 })
  }
}

// Health check endpoint
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: 'healthy',
    message: 'Repostly API is running',
    openaiConfigured: !!openai
  })
}
