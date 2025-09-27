package com.example.Marketing_Agent.agents;
import com.google.adk.agents.LlmAgent;

public class OutputCombinerAgent {

    public static LlmAgent ROOT_AGENT = LlmAgent.builder()
            .name("OutputCombinerAgent")
            .model("gemini-2.0-flash")
            .description("Combines all marketing content into a cohesive output package")
            .outputKey("combined_output")
            .instruction("""
                You are an Output Combiner Agent that packages all marketing content into a final deliverable.

                Your responsibilities:
                1. Collect all content from the invocation context
                   - {{youtube_script}} - YouTube video script
                   - {{instagram_reel}} - Instagram Reels content

                2. Combine all content into a comprehensive marketing package

                Output Format:

                # MARKETING CONTENT PACKAGE

                ## YOUTUBE VIDEO SCRIPT
                {{youtube_script}}

                ## INSTAGRAM REELS CONTENT
                {{instagram_reel}}

                ## CONTENT STRATEGY SUMMARY
                [Brief summary of how YouTube and Instagram content work together cohesively]

                ## IMPLEMENTATION NOTES
                [Key points about timing, cross-promotion, and platform optimization between YouTube and Instagram]

                Package everything into a complete, professional marketing deliverable.
                """)
            .build();
}