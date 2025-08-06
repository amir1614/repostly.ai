import axios from 'axios';

interface TikTokData {
  caption: string;
  audio: string;
  hashtags: string[];
}

async function extractTikTokData(url: string): Promise<TikTokData> {
  try {
    // Validate TikTok URL
    if (!url.includes('tiktok.com')) {
      throw new Error('Invalid TikTok URL');
    }

    // Enhanced headers for better scraping success
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0'
      },
      timeout: 15000,
      maxRedirects: 5
    });

    const html = response.data;

    // Enhanced caption extraction with multiple patterns
    let caption = "";
    const captionPatterns = [
      /"desc":"([^"]+)"/,
      /"description":"([^"]+)"/,
      /"text":"([^"]+)"/,
      /"shareMeta":\s*{[^}]*"title":\s*"([^"]+)"/,
      /<meta property="og:description" content="([^"]+)"/,
      /<meta name="description" content="([^"]+)"/,
      /"itemInfo":\s*{[^}]*"text":\s*"([^"]+)"/,
      /"video":\s*{[^}]*"desc":\s*"([^"]+)"/
    ];

    for (const pattern of captionPatterns) {
      const match = html.match(pattern);
      if (match && match[1] && match[1].length > 5) {
        caption = match[1]
          .replace(/\\n/g, ' ')
          .replace(/\\"/g, '"')
          .replace(/\\t/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        break;
      }
    }

    // Enhanced hashtag extraction
    const hashtagPatterns = [
      /#\w+/g,
      /"hashtags":\s*\[([^\]]+)\]/,
      /"challenges":\s*\[([^\]]+)\]/,
      /"tags":\s*\[([^\]]+)\]/,
      /"hashtagList":\s*\[([^\]]+)\]/
    ];

    let hashtags: string[] = [];
    for (const pattern of hashtagPatterns) {
      if (pattern.global) {
        const matches = html.match(pattern) || [];
        hashtags = [...hashtags, ...matches];
      } else {
        const match = html.match(pattern);
        if (match && match[1]) {
          const extractedTags = match[1].match(/#\w+/g) || [];
          hashtags = [...hashtags, ...extractedTags];
        }
      }
    }

    // Remove duplicates and limit to 10 hashtags
    hashtags = [...new Set(hashtags)].slice(0, 10);

    // Enhanced audio extraction
    let audio = "";
    const audioPatterns = [
      /"musicName":"([^"]+)"/,
      /"music":\s*{[^}]*"title":\s*"([^"]+)"}/,
      /"audio":\s*{[^}]*"name":\s*"([^"]+)"}/,
      /"sound":\s*{[^}]*"title":\s*"([^"]+)"}/,
      /"musicMeta":\s*{[^}]*"musicName":\s*"([^"]+)"}/,
      /<meta property="og:audio:title" content="([^"]+)"/
    ];

    for (const pattern of audioPatterns) {
      const match = html.match(pattern);
      if (match && match[1] && match[1].length > 2) {
        audio = match[1]
          .replace(/\\"/g, '"')
          .replace(/\\n/g, ' ')
          .trim();
        break;
      }
    }

    // Fallback: if we couldn't extract much, try to get at least some basic info
    if (!caption && hashtags.length === 0) {
      // Try to extract any text content that might be the caption
      const textMatches = html.match(/"text":\s*"([^"]{10,})"/g);
      if (textMatches && textMatches.length > 0) {
        const longestText = textMatches.reduce((longest, current) => 
          current.length > longest.length ? current : longest
        );
        caption = longestText
          .replace(/"text":\s*"/, '')
          .replace(/"$/, '')
          .replace(/\\n/g, ' ')
          .replace(/\\"/g, '"')
          .trim();
      }
    }

    // If still no caption, try to extract from meta tags
    if (!caption) {
      const metaMatch = html.match(/<meta[^>]*content="([^"]{10,})"[^>]*>/g);
      if (metaMatch) {
        for (const meta of metaMatch) {
          const contentMatch = meta.match(/content="([^"]+)"/);
          if (contentMatch && contentMatch[1].length > 20) {
            caption = contentMatch[1].trim();
            break;
          }
        }
      }
    }

    return {
      caption: caption || "No caption found",
      audio: audio || "Unknown audio",
      hashtags: hashtags
    };

  } catch (error) {
    console.error("Error extracting TikTok metadata:", error);
    return {
      caption: '',
      audio: '',
      hashtags: []
    };
  }
}

export default extractTikTokData;
