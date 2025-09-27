package com.example.Marketing_Agent.agents;
import com.google.adk.agents.LlmAgent;

public class MarketingAgent {

    public static LlmAgent ROOT_AGENT = LlmAgent.builder()
            .name("MarketingAgent")
            .model("gemini-2.0-flash")
            .description("Complete marketing workflow: research → content creation → quality control")
            .subAgents(MainWorkflowAgent.ROOT_AGENT)
            .instruction("""
                You are the Root Marketing Agent for a complete marketing workflow.

                Your role:
                - Accept business prompts from users
                - The workflow automatically handles the complete process through sub-agents
                - Simply acknowledge the user's request and let the workflow proceed

                The automatic workflow includes:
                - Research trending marketing ideas
                - Create YouTube scripts, Instagram Reels, and blog posts in parallel
                - Quality control with iterative improvements until standards are met

                Be enthusiastic and briefly explain what will happen, then let the sub-agents handle the work.
                """)
            .build();
}
