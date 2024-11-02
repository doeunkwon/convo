package handlers

import (
	"convo/db"
	"net/http"

	"convo/db/models"

	"github.com/labstack/echo/v4"
)

func SaveChallenge(c echo.Context, sqlManager *db.SQLManager) error {
	var challenge models.Challenge
	if err := c.Bind(&challenge); err != nil {
		return c.String(http.StatusBadRequest, "Invalid request")
	}

	query := `INSERT INTO challenge (userID, title, task, tip, dateCreated) VALUES (?, ?, ?, ?, ?)`
	_, err := sqlManager.DB.Exec(query, challenge.UserID, challenge.Title, challenge.Task, challenge.Tip, challenge.DateCreated)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Failed to save challenge")
	}

	return c.String(http.StatusOK, "Challenge saved successfully")
}

func GetChallenge(c echo.Context, sqlManager *db.SQLManager) error {
	userID := c.QueryParam("userID")
	if userID == "" {
		return c.String(http.StatusBadRequest, "User ID is required")
	}

	var challenge models.Challenge
	query := `SELECT userID, title, task, tip, dateCreated FROM challenge WHERE userID = ?`
	err := sqlManager.DB.QueryRow(query, userID).Scan(&challenge.UserID, &challenge.Title, &challenge.Task, &challenge.Tip, &challenge.DateCreated)
	if err != nil {
		return c.String(http.StatusNotFound, "Challenge not found")
	}

	return c.JSON(http.StatusOK, challenge)
}

func DeleteChallenge(c echo.Context, sqlManager *db.SQLManager) error {
	userID := c.QueryParam("userID")
	if userID == "" {
		return c.String(http.StatusBadRequest, "User ID is required")
	}

	query := `DELETE FROM challenge WHERE userID = ?`
	_, err := sqlManager.DB.Exec(query, userID)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Failed to delete challenge")
	}

	return c.String(http.StatusOK, "Challenge deleted successfully")
}
