package handlers

import (
	"convo/db"
	"net/http"

	"convo/db/models"

	"github.com/labstack/echo/v4"
)

func SavePreference(c echo.Context) error {
	var preference models.Preference
	if err := c.Bind(&preference); err != nil {
		return c.String(http.StatusBadRequest, "Invalid request")
	}

	db := db.InitDB("./db/database.db")
	defer db.Close()

	query := `INSERT INTO preference (userID, level) VALUES (?, ?)`
	_, err := db.Exec(query, preference.UserID, preference.Level)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Failed to save preference")
	}

	return c.String(http.StatusOK, "Preference saved successfully")
}

func UpdatePreference(c echo.Context) error {
	userID := c.QueryParam("userID")
	if userID == "" {
		return c.String(http.StatusBadRequest, "User ID is required")
	}

	var preference models.Preference
	if err := c.Bind(&preference); err != nil {
		return c.String(http.StatusBadRequest, "Invalid request")
	}

	db := db.InitDB("./db/database.db")
	defer db.Close()

	query := `UPDATE preference SET level = ? WHERE userID = ?`
	_, err := db.Exec(query, preference.Level, userID)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Failed to update preference")
	}

	return c.String(http.StatusOK, "Preference updated successfully")
}

func GetPreference(c echo.Context) error {
	userID := c.QueryParam("userID")
	if userID == "" {
		return c.String(http.StatusBadRequest, "User ID is required")
	}

	db := db.InitDB("./db/database.db")
	defer db.Close()

	var preference models.Preference
	query := `SELECT userID, level FROM preference WHERE userID = ?`
	err := db.QueryRow(query, userID).Scan(&preference.UserID, &preference.Level)
	if err != nil {
		return c.String(http.StatusNotFound, "Preference not found")
	}

	return c.JSON(http.StatusOK, preference)
}

func DeletePreference(c echo.Context) error {
	userID := c.QueryParam("userID")
	if userID == "" {
		return c.String(http.StatusBadRequest, "User ID is required")
	}

	db := db.InitDB("./db/database.db")
	defer db.Close()

	query := `DELETE FROM preference WHERE userID = ?`
	_, err := db.Exec(query, userID)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Failed to delete preference")
	}

	return c.String(http.StatusOK, "Preference deleted successfully")
}
