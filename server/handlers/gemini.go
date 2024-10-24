package handlers

import (
	"context"
	"net/http"
	"os"

	"github.com/google/generative-ai-go/genai"
	"github.com/labstack/echo/v4"
	"google.golang.org/api/option"
)

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
	prompt := "Generate a simple, daily social challenge that encourages friendly interaction and small talk. The challenge should push me slightly outside of my comfort zone, but still be manageable. Keep it brief and focus on positive, low-pressure activities to start conversations or engage with others. Examples: 'Give a genuine compliment to three different people', 'Ask someone how their day is going and follow up with a thoughtful question.'"

	model := client.GenerativeModel("gemini-1.5-flash")
	resp, err := model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		return c.String(http.StatusInternalServerError, "Failed to generate content")
	}

	var result string
	if resp.Candidates != nil {
		for _, v := range resp.Candidates {
			for _, k := range v.Content.Parts {
				result = string(k.(genai.Text))
			}
		}
	} else {
		return c.String(http.StatusInternalServerError, "No content generated")
	}

	// Return the generated content as a response
	return c.String(http.StatusOK, result)
}
