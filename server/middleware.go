package main

import (
	"context"
	"net/http"
	"os"

	firebase "firebase.google.com/go"
	"github.com/labstack/echo/v4"
	"google.golang.org/api/option"
)

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
