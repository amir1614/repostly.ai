# Backend Setup Guide

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# OpenAI API Key - Get from https://platform.openai.com/api-keys
OPENAI_API_KEY=your_openai_api_key_here

# Optional: RapidAPI TikTok API (for better TikTok scraping)
# RAPIDAPI_KEY=your_rapidapi_key_here
# RAPIDAPI_TIKTOK_HOST=your_rapidapi_tiktok_host_here
```

## API Endpoints

### POST `/api/analyze`

Analyzes TikTok content and provides emotional/psychological insights.

#### Request Body (TikTok URL):
```json
{
  "tiktokUrl": "https://www.tiktok.com/@username/video/1234567890"
}
```

#### Request Body (Screenshot):
```json
{
  "screenshotBase64": "base64_encoded_image_data"
}
```

#### Response:
```json
{
  "success": true,
  "analysis": "AI-generated psychological analysis..."
}
```

#### Error Response:
```json
{
  "success": false,
  "error": "Error message"
}
```

## Features Implemented

### ✅ TikTok URL Scraping
- Extracts caption, hashtags, and audio from TikTok videos
- Uses regex patterns to parse HTML content
- Handles public TikTok videos

### ✅ OCR for Screenshots
- Uses Tesseract.js for text extraction
- Converts uploaded images to base64
- Parses extracted text to identify TikTok content patterns

### ✅ OpenAI Integration
- GPT-3.5-turbo for psychological analysis
- Structured prompts for consistent output
- Error handling and rate limiting

### ✅ Error Handling
- Invalid TikTok URLs
- Low OCR confidence warnings
- Network timeouts
- API rate limits

## Dependencies

- `openai` - OpenAI API client
- `tesseract.js` - OCR for image text extraction
- `axios` - HTTP client for TikTok scraping

## Testing the API

You can test the API using curl:

```bash
# Test with TikTok URL
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"tiktokUrl": "https://www.tiktok.com/@username/video/1234567890"}'

# Test health check
curl http://localhost:3000/api/analyze
```

## Production Considerations

1. **Rate Limiting**: Implement rate limiting for the API
2. **Caching**: Cache TikTok scraping results
3. **Monitoring**: Add logging and monitoring
4. **Security**: Validate and sanitize all inputs
5. **Scalability**: Consider using a queue system for heavy processing
