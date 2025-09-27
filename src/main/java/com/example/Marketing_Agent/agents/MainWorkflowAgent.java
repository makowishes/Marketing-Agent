package com.example.Marketing_Agent.agents;
import com.google.adk.agents.SequentialAgent;

public class MainWorkflowAgent {

    public static SequentialAgent ROOT_AGENT = SequentialAgent.builder()
            .name("MainWorkflowAgent")
            .description("Complete marketing workflow: Research → Content Creation (Parallel + Combine) → Quality Loop (Review & Improve)")
            .subAgents(
                ResearchAgent.ROOT_AGENT,                    // 1. Research trending marketing ideas
                ContentCreationAgent.ROOT_AGENT,             // 2. Create YouTube + Instagram content in parallel, then combine
                QualityLoopAgent.ROOT_AGENT                  // 3. Quality loop: QualityAgent reviews → ChangeAgent improves → repeat until 8/10+
            )
            .build();
}