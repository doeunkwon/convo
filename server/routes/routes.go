package routes

import (
	"net/http"

	"convo/db"
	"convo/routes/filters"
	"convo/routes/handlers"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func RegisterRoutes(e *echo.Echo, sqlManager *db.SQLManager) {
	// Set up CORS middleware
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodDelete, http.MethodPut},
		AllowHeaders: []string{"Content-Type", "Authorization"},
	}))

	// Define routes with the database instance
	e.POST("/generate-challenge", func(c echo.Context) error {
		return handlers.GenerateChallenge(c, sqlManager)
	}, filters.VerifyToken)
	e.POST("/save-challenge", func(c echo.Context) error {
		return handlers.SaveChallenge(c, sqlManager)
	}, filters.VerifyToken)
	e.GET("/get-challenge", func(c echo.Context) error {
		return handlers.GetChallenge(c, sqlManager)
	}, filters.VerifyToken)
	e.DELETE("/delete-challenge", func(c echo.Context) error {
		return handlers.DeleteChallenge(c, sqlManager)
	}, filters.VerifyToken)

	e.POST("/save-progress", func(c echo.Context) error {
		return handlers.SaveProgress(c, sqlManager)
	}, filters.VerifyToken)
	e.GET("/get-progress", func(c echo.Context) error {
		return handlers.GetProgress(c, sqlManager)
	}, filters.VerifyToken)
	e.DELETE("/delete-progress", func(c echo.Context) error {
		return handlers.DeleteProgress(c, sqlManager)
	}, filters.VerifyToken)
	e.PUT("/update-progress", func(c echo.Context) error {
		return handlers.UpdateProgress(c, sqlManager)
	}, filters.VerifyToken)

	e.POST("/save-preference", func(c echo.Context) error {
		return handlers.SavePreference(c, sqlManager)
	}, filters.VerifyToken)
	e.GET("/get-preference", func(c echo.Context) error {
		return handlers.GetPreference(c, sqlManager)
	}, filters.VerifyToken)
	e.DELETE("/delete-preference", func(c echo.Context) error {
		return handlers.DeletePreference(c, sqlManager)
	}, filters.VerifyToken)
	e.PUT("/update-preference", func(c echo.Context) error {
		return handlers.UpdatePreference(c, sqlManager)
	}, filters.VerifyToken)

	// e.GET("/download-db", func(c echo.Context) error {
	// 	secretKey := os.Getenv("DOWNLOAD_DB_KEY")
	// 	if secretKey == "" {
	// 		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Secret key not set on server"})
	// 	}

	// 	requestKey := c.Request().Header.Get("x-api-key")
	// 	if requestKey != secretKey {
	// 		return c.JSON(http.StatusUnauthorized, echo.Map{"error": "Unauthorized"})
	// 	}

	// 	filePath := os.Getenv("DB_PATH")
	// 	if _, err := os.Stat(filePath); os.IsNotExist(err) {
	// 		return c.JSON(http.StatusNotFound, echo.Map{"error": "File not found"})
	// 	}

	// 	return c.Attachment(filePath, "convoprod.db")
	// })

	// e.GET("/ping", func(c echo.Context) error {
	// 	return c.JSON(http.StatusOK, echo.Map{"message": "pong"})
	// })
}
