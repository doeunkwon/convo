package handlers

import (
	"convo/db"
	"net/http"

	"github.com/labstack/echo/v4"
)

type Progress struct {
	UserID        string `json:"userID"`
	CurrentStreak int    `json:"currentStreak"`
	LongestStreak int    `json:"longestStreak"`
	History       []bool `json:"history"`
}

func SaveProgress(c echo.Context) error {
	var progress Progress
	if err := c.Bind(&progress); err != nil {
		return c.String(http.StatusBadRequest, "Invalid request")
	}

	db := db.InitDB("./db/database.db")
	defer db.Close()

	query := `INSERT INTO progress (userID, currentStreak, longestStreak, history) VALUES (?, ?, ?, ?)`
	_, err := db.Exec(query, progress.UserID, progress.CurrentStreak, progress.LongestStreak, progress.History)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Failed to save progress")
	}

	return c.String(http.StatusOK, "Progress saved successfully")
}

func GetProgress(c echo.Context) error {
	userID := c.QueryParam("userID")
	if userID == "" {
		return c.String(http.StatusBadRequest, "User ID is required")
	}

	db := db.InitDB("./db/database.db")
	defer db.Close()

	var progress Progress
	query := `SELECT userID, currentStreak, longestStreak, history FROM progress WHERE userID = ?`
	err := db.QueryRow(query, userID).Scan(&progress.UserID, &progress.CurrentStreak, &progress.LongestStreak, &progress.History)
	if err != nil {
		return c.String(http.StatusNotFound, "Progress not found")
	}

	return c.JSON(http.StatusOK, progress)
}

func DeleteProgress(c echo.Context) error {
	userID := c.QueryParam("userID")
	if userID == "" {
		return c.String(http.StatusBadRequest, "User ID is required")
	}

	db := db.InitDB("./db/database.db")
	defer db.Close()

	query := `DELETE FROM progress WHERE userID = ?`
	_, err := db.Exec(query, userID)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Failed to delete progress")
	}

	return c.String(http.StatusOK, "Progress deleted successfully")
}
