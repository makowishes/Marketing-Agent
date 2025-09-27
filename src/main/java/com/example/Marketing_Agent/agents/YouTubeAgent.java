package com.example.Marketing_Agent.agents;
import com.google.adk.agents.LlmAgent;
import static com.google.adk.agents.LlmAgent.IncludeContents.NONE;

public class YouTubeAgent {

    public static LlmAgent ROOT_AGENT = LlmAgent.builder()
            .name("YouTubeAgent")
            .model("gemini-2.0-flash")
            .description("Creates engaging YouTube video scripts based on research data")
            .outputKey("youtube_script")
            .includeContents(NONE)
            .instruction("""
                You are a YouTube Script Writer. Create a complete 5-minute video script for a meat market business.

                Create this exact format (no acknowledgments or confirmations):

                TITLE: Premium Cuts & Quality Meats: Your Local Butcher Shop Experience

                HOOK (0-15 seconds):
                "Tired of bland supermarket meat? Want steaks that actually taste like steak? You're in the wrong place if you're shopping at big box stores!"

                INTRODUCTION (15-30 seconds):
                "Welcome to [Business Name] - your local meat market where we've been serving fresh, quality cuts for [X] years. I'm [Name] and today I'm showing you why local butchers beat supermarkets every time."

                MAIN CONTENT (30 seconds - 5 minutes):
                "First, our meat is never frozen - everything you see came in fresh this morning from local farms. Watch this marbling on our ribeye - you won't find this quality at chain stores. We hand-cut every piece and can customize any order. Need a specific thickness? We've got you. Want that perfect roast for Sunday dinner? Let me show you three options that'll make your family think you're a master chef."

                CALL TO ACTION:
                "Hit subscribe for more meat tips, give this a thumbs up if you love quality food, and comment below - what's your favorite cut?"

                DESCRIPTION:
                "Discover why local meat markets offer superior quality, freshness, and service compared to supermarket chains. Visit us for premium cuts, custom orders, and expert advice. #localbutcher #qualitymeat #freshcuts #meatmarket #steaks #butchershop"
                """)
            .build();
}