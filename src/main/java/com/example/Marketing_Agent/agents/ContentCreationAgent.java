package com.example.Marketing_Agent.agents;
import com.google.adk.agents.LlmAgent;
import com.google.adk.agents.ParallelAgent;
import com.google.adk.agents.SequentialAgent;

import static com.google.adk.agents.LlmAgent.IncludeContents.NONE;

public class ContentCreationAgent {

    public static SequentialAgent ROOT_AGENT = initAgent();

    public static SequentialAgent initAgent() {
        LlmAgent YoutubeAgent = LlmAgent.builder()
                .name("YouTubeAgent")
                .model("gemini-2.0-flash")
                .description("Creates engaging YouTube video scripts based on research data")
                .outputKey("youtube_script")
                .includeContents(NONE)
                .instruction("""
                        You are a YouTube Script Writer specializing in creating engaging video content.
                        Create a compelling YouTube video script based on the business type and research data provided.

                        **Research Context:**
                        {research_data}

                        Use the research data above to inform your script, incorporating:
                        - Trending ideas and viral content themes
                        - Target audience insights
                        - Current market trends
                        - Relevant hashtags and keywords
                        - Successful examples as inspiration

                        Output *only* the script in this format:

                        TITLE: [Catchy, SEO-optimized title using trending keywords]

                        HOOK (0-15 seconds):
                        [Attention-grabbing opening based on viral content themes]

                        INTRODUCTION (15-30 seconds):
                        [Brief intro and value proposition aligned with target audience insights]

                        MAIN CONTENT (30 seconds - 5 minutes):
                        [Key points with timestamps incorporating trending ideas - keep video under 5 minutes total]

                        CALL TO ACTION:
                        [Subscribe, like, comment prompts]

                        DESCRIPTION:
                        [YouTube description with trending hashtags from research]
                        """)
                .build();

        LlmAgent InstagramAgent = LlmAgent.builder()
                .name("InstagramAgent")
                .model("gemini-2.0-flash")
                .description("Creates engaging Instagram Reels content based on research data")
                .outputKey("instagram_reel")
                .includeContents(NONE)
                .instruction("""
                        You are an Instagram Reels Content Creator specializing in viral short-form content.
                        Create 1 Instagram Reels concept based on the business type and research data provided.

                        **Research Context:**
                        {research_data}

                        Use the research data above to inform your reel, incorporating:
                        - Viral content themes and trending formats
                        - Target audience behaviors and preferences
                        - Current market trends and hot topics
                        - Trending hashtags and keywords
                        - Successful examples as reference

                        Output *only* the reel concept in this format:

                        CONCEPT: [Brief description of the reel idea based on trending themes]

                        HOOK (0-3 seconds):
                        [Immediate attention grabber using viral content patterns]

                        VISUAL SEQUENCE:
                        [Scene-by-scene breakdown with timing]
                        - Scene 1 (0-2s): [Visual description]
                        - Scene 2 (2-5s): [Visual description]
                        - Scene 3 (5-8s): [Visual description]
                        [Continue as needed]

                        TEXT OVERLAYS:
                        [Key text to display on screen using trending language]

                        AUDIO/MUSIC:
                        [Trending audio suggestions from research]

                        CAPTION:
                        [Engaging caption aligned with target audience]

                        HASHTAGS:
                        [Use trending hashtags from research data]
                        """)
                .build();

        ParallelAgent parallelAgent = ParallelAgent.builder()
                .name("ContentCreationAgent")
                .subAgents(YoutubeAgent, InstagramAgent)
                .description("runs youtube agent and instagram agent in parallel to create content")
                .build();

        LlmAgent mergerAgent = LlmAgent.builder()
                .name("SynthesisAgent")
                .model("gemini-2.0-flash")
                .description("Combines all marketing content into a cohesive package")
                .outputKey("combined_output")
                .instruction("""
                        You are an AI Assistant responsible for combining marketing content into a structured report.
                        Your primary task is to synthesize the following content pieces, clearly presenting each platform's content. Structure your response using headings for each platform. Ensure the report is coherent and integrates the key points smoothly.
                        **Crucially: Your entire response MUST be grounded *exclusively* on the information provided in the 'Input Content' below. Do NOT add any external knowledge, facts, or details not present in these specific content pieces.**
                        
                        **Input Content:**
                        
                        *   **YouTube Script:**
                            {youtube_script}
                        
                        *   **Instagram Reel:**
                            {instagram_reel}
                        
                        **Output Format:**
                        
                        ## Complete Marketing Content Package
                        
                        ### YouTube Video Script
                        (Based on YouTubeAgent's content)
                        {youtube_script}
                        
                        ### Instagram Reels Content
                        (Based on InstagramAgent's content)
                        {instagram_reel}
                        
                        ### Content Strategy Summary
                        [Provide a brief (2-3 sentence) summary that connects *only* the content pieces presented above, highlighting how they work together as a cohesive marketing campaign.]
                        
                        ### Implementation Notes
                        [Provide practical implementation advice (2-3 sentences) based *only* on the content above, focusing on timing, cross-promotion, and platform optimization.]
                        
                        Output *only* the structured report following this format. Do not include introductory or concluding phrases outside this structure, and strictly adhere to using only the provided input content.
                        """)
                .build();


        SequentialAgent sequentialAgent =
                SequentialAgent.builder()
                        .name("ParallelAndMergerAgent")
                        .subAgents(parallelAgent, mergerAgent)
                        .description("Coordinates parallel agents and synthesizes the results.")
                        .build();

        return sequentialAgent;
    }
}