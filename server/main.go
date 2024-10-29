package main

import (
	"log"
	"net/http"
	"os"

	"convo/handlers"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"convo/middlewareFx"
)

func main() {

	// Load environment variables from .env file
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	e := echo.New()

	// Set up CORS middleware
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodDelete, http.MethodPut},
		AllowHeaders: []string{"Content-Type", "Authorization"},
	}))

	// Define routes
	e.POST("/generate-challenge", handlers.GenerateChallenge, middlewareFx.VerifyToken)
	e.POST("/save-challenge", handlers.SaveChallenge, middlewareFx.VerifyToken)
	e.GET("/get-challenge", handlers.GetChallenge, middlewareFx.VerifyToken)
	e.DELETE("/delete-challenge", handlers.DeleteChallenge, middlewareFx.VerifyToken)

	e.POST("/save-progress", handlers.SaveProgress, middlewareFx.VerifyToken)
	e.GET("/get-progress", handlers.GetProgress, middlewareFx.VerifyToken)
	e.DELETE("/delete-progress", handlers.DeleteProgress, middlewareFx.VerifyToken)
	e.PUT("/update-progress", handlers.UpdateProgress, middlewareFx.VerifyToken)

	e.POST("/save-preference", handlers.SavePreference, middlewareFx.VerifyToken)
	e.GET("/get-preference", handlers.GetPreference, middlewareFx.VerifyToken)
	e.DELETE("/delete-preference", handlers.DeletePreference, middlewareFx.VerifyToken)
	e.PUT("/update-preference", handlers.UpdatePreference, middlewareFx.VerifyToken)

	e.GET("/download-db", func(c echo.Context) error {

		secretKey := os.Getenv("DOWNLOAD_DB_KEY")
		if secretKey == "" {
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Secret key not set on server"})
		}

		requestKey := c.Request().Header.Get("x-api-key")
		if requestKey != secretKey {
			return c.JSON(http.StatusUnauthorized, echo.Map{"error": "Unauthorized"})
		}

		filePath := "./db/database.db"
		if _, err := os.Stat(filePath); os.IsNotExist(err) {
			return c.JSON(http.StatusNotFound, echo.Map{"error": "File not found"})
		}

		return c.Attachment(filePath, "convoprod.db")
	})

	e.GET("/ping", func(c echo.Context) error {
		return c.JSON(http.StatusOK, echo.Map{"message": "pong"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	e.Logger.Fatal(e.Start("0.0.0.0:" + port))
}
