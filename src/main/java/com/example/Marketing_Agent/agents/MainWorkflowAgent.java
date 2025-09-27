package com.example.Marketing_Agent.agents;
import com.google.adk.agents.SequentialAgent;

public class MainWorkflowAgent {

    public static SequentialAgent ROOT_AGENT = SequentialAgent.builder()
            .name("MainWorkflowAgent")
            .description("Complete marketing workflow: Research → Parallel Content Creation → Combine → Quality Loop (Review & Improve)")
            .subAgents(
                ResearchAgent.ROOT_AGENT,                    // 1. Research trending marketing ideas
                ContentCreationAgent.ROOT_AGENT,             // 2. Create YouTube + Instagram content in parallel
                OutputCombinerAgent.ROOT_AGENT,              // 3. Combine all content into unified package
                QualityLoopAgent.ROOT_AGENT                  // 4. Quality loop: QualityAgent reviews → ChangeAgent improves → repeat until 8/10+
            )
            .build();
}