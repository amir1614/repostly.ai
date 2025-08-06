# Repostly.ai 🤖

**AI-Powered TikTok Repost Analysis**

Repostly.ai helps users understand what TikTok reposts reveal about someone's emotional and psychological state using advanced AI analysis.

## 🌟 Features

- **TikTok Link Analysis**: Paste public TikTok video links for instant analysis
- **Screenshot OCR**: Upload screenshots of reposts for private account analysis
- **AI-Powered Insights**: Get detailed psychological and emotional analysis
- **Modern UI**: Clean, Gen-Z friendly interface with smooth animations
- **Mobile Responsive**: Works perfectly on all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd repostly.ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
repostly.ai/
├── app/
│   ├── components/
│   │   ├── AnalysisForm.tsx      # Input form with link/screenshot options
│   │   └── AnalysisResult.tsx    # Results display component
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # Backend API endpoint
│   ├── globals.css               # Global styles and Tailwind config
│   ├── layout.tsx                # Root layout component
│   └── page.tsx                  # Main page component
├── public/                       # Static assets
├── package.json                  # Dependencies and scripts
├── tailwind.config.js           # TailwindCSS configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
```

## 🔧 Implementation Notes

### Frontend (Complete ✅)

The frontend is fully implemented with:
- **Next.js 14** with App Router
- **TailwindCSS** for styling
- **TypeScript** for type safety
- **Lucide React** for icons
- **Responsive design** for all devices

### Backend (TODO 🚧)

The backend API structure is set up but needs implementation:

#### 1. TikTok Scraping
```typescript
// TODO: Implement in app/api/analyze/route.ts
async function scrapeTikTok(url: string) {
  // Use libraries like:
  // - tiktok-scraper
  // - puppeteer with custom selectors
  // - TikTok's unofficial API endpoints
}
```

**Recommended Libraries:**
- `tiktok-scraper` - Popular TikTok scraping library
- `puppeteer` - For custom scraping solutions
- `axios` - For HTTP requests

#### 2. OCR Implementation
```typescript
// TODO: Implement in app/api/analyze/route.ts
async function extractTextFromImage(imageBuffer: Buffer) {
  const worker = await createWorker('eng')
  const { data: { text } } = await worker.recognize(imageBuffer)
  await worker.terminate()
  return text
}
```

**Dependencies needed:**
```bash
npm install tesseract.js
```

#### 3. GPT-3.5 Integration
```typescript
// TODO: Implement in app/api/analyze/route.ts
async function analyzeWithGPT(content: string) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
  
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 500,
    temperature: 0.7,
  })
  
  return completion.choices[0].message.content
}
```

**Dependencies needed:**
```bash
npm install openai
```

### Environment Variables

Create a `.env.local` file:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (`#0ea5e9` to `#0284c7`)
- **Background**: Clean white with subtle gradients
- **Text**: Dark gray (`#111827`) for readability

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800

### Components
- **Buttons**: Rounded corners, hover effects, gradient backgrounds
- **Cards**: Subtle shadows, rounded corners, clean borders
- **Inputs**: Focus states, validation styling

## 📱 Mobile Responsiveness

The app is fully responsive with:
- Mobile-first design approach
- Flexible grid layouts
- Touch-friendly button sizes
- Optimized typography scaling

## 🔒 Privacy & Ethics

### Privacy Features
- No permanent storage of uploaded images
- Clear privacy notices
- Entertainment-only disclaimers

### Ethical Considerations
- Only analyzes public content or user-uploaded screenshots
- Clear disclaimers about AI limitations
- Respectful analysis prompts

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms
- **Netlify**: Compatible with Next.js
- **Railway**: Good for full-stack deployment
- **AWS/GCP**: For enterprise deployments

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Code Style
- **ESLint** configuration included
- **Prettier** recommended for formatting
- **TypeScript** strict mode enabled

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** team for the amazing framework
- **TailwindCSS** for the utility-first CSS framework
- **OpenAI** for GPT-3.5 API
- **Tesseract.js** for OCR capabilities

## 📞 Support

For support, email support@repostly.ai or create an issue in this repository.

---

**Disclaimer**: This tool provides AI-generated analysis for entertainment purposes only. It should not be considered professional psychological advice.
