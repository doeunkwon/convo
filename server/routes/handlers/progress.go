package handlers

import (
	"convo/db"
	"encoding/json"
	"net/http"

	"convo/db/models"

	"github.com/labstack/echo/v4"
)

func SaveProgress(c echo.Context, sqlManager *db.SQLManager) error {
	var progress models.Progress
	if err := c.Bind(&progress); err != nil {
		return c.String(http.StatusBadRequest, "Invalid request")
	}

	// Serialize the History field to JSON
	historyJSON, err := json.Marshal(progress.History)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Failed to serialize history")
	}

	query := `INSERT INTO progress (userID, currentStreak, longestStreak, history, dateUpdated) VALUES (?, ?, ?, ?, ?)`
	_, err = sqlManager.DB.Exec(query, progress.UserID, progress.CurrentStreak, progress.LongestStreak, string(historyJSON), progress.DateUpdated)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Failed to save progress")
	}

	return c.String(http.StatusOK, "Progress saved successfully")
}

func UpdateProgress(c echo.Context, sqlManager *db.SQLManager) error {
	userID := c.QueryParam("userID")
	if userID == "" {
		return c.String(http.StatusBadRequest, "User ID is required")
	}

	var progress models.Progress
	if err := c.Bind(&progress); err != nil {
		return c.String(http.StatusBadRequest, "Invalid request")
	}

	// Serialize the History field to JSON
	historyJSON, err := json.Marshal(progress.History)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Failed to serialize history")
	}

	query := `UPDATE progress SET currentStreak = ?, longestStreak = ?, history = ?, dateUpdated = ? WHERE userID = ?`
	_, err = sqlManager.DB.Exec(query, progress.CurrentStreak, progress.LongestStreak, string(historyJSON), progress.DateUpdated, userID)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Failed to update progress")
	}

	return c.String(http.StatusOK, "Progress updated successfully")
}

func GetProgress(c echo.Context, sqlManager *db.SQLManager) error {
	userID := c.QueryParam("userID")
	if userID == "" {
		return c.String(http.StatusBadRequest, "User ID is required")
	}

	var progress models.Progress
	var historyJSON string
	query := `SELECT userID, currentStreak, longestStreak, history, dateUpdated FROM progress WHERE userID = ?`
	err := sqlManager.DB.QueryRow(query, userID).Scan(&progress.UserID, &progress.CurrentStreak, &progress.LongestStreak, &historyJSON, &progress.DateUpdated)
	if err != nil {
		return c.String(http.StatusNotFound, "Progress not found")
	}

	// Deserialize the History field from JSON
	if err := json.Unmarshal([]byte(historyJSON), &progress.History); err != nil {
		return c.String(http.StatusInternalServerError, "Failed to deserialize history")
	}

	return c.JSON(http.StatusOK, progress)
}

func DeleteProgress(c echo.Context, sqlManager *db.SQLManager) error {
	userID := c.QueryParam("userID")
	if userID == "" {
		return c.String(http.StatusBadRequest, "User ID is required")
	}

	query := `DELETE FROM progress WHERE userID = ?`
	_, err := sqlManager.DB.Exec(query, userID)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Failed to delete progress")
	}

	return c.String(http.StatusOK, "Progress deleted successfully")
}
