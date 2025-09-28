package com.example.Marketing_Agent.agents;

import com.google.adk.agents.BaseAgent;
import com.google.adk.agents.CallbackContext;
import com.google.adk.agents.Callbacks;
import com.google.adk.agents.InvocationContext;
import com.google.adk.agents.LlmAgent;
import com.google.adk.models.LlmRequest;
import com.google.adk.models.LlmResponse;
import com.google.adk.tools.BaseTool;
import com.google.adk.tools.ToolContext;
import com.google.genai.types.Content;
import com.google.genai.types.Part;
import io.reactivex.rxjava3.core.Maybe;

import java.util.Map;

public class MarketingAgent {

    public static LlmAgent ROOT_AGENT = LlmAgent.builder()
            .name("MarketingAgent")
            .model("gemini-2.5-flash")
            .description("Complete MainWorkFlowAgent")
            .beforeModelCallback(MarketingAgent::blockUnsafeInputGuardrail)
            .beforeToolCallback(MarketingAgent::blockUnsafeToolGuardrail)
            .subAgents(MainWorkflowAgent.ROOT_AGENT)
            .instruction("""
                You are the Root Marketing Agent for a complete marketing workflow.

                Your purpose:
                - Introduce yourself as a marketing workflow coordinator that helps small businesses get research-backed marketing insights.
                - Before starting, **ask the business a few key questions** to collect the information the research agent will need: 
                  
                  1. What industry is your business in? (e.g., fitness, fashion, food)
                  2. Who is your target audience? (e.g., age range, location, interests)
                  3. What are your main marketing goals? (e.g., brand awareness, lead generation, sales)
                  4. What is the prospective name of your company?
                  5. Are there any competitors or brands you admire?

                Once the user provides this info:
                - Acknowledge their input enthusiastically and summarize it briefly.
                - Then pass this information to the MainWorkFlowAgent SubAgent to continue the research workflow.
                - The sub-agent will use this to run real-time Google searches, analyze marketing trends, and return actionable insights.

                IMPORTANT:
                - Run the workflow ONLY ONCE per request.
                - After the MainWorkFlowAgent finishes and delivers the results, your job is complete.
                - Do not restart or re-run the process after completion.
                - Make sure that the questions above are asked in different output. So the first output should be an introduction and the first question, so on and so forth.

                Be friendly, helpful, and professional. Guide the user smoothly into providing the necessary details before starting the research.
                """)
            .build();

    private static Maybe<LlmResponse> blockUnsafeInputGuardrail(CallbackContext callbackContext, LlmRequest llmRequest) {
        String lastUserMessageText = "";

        // Extract latest user message
        if (llmRequest.contents() != null && !llmRequest.contents().isEmpty()) {
            for (int i = llmRequest.contents().size() - 1; i >= 0; i--) {
                Content content = llmRequest.contents().get(i);
                if (content.role().isPresent() && "user".equals(content.role().get()) &&
                        content.parts().isPresent() && !content.parts().get().isEmpty()) {
                    if (content.parts().get().get(0).text().isPresent()) {
                        lastUserMessageText = content.parts().get().get(0).text().get();
                        break;
                    }
                }
            }
        }

        // Block if input contains banned keywords
        String[] bannedWords = {"sex", "porn", "kill", "nsfw", "hate", "violence"};
        for (String word : bannedWords) {
            if (lastUserMessageText.toLowerCase().contains(word)) {
                Content blockedContent = Content.fromParts(
                        Part.fromText("🚫 I cannot process this request because it contains unsafe or inappropriate content.")
                );
                LlmResponse blockedResponse = LlmResponse.builder()
                        .content(blockedContent)
                        .build();
                return Maybe.just(blockedResponse);
            }
        }

        return Maybe.empty(); // ✅ Safe → proceed normally
    }


    private static Maybe<Map<String, Object>> blockUnsafeToolGuardrail(
            InvocationContext invocationContext,
            BaseTool baseTool,
            Map<String, Object> input,
            ToolContext toolContext) {

        String[] bannedWords = {"sex", "porn", "kill", "nsfw", "hate", "violence"};

        for (Map.Entry<String, Object> entry : input.entrySet()) {
            String value = entry.getValue().toString().toLowerCase();
            for (String word : bannedWords) {
                if (value.contains(word)) {
                    return Maybe.just(Map.of(
                            "status", "error",
                            "error_message", "🚫 Tool call blocked: Inappropriate content detected in input. Please revise and try again."
                    ));
                }
            }
        }

        return Maybe.empty(); // ✅ Safe → let the tool execute
    }

}
