package main

import (
	"context"
	"convo/handlers"
	"log"
	"net/http"
	"os"

	firebase "firebase.google.com/go"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"google.golang.org/api/option"
)

func main() {
	// Load environment variables from .env file
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	e := echo.New()

	// Set up CORS middleware
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowMethods: []string{http.MethodGet, http.MethodPost},
		AllowHeaders: []string{"Content-Type", "Authorization"},
	}))

	// Define routes
	e.POST("/generate-challenge", handlers.GenerateChallenge, verifyToken)

	// Start server
	e.Logger.Fatal(e.Start(":8080"))
}

func verifyToken(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		serviceAccountKey := os.Getenv("FIREBASE_SERVICE_ACCOUNT_KEY")
		if serviceAccountKey == "" {
			return c.String(http.StatusInternalServerError, "FIREBASE_SERVICE_ACCOUNT_KEY not set")
		}

		opt := option.WithCredentialsJSON([]byte(serviceAccountKey))
		app, err := firebase.NewApp(context.Background(), nil, opt)
		if err != nil {
			return c.String(http.StatusInternalServerError, "Failed to initialize Firebase app")
		}

		client, err := app.Auth(context.Background())
		if err != nil {
			return c.String(http.StatusInternalServerError, "Failed to create Firebase Auth client")
		}

		idToken := c.Request().Header.Get("Authorization")
		if idToken == "" {
			return c.String(http.StatusUnauthorized, "Authorization header missing")
		}

		token, err := client.VerifyIDToken(context.Background(), idToken)
		if err != nil {
			return c.String(http.StatusUnauthorized, "Invalid token")
		}

		c.Set("user", token)
		return next(c)
	}
}
