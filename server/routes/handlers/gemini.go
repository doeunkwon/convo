package handlers

import (
	"context"
	"convo/db"
	"encoding/json"
	"fmt"
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

func GenerateChallenge(c echo.Context, sqlManager *db.SQLManager) error {

	fmt.Println("========================================")

	ctx := context.Background()

	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		fmt.Println("Error: API key not set")
		return c.String(http.StatusInternalServerError, "API key not set")
	}

	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		fmt.Println("Error: Failed to create client:", err)
		return c.String(http.StatusInternalServerError, "Failed to create client")
	}
	defer client.Close()

	userID := c.QueryParam("userID")
	if userID == "" {
		fmt.Println("Error: User ID is required")
		return c.String(http.StatusBadRequest, "User ID is required")
	}

	level := c.QueryParam("level")
	if level == "" {
		fmt.Println("Error: Level is required")
		return c.String(http.StatusBadRequest, "Level is required")
	}

	// Hardcoded prompt
	prompt := fmt.Sprintf(`
	Generate a daily social challenge with a difficulty level of %s/3, where:

	1/3 = Very easy, simple social engagement.
	3/3 = High-level social interaction, suited for those with strong social skills.

	Each challenge should inspire positive connections, encourage small talk, and gently push the user out of their comfort zone in an achievable way. Include:

	- Title: A catchy, motivating name.
	- Task: A specific, actionable task to be completed within the day.
	- Tip: A practical tip for success.

	### Examples:

	1/3 - Easy
	- Title: "Friendly Wave"
	  Task: Smile and give a small wave or nod to at least three strangers today.
	  Tip: Make brief eye contact, nod, and smile. If someone nods back, you’ve succeeded in creating a small connection.

	- Title: "Warm Greeting"
	  Task: Say "good morning" or "hello" to a stranger you pass by.
	  Tip: Keep your tone warm and genuine. A simple greeting can brighten someone's day without requiring a conversation.

	2/3 - Moderate
	- Title: "Quick Thank You"
	  Task: Thank a bus driver, cashier, or security guard with a little extra warmth and sincerity.
	  Tip: Make your thanks a little more specific, like “Thanks for always being here,” to show you appreciate their role.

	- Title: "Compliment a Stranger’s Style"
	  Task: Compliment something a stranger is wearing, like “I love your scarf!” or “Great jacket!”
	  Tip: Keep it short, specific, and genuine, so it feels natural.

	3/3 - Challenging
	- Title: "Open-Ended Question"
	  Task: Ask an open-ended question to a stranger in line, on the bus, or waiting nearby. For instance, “What’s been the highlight of your day?”
	  Tip: Aim for a question that invites a story or response longer than yes/no. Follow up with active listening cues, like nodding or smiling.

	- Title: "Community Moment"
	  Task: Strike up a conversation about a shared situation (like the weather, a delay, or the surroundings) with someone nearby.
	  Tip: Make a lighthearted comment on something around you, like “Looks like rain again!” or “This line’s always so long!” and see if they respond.

	`, level)

	fmt.Println("Debug: Level:", level)

	model := client.GenerativeModel("gemini-1.5-flash")
	model.ResponseMIMEType = "application/json"
	model.ResponseSchema = &genai.Schema{
		Type: genai.TypeObject,
		Properties: map[string]*genai.Schema{
			"title": {Type: genai.TypeString},
			"task":  {Type: genai.TypeString},
			"tip":   {Type: genai.TypeString},
		},
	}

	var challenge ChallengeResponse
	maxAttempts := 5
	for attempts := 0; attempts < maxAttempts; attempts++ {
		fmt.Println("Debug: Attempt", attempts+1)

		resp, err := model.GenerateContent(ctx, genai.Text(prompt))
		if err != nil {
			fmt.Println("Error: Failed to generate content on attempt", attempts+1, ":", err)
			continue // Retry on error
		}

		validResponse := false
		for _, part := range resp.Candidates[0].Content.Parts {
			if txt, ok := part.(genai.Text); ok {
				fmt.Println("Debug: Received text part:", txt)
				if err := json.Unmarshal([]byte(txt), &challenge); err != nil {
					fmt.Println("Error: Failed to parse response:", err)
					continue
				}
				if challenge.Title != "" && challenge.Task != "" && challenge.Tip != "" {
					validResponse = true
					break
				}
			}
		}

		if validResponse {
			fmt.Println("Debug: Valid challenge generated on attempt", attempts+1)
			break
		} else {
			fmt.Println("Warning: Invalid response format, regenerating... Attempt", attempts+1)
		}
	}

	if challenge.Title == "" || challenge.Task == "" || challenge.Tip == "" {
		fmt.Println("Error: Could not generate a valid challenge after", maxAttempts, "attempts")
		return c.String(http.StatusInternalServerError, "Could not generate a valid challenge")
	}

	fmt.Println("Debug: Generated challenge:", challenge)

	fmt.Println("========================================")

	// Return the generated content as a response
	return c.JSON(http.StatusOK, challenge)
}
