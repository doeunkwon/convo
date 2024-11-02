package main

import (
	"log"

	"os"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"

	"convo/db"
	"convo/routes"
)

func main() {

	// Load environment variables from .env file
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	e := echo.New()

	// Initialize the database
	sqliteDB, err := db.NewSQLiteDB("./db/database.db")
	if err != nil {
		e.Logger.Fatal("Failed to initialize SQLite database: ", err)
	}
	sqlManager := db.NewSQLManager(sqliteDB)

	// Register routes
	routes.RegisterRoutes(e, sqlManager)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	e.Logger.Fatal(e.Start("0.0.0.0:" + port))

}
