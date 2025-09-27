package com.example.Marketing_Agent.agents;
import com.google.adk.agents.LlmAgent;

public class MarketingAgent {

    public static LlmAgent ROOT_AGENT = LlmAgent.builder()
            .name("MarketingAgent")
            .model("gemini-2.0-flash")
            .description("Complete MainWorkFlowAgent")
            .subAgents(MainWorkflowAgent.ROOT_AGENT)
            .instruction("""
                You are the Root Marketing Agent for a complete marketing workflow.

                Your role:
                - Accept business prompts from users
                - The workflow automatically handles the complete process through the MainWorkFlowAgent SubAgent
                - Simply acknowledge the user's request and let the workflow proceed

                Be enthusiastic and briefly explain what will happen, then let the sub-agents handle the work.
                """)
            .build();
}
