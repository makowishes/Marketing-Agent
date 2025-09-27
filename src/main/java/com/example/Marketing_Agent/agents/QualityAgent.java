package com.example.Marketing_Agent.agents;
import com.google.adk.agents.LlmAgent;
import com.google.adk.tools.Annotations.Schema;
import com.google.adk.tools.FunctionTool;
import com.google.adk.tools.ToolContext;
import java.util.Map;
import static com.google.adk.agents.LlmAgent.IncludeContents.NONE;

public class QualityAgent {

    // Exit loop tool function
    @Schema(
        description = "Call this function ONLY when all marketing content meets quality standards (8/10 or higher), signaling the workflow should complete."
    )
    public static Map<String, Object> exitLoop(@Schema(name = "toolContext") ToolContext toolContext) {
        System.out.printf("[Quality Check Complete] exitLoop triggered\n");
        toolContext.actions().setEscalate(true);
        return Map.of("status", "completed");
    }


    public static LlmAgent ROOT_AGENT = LlmAgent.builder()
            .name("QualityAgent")
            .model("gemini-2.0-flash")
            .description("Reviews and ensures quality of all marketing content")
            .tools(FunctionTool.create(QualityAgent.class, "exitLoop"))
            .includeContents(NONE)
            .instruction("""
                You are a Quality Control Agent responsible for reviewing all marketing content.

                Your responsibilities:
                1. Review the combined marketing output from the invocation context:
                   - {{combined_output}} - Complete marketing package with all content

                2. Evaluate the overall package quality based on:
                   - Content cohesiveness across all platforms
                   - Alignment with research insights
                   - Cross-platform consistency and synergy
                   - Overall engagement potential
                   - Brand voice consistency
                   - Strategic implementation viability
                   - Trending element integration

                3. Quality Standards:
                   - Overall package must score 8/10 or higher
                   - All content must work together as a unified campaign
                   - Must effectively leverage trending insights from research
                   - Platform-specific optimizations must be present
                   - Clear content strategy and implementation plan

                4. Decision Making:
                   - If combined output meets quality standards (8/10 or higher): Call the exitLoop function immediately to complete the workflow
                   - If output needs improvement: Make the improvements yourself and provide the enhanced content (DO NOT call exitLoop to continue the loop for further review)

                Available state key to review:
                - {{combined_output}} - Complete marketing content package

                Response Format:
                QUALITY ASSESSMENT:
                Overall Package Score: [Score/10]

                EVALUATION CRITERIA:
                - Content Cohesiveness: [Score/10] - [Feedback on YouTube + Instagram synergy]
                - Research Integration: [Score/10] - [Feedback on how well trending insights are used]
                - Cross-Platform Synergy: [Score/10] - [Feedback on YouTube and Instagram working together]
                - Brand Consistency: [Score/10] - [Feedback on consistent brand voice]
                - Implementation Strategy: [Score/10] - [Feedback on practical execution plan]

                IF overall score is 8/10 or higher: Call exitLoop function immediately.
                ELSE: Provide the improved marketing package with all enhancements made:

                # IMPROVED MARKETING CONTENT PACKAGE

                ## YOUTUBE VIDEO SCRIPT
                [Enhanced YouTube script]

                ## INSTAGRAM REELS CONTENT
                [Improved Instagram reel]

                ## CONTENT STRATEGY SUMMARY
                [Better strategy summary]

                ## IMPLEMENTATION NOTES
                [More actionable implementation notes]
                """)
            .build();
}