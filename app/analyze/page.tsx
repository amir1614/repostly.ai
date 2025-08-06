'use client'

import { useState } from 'react'
import { Upload, Link, Brain, Sparkles, ArrowLeft, Copy, Check, Share2, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AnalyzerPage() {
  const [inputType, setInputType] = useState<'link' | 'screenshot'>('link')
  const [tiktokLink, setTiktokLink] = useState('')
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const handleScreenshotUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setScreenshot(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setScreenshotPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeScreenshot = () => {
    setScreenshot(null)
    setScreenshotPreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Reset states
    setError(null)
    setAnalysisResult(null)
    setIsLoading(true)
    
    try {
      let requestBody: any = {}
      
      if (inputType === 'link') {
        if (!tiktokLink.trim()) {
          throw new Error('Please enter a TikTok link')
        }
        requestBody.tiktokUrl = tiktokLink.trim()
      } else {
        if (!screenshot) {
          throw new Error('Please upload a screenshot')
        }
        // Convert file to base64
        const base64 = await fileToBase64(screenshot)
        requestBody.screenshotBase64 = base64
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to analyze content')
      }

      if (!result.success) {
        throw new Error(result.error || 'Analysis failed')
      }

      setAnalysisResult(result.analysis)
    } catch (error) {
      console.error('Analysis failed:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const result = reader.result as string
        // Remove the data:image/...;base64, prefix
        const base64 = result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = error => reject(error)
    })
  }

  const copyToClipboard = async () => {
    if (!analysisResult) return
    try {
      await navigator.clipboard.writeText(analysisResult)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const shareResult = async () => {
    if (!analysisResult) return
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Repostly.ai Analysis',
          text: analysisResult,
          url: window.location.href,
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      copyToClipboard()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl px-4 py-2 border border-blue-100">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  REPOSTLY
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              AI Repost Analyzer
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Analyze TikTok Reposts
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Paste a TikTok link or upload a screenshot to discover what the repost reveals about someone's emotional state
          </p>
        </div>

        {/* Analysis Form */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-10 mb-12 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-50 to-blue-50 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
          
          {/* Input Type Toggle */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-10 relative z-10">
            <button
              type="button"
              onClick={() => setInputType('link')}
              className={`flex-1 flex items-center justify-center py-5 px-8 rounded-xl font-semibold transition-all duration-300 ${
                inputType === 'link'
                  ? 'bg-white text-blue-600 shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Link className="h-6 w-6 mr-3" />
              TikTok Link
            </button>
            <button
              type="button"
              onClick={() => setInputType('screenshot')}
              className={`flex-1 flex items-center justify-center py-5 px-8 rounded-xl font-semibold transition-all duration-300 ${
                inputType === 'screenshot'
                  ? 'bg-white text-blue-600 shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Upload className="h-6 w-6 mr-3" />
              Screenshot Upload
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
            {inputType === 'link' ? (
              <div className="space-y-4">
                <label htmlFor="tiktok-link" className="block text-lg font-semibold text-gray-900">
                  TikTok Video Link
                </label>
                <div className="relative">
                  <input
                    id="tiktok-link"
                    type="url"
                    value={tiktokLink}
                    onChange={(e) => setTiktokLink(e.target.value)}
                    placeholder="https://www.tiktok.com/@username/video/1234567890"
                    className="w-full px-6 py-5 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none transition-all duration-300 text-gray-900 placeholder-gray-400 text-lg shadow-sm hover:shadow-md focus:shadow-lg"
                    disabled={isLoading}
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <Sparkles className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <p className="text-gray-500 text-base">
                  Paste a public TikTok video link. We'll analyze the caption, hashtags, and audio title.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <label className="block text-lg font-semibold text-gray-900">
                  Upload Screenshot
                </label>
                
                {!screenshotPreview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-16 text-center hover:border-blue-400 transition-all duration-300 hover:bg-gray-50 group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotUpload}
                      className="hidden"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => document.querySelector('input[type="file"]')?.click()}
                      className="flex flex-col items-center space-y-6 group-hover:scale-105 transition-transform duration-300"
                      disabled={isLoading}
                    >
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
                        <Upload className="h-10 w-10 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xl font-semibold text-gray-900 mb-2">Upload a screenshot</p>
                        <p className="text-gray-500">PNG, JPG, or JPEG up to 10MB</p>
                      </div>
                    </button>
                  </div>
                ) : (
                  <div className="relative group">
                    <img
                      src={screenshotPreview}
                      alt="Screenshot preview"
                      className="w-full rounded-2xl border-2 border-gray-200 shadow-lg group-hover:shadow-xl transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={removeScreenshot}
                      className="absolute top-4 right-4 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
                    >
                      <span className="text-white font-bold">×</span>
                    </button>
                  </div>
                )}
                <p className="text-gray-500 text-base">
                  Upload a screenshot of a TikTok repost. Our OCR will extract the text for analysis.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || (inputType === 'link' ? !tiktokLink.trim() : !screenshot)}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-6 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed transition-all duration-300 text-lg relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative flex items-center justify-center">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="h-6 w-6 mr-3" />
                    Analyze Repost
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Privacy Notice */}
          <div className="mt-10 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200 relative z-10">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-blue-800 font-medium mb-1">Privacy Notice</p>
                <p className="text-blue-700 text-sm leading-relaxed">
                  We don't store anything. This is for entertainment only. We only analyze public TikTok content or screenshots you upload.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start space-x-4">
              <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-800 font-semibold mb-2">Analysis Failed</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {isLoading && (
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Analyzing your repost...</h3>
            <p className="text-gray-600">Our AI is reading between the lines</p>
          </div>
        )}

        {analysisResult && (
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-10 relative overflow-hidden animate-fade-in">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-50 to-blue-50 rounded-full -translate-y-20 translate-x-20 opacity-30"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-50 to-purple-50 rounded-full translate-y-16 -translate-x-16 opacity-30"></div>
            
            <div className="flex items-center justify-between mb-10 relative z-10">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center">
                  <Brain className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">Analysis Results</h3>
                  <p className="text-gray-500 text-lg">AI-generated insights</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={copyToClipboard}
                  className="p-4 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all duration-300 group"
                  title="Copy analysis"
                >
                  {copied ? (
                    <Check className="h-6 w-6 text-green-600" />
                  ) : (
                    <Copy className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                  )}
                </button>
                <button
                  onClick={shareResult}
                  className="p-4 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all duration-300 group"
                  title="Share analysis"
                >
                  <Share2 className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-10 border-l-4 border-blue-500 relative z-10">
              <p className="text-gray-800 leading-relaxed text-lg">
                {analysisResult}
              </p>
            </div>

            <div className="mt-10 p-8 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl border border-yellow-200 relative z-10">
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-yellow-800 font-semibold text-lg mb-2">Important Disclaimer</p>
                  <p className="text-yellow-700 leading-relaxed">
                    This analysis is generated by AI for entertainment purposes only. 
                    It should not be considered professional psychological advice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
