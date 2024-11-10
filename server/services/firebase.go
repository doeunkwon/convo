package services

import (
	"context"
	"log"
	"net/http"

	"os"

	firebase "firebase.google.com/go"
	"github.com/labstack/echo/v4"
	"google.golang.org/api/option"
)

// InitializeFirebase initializes the Firebase app and returns it
func InitializeFirebase() (*firebase.App, error) {
	serviceAccountKey := os.Getenv("FIREBASE_SERVICE_ACCOUNT_KEY")
	if serviceAccountKey == "" {
		log.Fatal("FIREBASE_SERVICE_ACCOUNT_KEY not set")
	}

	opt := option.WithCredentialsJSON([]byte(serviceAccountKey))
	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		return nil, err
	}

	return app, nil
}

// VerifyToken is a middleware function that verifies Firebase ID tokens
func VerifyToken(app *firebase.App) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
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
}

// GetEmailsForUserIDs fetches emails for a list of user IDs
func GetEmailsForUserIDs(app *firebase.App, userIDs []string) ([]string, error) {
	ctx := context.Background()
	client, err := app.Auth(ctx)
	if err != nil {
		log.Fatalf("error getting Auth client: %v\n", err)
	}

	var emails []string
	for _, userID := range userIDs {
		userRecord, err := client.GetUser(ctx, userID)
		if err != nil {
			log.Printf("error getting user %s: %v\n", userID, err)
			continue
		}
		emails = append(emails, userRecord.Email)
	}
	return emails, nil
}
