import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Store session ID and user ID for the marketing agent
let sessionId = null;
let userId = 'user-' + Math.random().toString(36).substr(2, 9);
const appName = 'MarketingAgent';

// Helper functions to extract different script types from the response
const extractYouTubeScript = (content) => {
  // Look for YouTube-specific markers or sections
  const youtubeMatch = content.match(/\*\*?YouTube\s+Script[\s\S]*?(?=\*\*?Instagram|\*\*?Blog|$)/i);
  if (youtubeMatch) {
    return youtubeMatch[0].trim();
  }
  // Fallback: return the full content if no specific section found
  return content;
};

const extractInstagramScript = (content) => {
  // Look for Instagram-specific markers or sections
  const instagramMatch = content.match(/\*\*?Instagram[\s\S]*?(?=\*\*?YouTube|\*\*?Blog|$)/i);
  if (instagramMatch) {
    return instagramMatch[0].trim();
  }
  // Fallback: return a portion of the content
  return content;
};

const extractBlogScript = (content) => {
  // Look for Blog-specific markers or sections
  const blogMatch = content.match(/\*\*?Blog[\s\S]*?(?=\*\*?YouTube|\*\*?Instagram|$)/i);
  if (blogMatch) {
    return blogMatch[0].trim();
  }
  // Fallback: return the full content
  return content;
};

const api = {
  // Initialize session with MarketingAgent using ADK format
  initSession: async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/apps/${appName}/users/${userId}/sessions`,
        null
      );
      sessionId = response.data.sessionId || response.data.id;
      console.log('Session created:', sessionId);
      return sessionId;
    } catch (error) {
      console.error('Failed to initialize session:', error);
      // Try alternative endpoint if the first fails
      try {
        const altResponse = await axios.post(`${API_BASE_URL}/sessions`, {
          appName: appName,
          userId: userId
        });
        sessionId = altResponse.data.sessionId || altResponse.data.id;
        return sessionId;
      } catch (altError) {
        console.error('Alternative session creation also failed:', altError);
        // Fallback session ID
        sessionId = 'fallback-session-' + Date.now();
        return sessionId;
      }
    }
  },

  generateContent: async (prompt) => {
    try {
      // Ensure we have a session
      if (!sessionId) {
        await api.initSession();
      }

      // Try ADK session-based messaging with correct event format
      const response = await axios.post(
        `${API_BASE_URL}/apps/${appName}/users/${userId}/sessions/${sessionId}/events`,
        {
          type: "USER",
          content: prompt
        }
      );

      // For business-focused approach, always return complete marketing package
      const contentType = 'marketing-package';
      const platforms = ['YouTube', 'Instagram', 'Blog'];

      // Extract the response content
      const responseContent = response.data.response ||
                            response.data.content ||
                            response.data.message ||
                            (response.data.events && response.data.events.length > 0
                              ? response.data.events[response.data.events.length - 1].content
                              : null);

      if (!responseContent) {
        throw new Error('Marketing agent did not return valid content. Please check if the ADK server is properly configured.');
      }

      // Parse or format response as complete marketing package
      return {
        content: responseContent,
        contentType,
        platforms,
        isMarketingPackage: true,
        scripts: {
          youtube: extractYouTubeScript(responseContent),
          instagram: extractInstagramScript(responseContent),
          blog: extractBlogScript(responseContent)
        },
        ...response.data
      };
    } catch (error) {
      console.error('API Error:', error);

      // Show clear error message as per CLAUDE.md requirements
      const errorMessage = error.response?.status === 404
        ? 'Marketing agent endpoint not found. The ADK server may not be properly configured or the MarketingAgent may not be loaded.'
        : error.message.includes('Network Error')
        ? 'Cannot connect to the marketing agent server. Please ensure the ADK server is running on port 8080.'
        : `Marketing agent error: ${error.message}`;

      throw new Error(errorMessage);
    }
  },

  // Fallback mock data only for development/testing (as noted in CLAUDE.md)
  getMockResponse: (prompt) => {
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