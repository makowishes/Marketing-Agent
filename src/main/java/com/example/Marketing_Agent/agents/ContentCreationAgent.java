package com.example.Marketing_Agent.agents;
import com.google.adk.agents.ParallelAgent;

public class ContentCreationAgent {

    public static ParallelAgent ROOT_AGENT = ParallelAgent.builder()
            .name("ContentCreationAgent")
            .description("Creates YouTube and Instagram content in parallel")
            .subAgents(YouTubeAgent.ROOT_AGENT,InstagramAgent.ROOT_AGENT)
            .build();
}