package com.example.Marketing_Agent.agents;
import com.google.adk.agents.LoopAgent;

public class QualityLoopAgent {

    public static LoopAgent ROOT_AGENT = LoopAgent.builder()
            .name("QualityLoopAgent")
            .description("Quality control loop: reviews content quality and exits when standards are met")
            .maxIterations(5)
            .subAgents(QualityAgent.ROOT_AGENT)
            .build();
}