package main

import (
	"log"
	"os"

	"convo/services"

	// "github.com/joho/godotenv"
	"github.com/labstack/echo/v4"

	"convo/db"
	"convo/routes"
)

func main() {
	// Load environment variables
	// if err := godotenv.Load(); err != nil {
	// 	log.Fatal("Error loading .env file")
	// }

	e := echo.New()
	e.Debug = true

	// Initialize SQLite database
	sqliteDB, err := db.NewSQLiteDB(os.Getenv("DB_PATH"))
	if err != nil {
		e.Logger.Fatal("Failed to initialize SQLite database: ", err)
	}

	// Create SQLManager
	sqlManager := db.NewSQLManager(sqliteDB)

	// Initialize Firebase using the service
	app, err := services.InitializeFirebase()
	if err != nil {
		log.Fatalf("Failed to initialize Firebase app: %v", err)
	}

	// Register routes with Firebase app
	routes.RegisterRoutes(e, sqlManager, app)

	// Start the email scheduler
	services.StartEmailScheduler(sqlManager, app)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	e.Logger.Fatal(e.Start("0.0.0.0:" + port))
}
