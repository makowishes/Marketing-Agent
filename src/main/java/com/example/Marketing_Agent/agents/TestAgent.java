package com.example.Marketing_Agent.agents;
import com.google.adk.agents.LlmAgent;

public class TestAgent {

    public static LlmAgent ROOT_AGENT = LlmAgent.builder()
            .name("Test Agent")
            .model("gemini-2.0-flash")
            // A concise summary of the agent's overall purpose. This becomes crucial later
            // when other agents need to decide whether to delegate tasks to this agent.
            .description("A helpful marketing agent that helps plan videos for a business ")
            // Detailed guidance for the LLM on how to behave, its persona, its goals,
            // and specifically how and when to utilize its assigned `tools`.
            .instruction("""
				You are a friendly and enthusiastic Marketing Agent.
				Your goal is to make sure the user can have make the most up to date marketing content.
				""")
            .build();
}
