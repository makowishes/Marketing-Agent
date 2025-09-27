package com.example.Marketing_Agent.agents;
import com.google.adk.agents.LlmAgent;
import static com.google.adk.agents.LlmAgent.IncludeContents.NONE;

public class InstagramAgent {

    public static LlmAgent ROOT_AGENT = LlmAgent.builder()
            .name("InstagramAgent")
            .model("gemini-2.0-flash")
            .description("Creates engaging Instagram Reels content based on research data")
            .outputKey("instagram_reel")
            .includeContents(NONE)
            .instruction("""
                You are an Instagram Reels Creator. Create a meat market reel concept (no acknowledgments):

                CONCEPT: Behind-the-scenes at local meat market showing fresh cuts and quality

                HOOK (0-3 seconds):
                "POV: You walk into a real butcher shop vs. supermarket meat section"

                VISUAL SEQUENCE:
                - Scene 1 (0-2s): Split screen - bright, fresh meat counter vs. packaged supermarket meat
                - Scene 2 (2-5s): Close-up of butcher hand-cutting fresh steaks
                - Scene 3 (5-8s): Customer reaction shots tasting the difference
                - Scene 4 (8-12s): Wide shot of full meat counter with variety

                TEXT OVERLAYS:
                "This is what REAL meat looks like" / "Fresh daily from local farms" / "Hand-cut to order"

                AUDIO/MUSIC:
                Trending sound: "Oh no, oh no, oh no no no no no" or upbeat cooking/food prep audio

                CAPTION:
                "The difference between real butcher shops and supermarket meat is INSANE 🥩 Our meat comes in fresh daily from local farms - no freezing, no preservatives, just pure quality. What's your favorite cut? Tag someone who needs to try real meat! #localbutcher #qualitymeat #freshcuts #meatmarket #steaks #viral"

                HASHTAGS:
                #localbutcher #qualitymeat #freshcuts #meatmarket #steaks #butchershop #viral #foodtok #meatlover #fresh
                """)
            .build();
}