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

        LlmAgent TikTokAgent = LlmAgent.builder()
                .name("TikTokAgent")
                .model("gemini-2.0-flash")
                .description("Creates viral TikTok content concepts based on research data")
                .outputKey("tiktok_video")
                .includeContents(NONE)
                .instruction("""
                        You are a TikTok Content Creator specializing in viral, short-form video ideas.
                        Based on the research data provided, create 1 TikTok video concept optimized for growth.

                        **Research Context:**
                        {research_data}

                        Consider TikTok-specific trends:
                        - Fast hooks and engaging story arcs
                        - Native platform behaviors (challenges, stitches, trending audio)
                        - High retention pacing (0–30s max)
                        - CTA focused on engagement (comments, shares, follows)

                        Output *only* the TikTok concept in this format:

                        CONCEPT: [Brief, attention-grabbing video concept inspired by viral trends]

                        HOOK (0-2 seconds):
                        [Powerful opening hook following current TikTok trends]

                        STRUCTURE (0-30 seconds):
                        - Clip 1 (0-3s): [Visual or action]
                        - Clip 2 (3-10s): [Key moment or reveal]
                        - Clip 3 (10-20s): [Payoff or emotional peak]
                        - Clip 4 (20-30s): [Call to action or final punchline]

                        TRENDING AUDIO:
                        [1-2 suggestions based on current TikTok trends]

                        CAPTION:
                        [Short, snappy caption encouraging interaction]

                        HASHTAGS:
                        [3–5 trending TikTok hashtags relevant to the business]
                        """)
                .build();

        ParallelAgent parallelAgent = ParallelAgent.builder()
                .name("ContentCreationAgent")
                .subAgents(YoutubeAgent, InstagramAgent, TikTokAgent)
                .description("Runs YouTube, Instagram, and TikTok content agents in parallel")
                .build();


        LlmAgent mergerAgent = LlmAgent.builder()
                .name("SynthesisAgent")
                .model("gemini-2.0-flash")
                .description("Combines all marketing content into a cohesive package")
                .outputKey("combined_output")
                .instruction("""
                        You are an AI Assistant responsible for combining marketing content into a structured report.
                        Your primary task is to synthesize the following content pieces, clearly presenting each platform's content. Structure your response using headings for each platform. Ensure the report is coherent and integrates the key points smoothly.

                        **Input Content:**

                        *   **YouTube Script:**
                            {youtube_script}

                        *   **Instagram Reel:**
                            {instagram_reel}

                        *   **TikTok Video:**
                            {tiktok_video}

                        **Output Format:**

                        ## Complete Marketing Content Package

                        ### YouTube Video Script
                        (Based on YouTubeAgent's content)
                        {youtube_script}

                        ### Instagram Reels Content
                        (Based on InstagramAgent's content)
                        {instagram_reel}

                        ### TikTok Video Concept
                        (Based on TikTokAgent's content)
                        {tiktok_video}

                        ### Content Strategy Summary
                        [Provide a brief (2–3 sentence) summary that connects *only* the content pieces presented above, highlighting how they work together as a cohesive marketing campaign.]

                        ### Implementation Notes
                        [Provide practical implementation advice (2–3 sentences) based *only* on the content above, focusing on timing, cross-promotion, and platform optimization.]

                        Output *only* the structured report following this format. Do not include introductory or concluding phrases outside this structure.
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