package main

import (
	"convo/handlers"
	"log"
	"net/http"

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
		AllowOrigins: []string{"http://localhost:3000"},
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodDelete},
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

	// Start server
	e.Logger.Fatal(e.Start(":8080"))
}
