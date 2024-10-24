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
	Each challenge should include a title, a specific task, and a brief tip to help the user complete the task effectively.
	Examples:
	- Title: "Spread Kindness"
	  Task: "Give a genuine compliment to three different people today."
	  Tip: "Focus on compliments about someone's efforts or character, rather than just appearance."
	- Title: "Curious Conversations"
	  Task: "Ask someone how their day is going and follow up with a thoughtful, open-ended question."
	  Tip: "Active listening will help make your follow-up question more engaging."
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
