'use client'

import { useState, useEffect } from 'react'
import { Upload, Link, Brain, Sparkles, ArrowRight, Star, Zap, ChevronDown, Heart, MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const scrollToForm = () => {
    document.getElementById('analysis-form')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }

  const goToAnalyzer = () => {
    router.push('/analyze')
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating dots */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-200 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-purple-200 rounded-full opacity-40 animate-pulse delay-1000"></div>
        <div className="absolute top-80 left-1/4 w-1.5 h-1.5 bg-blue-100 rounded-full opacity-50 animate-pulse delay-500"></div>
        <div className="absolute top-96 right-1/3 w-1 h-1 bg-purple-100 rounded-full opacity-30 animate-pulse delay-1500"></div>
        
        {/* Grid pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.02]" 
             style={{
               backgroundImage: `radial-gradient(circle at 1px 1px, #000 1px, transparent 0)`,
               backgroundSize: '40px 40px'
             }}>
        </div>
      </div>

      {/* Header */}
      <header className="relative border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl px-4 py-2 border border-blue-100">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  REPOSTLY
                </span>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8 text-sm text-gray-600">
              <a href="#features" className="hover:text-gray-900 transition-colors duration-200">Features</a>
              <a href="#how-it-works" className="hover:text-gray-900 transition-colors duration-200">How it Works</a>
              <a href="#about" className="hover:text-gray-900 transition-colors duration-200">About</a>
            </nav>
            <button 
              onClick={goToAnalyzer}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Zap className="h-4 w-4" />
              <span>Try Repostly Now</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 px-6">
        <div className="container mx-auto max-w-5xl text-center">
          {/* Social Proof */}
          <div className={`flex items-center justify-center space-x-1 mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="text-gray-600 ml-3 text-sm font-medium">1.2M+ analyses worldwide</span>
          </div>
          
          {/* Main Headline */}
          <h1 className={`text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Read between the
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
              lines instantly
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className={`text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Your AI-powered tool for analyzing TikTok reposts and understanding what they reveal emotionally.
          </p>
          
          {/* CTA Button */}
          <div className={`transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <button 
              onClick={goToAnalyzer}
              className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-10 py-5 rounded-2xl font-semibold text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative flex items-center">
                Start Analyzing Today
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="py-24 px-6 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How it works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to unlock the hidden meaning behind any TikTok repost
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className={`bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Link className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Paste TikTok Link</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Simply paste a public TikTok video link and let our AI analyze the content, caption, and hashtags for deeper insights.
              </p>
            </div>
            
            {/* Feature Card 2 */}
            <div className={`bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{animationDelay: '0.4s'}}>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Upload className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Upload Screenshot</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                For private accounts, upload a screenshot of the repost and our OCR will extract the text for comprehensive analysis.
              </p>
            </div>
            
            {/* Feature Card 3 */}
            <div className={`bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{animationDelay: '0.6s'}}>
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Brain className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Get AI Insights</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Receive detailed psychological and emotional analysis powered by advanced AI technology, delivered in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What users are saying
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real insights from people who've discovered the hidden meaning behind reposts
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-red-100 rounded-full flex items-center justify-center mr-4">
                  <Heart className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">@tiktokuser123</p>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed italic">
                "This helped me understand my crush's reposts 😭 Literally a repost therapist."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-8 border border-purple-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mr-4">
                  <MessageCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">@socialpsych</p>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed italic">
                "Finally understand what my friend's cryptic reposts mean. This AI is scary accurate!"
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gradient-to-br from-green-50 to-yellow-50 rounded-3xl p-8 border border-green-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mr-4">
                  <Brain className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">@mindreader</p>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed italic">
                "My ex's reposts finally make sense now. This tool is like having a psychology degree!"
              </p>
            </div>

            {/* Testimonial 4 */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-3xl p-8 border border-red-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mr-4">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">@vibeschecker</p>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed italic">
                "This is the future of social media analysis. No more guessing what people mean!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="analysis-form" className="py-24 px-6 bg-gradient-to-b from-white to-gray-50/50">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-12 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full -translate-y-20 translate-x-20 opacity-30"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-50 to-blue-50 rounded-full translate-y-16 -translate-x-16 opacity-30"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Ready to analyze?
              </h2>
              <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                Choose your preferred method to analyze TikTok reposts and discover hidden insights
              </p>
              
              <button 
                onClick={goToAnalyzer}
                className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative flex items-center">
                  <Brain className="h-6 w-6 mr-3" />
                  Start Analyzing Now
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl px-4 py-2 border border-blue-100">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  REPOSTLY
                </span>
              </div>
            </div>
            <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
              AI-powered repost analysis for deeper insights into social media psychology
            </p>
            <div className="flex justify-center space-x-8 mb-8">
              <a href="#about" className="text-gray-500 hover:text-gray-900 transition-colors">About</a>
              <a href="#privacy" className="text-gray-500 hover:text-gray-900 transition-colors">Privacy</a>
            </div>
            <div className="text-sm text-gray-500 space-y-2 max-w-3xl mx-auto">
              <p>Repostly.ai © 2025. For entertainment purposes only.</p>
              <p>
                This tool provides AI-generated analysis and should not be considered professional psychological advice.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
