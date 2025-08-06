'use client'

import { useState, useRef } from 'react'
import { Upload, Link, X, FileImage, Sparkles } from 'lucide-react'

interface AnalysisFormProps {
  onAnalysis: (content: string, type: 'link' | 'screenshot') => Promise<void>
  isLoading: boolean
}

export default function AnalysisForm({ onAnalysis, isLoading }: AnalysisFormProps) {
  const [inputType, setInputType] = useState<'link' | 'screenshot'>('link')
  const [tiktokLink, setTiktokLink] = useState('')
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (inputType === 'link') {
      if (!tiktokLink.trim()) {
        alert('Please enter a TikTok link')
        return
      }
      // TODO: Validate TikTok link format
      await onAnalysis(tiktokLink, 'link')
    } else {
      if (!screenshot) {
        alert('Please upload a screenshot')
        return
      }
      // TODO: Extract text from screenshot using OCR
      await onAnalysis('screenshot_content', 'screenshot')
    }
  }

  const isValidTikTokLink = (link: string) => {
    return link.includes('tiktok.com') || link.includes('vm.tiktok.com')
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-10 max-w-3xl mx-auto relative overflow-hidden">
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
          Screenshot
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
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotUpload}
                  className="hidden"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center space-y-6 group-hover:scale-105 transition-transform duration-300"
                  disabled={isLoading}
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
                    <FileImage className="h-10 w-10 text-blue-600" />
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
                  <X className="h-5 w-5" />
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
                <Sparkles className="h-6 w-6 mr-3" />
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
              We only analyze public TikTok content or screenshots you upload. 
              We don't store your uploads permanently and all analysis is for entertainment purposes only.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
