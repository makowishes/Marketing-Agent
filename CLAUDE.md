Project Overview
This project builds a marketing assistant agent to help small businesses generate creative marketing content. The agent workflow includes:

Intake of business type and request via a user prompt.

Trend research on the web to source current ideas.

Parallel generation of YouTube scripts, Instagram Reels, and blog posts.

Assembly of content into a cohesive marketing kit.

An iterative quality check loop to ensure relevance and polish.

Delivery of final content without displaying mock data; errors shown if the agent malfunctions.

The system uses the Agent Development Kit (ADK) implemented in Java.

A React front end collects user input and displays results.

Usage Instructions for Claude
Analyze all current project files and their structure.

Identify and understand existing agents, workflows, and integration points.

Avoid showing mock data outputs if the agent is functioning correctly.

If the agent is not working correctly, display a clear error message to the user.

Focus on Java-based ADK agent orchestration and workflow.

Consider React front-end integration for input/output.

Write clear, modular, and well-documented code.

Follow standard Java conventions and ADK best practices.

Suggest improvements or new code aligned with project goals.

Document any assumptions or questions clearly.

Development Guidelines
Use ADK's Sequential, Parallel, and Loop workflow agents to mirror the stepwise and concurrent agent tasks.

Wrap communication between agents precisely for reuse and scalability.

Incorporate quality evaluation and iterative feedback loops in code.

Ensure front-end React communicates smoothly with the backend via APIs.

Do not inject mock data in final outputs.

Provide explanatory comments and logging for maintainability.

Repository & Workflow Notes
All agent code is in Java using ADK.

React front-end is in frontend/ folder and communicates over REST API.

No mock data unless explicitly noted for testing.

/init and /clear commands are available for Claude workflow management.

Use the # key to add incremental notes to claude.md as development progresses.

Push changes with clear commit messages.

Coordinate with front-end team on API changes.

## Technical Implementation Details

### Backend Architecture
- **ADK Server Port**: 8080
- **Spring Boot Version**: 3.4.1
- **Java Version**: 21
- **Build Tool**: Gradle 8.14.3

### Agent Structure
The marketing agent hierarchy is implemented as follows:
- **MarketingAgent** (Root) - Entry point at `com.example.Marketing_Agent.agents.MarketingAgent`
  - **MainWorkflowAgent** - Orchestrates the sequential workflow
    - **ResearchAgent** - Performs web research for trending ideas
    - **ResearchToContentAgent** - Transforms research into content creation prompts
    - **ContentCreationAgent** - Parallel content generation coordinator
      - **YouTubeAgent** - Generates YouTube scripts
      - **InstagramAgent** - Creates Instagram Reels content
      - **Blog Agent** (referenced in workflow)
    - **QualityLoopAgent** - Manages iterative quality improvements
      - **QualityAgent** - Evaluates content quality
      - **ChangeAgent** - Implements quality improvements
    - **OutputCombinerAgent** - Assembles final marketing kit

### ADK API Endpoints
The ADK server exposes the following REST API structure:
- **Create Session**: `POST /apps/{appName}/users/{userId}/sessions`
- **Send Event**: `POST /apps/{appName}/users/{userId}/sessions/{sessionId}/events`
  - Event format: `{"type": "USER", "content": "your message"}`
- **Get Session**: `GET /apps/{appName}/users/{userId}/sessions/{sessionId}`
- **List Sessions**: `GET /apps/{appName}/users/{userId}/sessions`

### Frontend Integration Points
- **API Service**: `frontend/src/services/api.js`
  - Manages session lifecycle with ADK server
  - Handles message routing to MarketingAgent
  - Implements fallback for development mode
- **Main Components**:
  - `ChatInterface.js` - Primary user interaction component
  - `MessageCard.js` - Renders agent responses with markdown support
  - `GettingStartedGuide.js` - User onboarding

### Running the System

#### Start Backend:
```bash
./gradlew runAdkWebServer
```
The server will load 11 dynamic agents and start on http://localhost:8080

#### Start Frontend:
```bash
cd frontend
npm install  # First time only
npm start
```
React dev server starts on http://localhost:3000 with proxy to backend

### Testing the Connection
```bash
# Test session creation
curl -X POST http://localhost:8080/apps/MarketingAgent/users/test-user/sessions

# Send a test message (replace SESSION_ID with actual ID from above)
curl -X POST http://localhost:8080/apps/MarketingAgent/users/test-user/sessions/{SESSION_ID}/events \
  -H "Content-Type: application/json" \
  -d '{"type": "USER", "content": "Create Instagram content for a coffee shop"}'
```

### Known Issues & Solutions
1. **Classpath warnings**: "incorrect classpath" messages are non-critical
2. **Port conflicts**: If port 8080/3000 is in use, kill existing processes
3. **Session creation fails**: Ensure MarketingAgent name matches exactly in API calls