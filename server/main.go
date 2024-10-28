package main

import (
	"log"
	"net/http"
	"runtime"
	"time"

	"convo/handlers"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"convo/middlewareFx"
)

func logMemoryUsage() {
	var m runtime.MemStats
	runtime.ReadMemStats(&m)
	log.Printf("Alloc = %v MiB", bToMb(m.Alloc))
	log.Printf("TotalAlloc = %v MiB", bToMb(m.TotalAlloc))
	log.Printf("Sys = %v MiB", bToMb(m.Sys))
	log.Printf("NumGC = %v\n", m.NumGC)
}

func bToMb(b uint64) float64 {
	return float64(b) / 1024 / 1024
}

func main() {
	e := echo.New()

	// Set up CORS middleware
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000", "https://convo-rqpn.onrender.com"},
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

	// Start a goroutine to log memory usage every 10 seconds
	go func() {
		for {
			logMemoryUsage()
			time.Sleep(10 * time.Second) // Adjust the interval as needed
		}
	}()

	// Start server on the port specified by the PORT environment variable
	e.Start("0.0.0.0:8080")
}
