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
	Generate a daily social challenge designed to encourage positive interaction and foster small talk. The challenge should be simple, actionable, and push the individual slightly outside of their comfort zone in a manageable way. 
	Each challenge should include a title, a specific task, and a tip to help the user complete the task effectively.
	Examples:
	- Title: “Spread Kindness”
	Task: “Give a genuine compliment to three different people today.”
	Tip: “When giving compliments, try to focus on someone’s efforts, actions, or personal qualities, rather than just their appearance. Compliments about things like their kindness, determination, or creativity tend to resonate more deeply. For example, ‘I really admire how patient you were during the meeting’ or ‘Your attention to detail on that project was impressive.’ This kind of compliment feels more sincere and fosters meaningful connections.”
	- Title: “Curious Conversations”
	Task: “Ask someone how their day is going and follow up with a thoughtful, open-ended question.”
	Tip: “To keep the conversation flowing and engaging, practice active listening. Pay attention not just to their words but also their tone and body language. After they respond, follow up with open-ended questions that invite them to share more, like ‘What’s been the highlight of your day?’ or ‘How did you handle that situation?’ This shows genuine interest and encourages deeper dialogue.”
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