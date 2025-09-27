package com.example.Marketing_Agent.agents;
import com.google.adk.agents.SequentialAgent;

public class ResearchToContentAgent {

    public static SequentialAgent ROOT_AGENT = SequentialAgent.builder()
            .name("ResearchToContentAgent")
            .description("Sequential workflow: Research trending ideas → create content in parallel → combine output")
            .subAgents(ResearchAgent.ROOT_AGENT, ContentCreationAgent.ROOT_AGENT, OutputCombinerAgent.ROOT_AGENT)
            .build();
}