package handlers

import (
	"convo/db"
	"net/http"

	"convo/db/models"

	"github.com/labstack/echo/v4"
)

func SavePreference(c echo.Context, sqlManager *db.SQLManager) error {
	var preference models.Preference
	if err := c.Bind(&preference); err != nil {
		return c.String(http.StatusBadRequest, "Invalid request")
	}

	query := `INSERT INTO preference (userID, level) VALUES (?, ?)`
	_, err := sqlManager.DB.Exec(query, preference.UserID, preference.Level)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Failed to save preference")
	}

	return c.String(http.StatusOK, "Preference saved successfully")
}

func UpdatePreference(c echo.Context, sqlManager *db.SQLManager) error {
	userID := c.QueryParam("userID")
	if userID == "" {
		return c.String(http.StatusBadRequest, "User ID is required")
	}

	var preference models.Preference
	if err := c.Bind(&preference); err != nil {
		return c.String(http.StatusBadRequest, "Invalid request")
	}

	query := `UPDATE preference SET level = ? WHERE userID = ?`
	_, err := sqlManager.DB.Exec(query, preference.Level, userID)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Failed to update preference")
	}

	return c.String(http.StatusOK, "Preference updated successfully")
}

func GetPreference(c echo.Context, sqlManager *db.SQLManager) error {
	userID := c.QueryParam("userID")
	if userID == "" {
		return c.String(http.StatusBadRequest, "User ID is required")
	}

	var preference models.Preference
	query := `SELECT userID, level FROM preference WHERE userID = ?`
	err := sqlManager.DB.QueryRow(query, userID).Scan(&preference.UserID, &preference.Level)
	if err != nil {
		return c.String(http.StatusNotFound, "Preference not found")
	}

	return c.JSON(http.StatusOK, preference)
}

func DeletePreference(c echo.Context, sqlManager *db.SQLManager) error {
	userID := c.QueryParam("userID")
	if userID == "" {
		return c.String(http.StatusBadRequest, "User ID is required")
	}

	query := `DELETE FROM preference WHERE userID = ?`
	_, err := sqlManager.DB.Exec(query, userID)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Failed to delete preference")
	}

	return c.String(http.StatusOK, "Preference deleted successfully")
}
