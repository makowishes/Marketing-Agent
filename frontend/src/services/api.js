import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = {
  generateContent: async (prompt) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/generate`, {
        prompt,
        timestamp: new Date().toISOString()
      });

      // Determine content type based on prompt keywords
      let contentType = 'text';
      let platforms = [];

      if (prompt.toLowerCase().includes('youtube')) {
        contentType = 'youtube';
        platforms = ['YouTube'];
      } else if (prompt.toLowerCase().includes('instagram')) {
        contentType = 'instagram';
        platforms = ['Instagram'];
      } else if (prompt.toLowerCase().includes('blog')) {
        contentType = 'blog';
        platforms = ['Blog'];
      }

      return {
        content: response.data.content || response.data.message || 'Generated content will appear here.',
        contentType,
        platforms,
        ...response.data
      };
    } catch (error) {
      console.error('API Error:', error);

      // Return mock data for development/testing
      const mockResponses = {
        youtube: `🎬 **YouTube Script: ${prompt}**\n\n**HOOK (0-15 seconds):**\n"Did you know that 90% of viewers decide to keep watching in the first 15 seconds?"\n\n**INTRODUCTION (15-30 seconds):**\nWelcome back to [Channel Name]! Today, we're diving into something incredible...\n\n**MAIN CONTENT (30 seconds - 8 minutes):**\n• Point 1: Start with the problem\n• Point 2: Present your solution\n• Point 3: Show real examples\n• Point 4: Share expert tips\n\n**CALL TO ACTION (Final 30 seconds):**\n"If you found this valuable, smash that like button and subscribe for more content like this!"\n\n**END SCREEN:**\nCheck out these related videos to continue your journey!`,

        instagram: `📸 **Instagram Post**\n\n**Caption:**\n✨ ${prompt} ✨\n\nSwipe for the surprise! 👉\n\nHere's what you need to know:\n🎯 Point 1: Keep it authentic\n💡 Point 2: Value-first content\n🚀 Point 3: Engage with your audience\n\n Drop a ❤️ if this resonates with you!\n\n**Hashtags:**\n#MarketingTips #ContentCreation #SocialMediaStrategy #DigitalMarketing #BusinessGrowth #EntrepreneurLife #MarketingAgency #ContentStrategy`,

        blog: `# ${prompt}\n\n## Introduction\nIn today's digital landscape, understanding your audience is more crucial than ever...\n\n## The Challenge\nMany businesses struggle with creating content that truly resonates with their target market.\n\n## The Solution\n### 1. Know Your Audience\nStart by creating detailed buyer personas...\n\n### 2. Create Value-Driven Content\nFocus on solving real problems...\n\n### 3. Optimize for Engagement\nUse data to understand what works...\n\n## Key Takeaways\n• Always lead with value\n• Test and iterate based on data\n• Build genuine connections\n\n## Conclusion\nSuccess in content marketing comes from understanding your audience and delivering consistent value.`
      };

      let mockContent = mockResponses.blog;
      let contentType = 'text';
      let platforms = [];

      if (prompt.toLowerCase().includes('youtube')) {
        mockContent = mockResponses.youtube;
        contentType = 'youtube';
        platforms = ['YouTube'];
      } else if (prompt.toLowerCase().includes('instagram')) {
        mockContent = mockResponses.instagram;
        contentType = 'instagram';
        platforms = ['Instagram'];
      } else if (prompt.toLowerCase().includes('blog')) {
        mockContent = mockResponses.blog;
        contentType = 'blog';
        platforms = ['Blog'];
      }

      return {
        content: mockContent,
        contentType,
        platforms
      };
    }
  },

  // A2A Loop trigger
  triggerA2A: async (contentId, platform) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/a2a-loop`, {
        contentId,
        platform,
        action: 'regenerate'
      });
      return response.data;
    } catch (error) {
      console.error('A2A Error:', error);
      throw error;
    }
  }
};

export default api;