package main

import (
	"convo/handlers"
	"log"
	"net/http"
	"os"

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
		AllowOrigins: []string{"http://localhost:3000", os.Getenv("IP_ADDRESS")},
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

	// Start server
	e.Logger.Fatal(e.Start(":8080"))
}
