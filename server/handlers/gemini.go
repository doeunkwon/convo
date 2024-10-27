package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"os"

	"github.com/google/generative-ai-go/genai"
	"github.com/labstack/echo/v4"
	"google.golang.org/api/option"
)

type ChallengeResponse struct {
	Title string `json:"title"`
	Task  string `json:"task"`
	Tip   string `json:"tip"`
}

func GenerateChallenge(c echo.Context) error {
	ctx := context.Background()

	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		return c.String(http.StatusInternalServerError, "API key not set")
	}

	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		return c.String(http.StatusInternalServerError, "Failed to create client")
	}
	defer client.Close()

	// Hardcoded prompt
	prompt := `
	Generate a daily social challenge to inspire positive interactions and promote small talk. Each challenge should be simple, actionable, and encourage the user to step slightly outside their comfort zone in a manageable way. The challenge should include:

	- Title: A catchy, motivating title.
	- Task: A clear, specific task that the user can complete within a day.
	- Tip: A practical tip to help the user complete the task effectively.

	Use the following examples for guidance:

	Titles:
	1. “Moments of Kindness”
	2. “Spark a Smile”
	3. “Thoughtful Gestures”
	4. “Connect Through Curiosity”
	5. “Express Appreciation”
	6. “Make a New Friend”
	7. “Deepen the Dialogue”
	8. “Pay it Forward”
	9. “Lend a Listening Ear”
	10. “Boost Someone’s Day”

	Examples:

	- Title: “Spread Kindness”
	Task: “Give a genuine compliment to three different people today.”
	Tip: “When giving compliments, focus on efforts, actions, or personal qualities rather than appearance. Compliments about kindness, determination, or creativity resonate more deeply, like ‘I admire how patient you were during the meeting’ or ‘Your attention to detail was impressive.’ This helps foster meaningful connections.”

	- Title: “Curious Conversations”
	Task: “Ask someone how their day is going, then follow up with a thoughtful, open-ended question.”
	Tip: “Practice active listening. Pay attention to their words, tone, and body language. Follow up with open-ended questions like ‘What’s been the highlight of your day?’ to show genuine interest and encourage deeper dialogue.”
	`

	model := client.GenerativeModel("gemini-1.5-flash")
	// Ask the model to respond with JSON.
	model.ResponseMIMEType = "application/json"
	// Specify the schema.
	model.ResponseSchema = &genai.Schema{
		Type: genai.TypeObject,
		Properties: map[string]*genai.Schema{
			"title": {Type: genai.TypeString},
			"task":  {Type: genai.TypeString},
			"tip":   {Type: genai.TypeString},
		},
	}
	resp, err := model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		return c.String(http.StatusInternalServerError, "Failed to generate content")
	}

	var challenge ChallengeResponse
	for _, part := range resp.Candidates[0].Content.Parts {
		if txt, ok := part.(genai.Text); ok {
			if err := json.Unmarshal([]byte(txt), &challenge); err != nil {
				return c.String(http.StatusInternalServerError, "Failed to parse response")
			}
			break
		}
	}

	if challenge.Title == "" || challenge.Task == "" || challenge.Tip == "" {
		return c.String(http.StatusInternalServerError, "Invalid response format")
	}

	// Return the generated content as a response
	return c.JSON(http.StatusOK, challenge)
}
