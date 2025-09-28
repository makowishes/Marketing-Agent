package com.example.Marketing_Agent.agents;
import com.google.adk.agents.LlmAgent;
import com.google.adk.agents.LoopAgent;
import com.google.adk.tools.FunctionTool;
import com.google.adk.tools.Annotations.Schema;
import com.google.adk.tools.ToolContext;

import java.util.Map;

import static com.google.adk.agents.LlmAgent.IncludeContents.NONE;

public class QualityLoopAgent {
    @Schema(
            description = "Call this function ONLY when all marketing content meets quality standards (9/10 or higher), signaling the workflow should complete."
    )
    public static Map<String, Object> exitLoop(@Schema(name = "toolContext") ToolContext toolContext) {
        System.out.printf("[Quality Check Complete] exitLoop triggered\n");

        // Quick fix: Check if stream is already completed to prevent double completion
        try {
            toolContext.actions().setEscalate(true);
            System.out.printf("[Quality Check Complete] Stream escalation set successfully\n");
        } catch (IllegalStateException e) {
            System.err.printf("[Quality Check Complete] Stream already completed: %s\n", e.getMessage());
            // Don't rethrow - just log and continue
        }

        return Map.of("status", "completed");
    }


    static LlmAgent CriticAgent = LlmAgent.builder()
            .name("CriticAgent")
            .model("gemini-2.0-flash")
            .description("Reviews the current draft, providing critique if clear improvements are needed,"
                    + " otherwise signals completion.")
            .includeContents(NONE)
            .outputKey("critic_statement")
            .tools(FunctionTool.create(QualityLoopAgent.class, "exitLoop"))
            .instruction("""
                You are a Quality Control Agent responsible for reviewing all marketing content.

                Your responsibilities:
                1. Review the combined marketing output from the invocation context:
                   - {combined_output} - Complete marketing package with all content

                2. Evaluate the overall package quality based on:
                   - Content cohesiveness across all platforms
                   - Alignment with research insights
                   - Cross-platform consistency and synergy
                   - Overall engagement potential
                   - Brand voice consistency
                   - Strategic implementation viability
                   - Trending element integration

                3. Quality Standards:
                   - Overall package must score 9/10 or higher
                   - All content must work together as a unified campaign
                   - Must effectively leverage trending insights from research
                   - Platform-specific optimizations must be present
                   - Clear content strategy and implementation plan

                4. Decision Making:
                   - If combined output meets quality standards (9/10 or higher): Call the exitLoop function immediately to complete the workflow
                   - If output needs improvement: Make the improvements yourself and provide the enhanced content (DO NOT call exitLoop to continue the loop for further review)

                Available state key to review:
                - {combined_output} - Complete marketing content package

                Response Format:
                QUALITY ASSESSMENT:
                Overall Package Score: [Score/10]

                EVALUATION CRITERIA:
                - Content Cohesiveness: [Score/10] - [Feedback on YouTube + Instagram synergy]
                - Research Integration: [Score/10] - [Feedback on how well trending insights are used]
                - Cross-Platform Synergy: [Score/10] - [Feedback on YouTube and Instagram working together]
                - Brand Consistency: [Score/10] - [Feedback on consistent brand voice]
                - Implementation Strategy: [Score/10] - [Feedback on practical execution plan]

                IF overall score is 9/10 or higher: Call exitLoop function immediately.
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

    static LlmAgent RefinerAgent = LlmAgent.builder()
            .name("RefinerAgent")
            .model("gemini-2.0-flash")
            .description("Makes improvements to marketing content based on critique feedback")
            .outputKey("Current_Doc_State")
            .includeContents(NONE)
            .instruction("""
                You are a Change Agent responsible for improving marketing content based on critique feedback.

                Your responsibilities:
                1. Review the current marketing package: {combined_output}
                2. Analyze quality feedback and improvement suggestions
                3. Make specific improvements to address the feedback
                4. Maintain the overall structure while enhancing quality

                Available content to improve:
                - Research insights
                - YouTube video script
                - Instagram Reel concept
                - Content strategy summary
                - Implementation notes

                Improvement Guidelines:
                - Keep the same format structure
                - Focus on specific issues mentioned in feedback
                - Enhance content cohesiveness and synergy
                - Improve research integration
                - Strengthen brand consistency
                - Make implementation strategy more actionable
                - Ensure trending elements are well incorporated

                Output the complete improved marketing package in the same format:

                # MARKETING CONTENT PACKAGE

                ## RESEARCH INSIGHTS
                [Improved research section]

                ## YOUTUBE VIDEO SCRIPT
                [Enhanced YouTube script]

                ## INSTAGRAM REELS CONTENT
                [Improved Instagram reel]

                ## CONTENT STRATEGY SUMMARY
                [Better strategy summary]

                ## IMPLEMENTATION NOTES
                [More actionable implementation notes]

                Focus on addressing specific feedback while maintaining professional quality.
                """)
            .build();

    static LoopAgent RefinementLoop = LoopAgent.builder()
            .name("RefinementLoop")
            .description("Repeatedly refines the document with critique and then exits.")
            .maxIterations(3)
            .subAgents(CriticAgent,RefinerAgent)
            .build();

    public static LoopAgent ROOT_AGENT = RefinementLoop;
}
