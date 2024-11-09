package handlers

import (
	"convo/db"
	"net/http"

	"convo/db/models"

	"github.com/labstack/echo/v4"
)

func GetCentralChallenge(c echo.Context, sqlManager *db.SQLManager) error {
	level := c.QueryParam("level")
	dateCreated := c.QueryParam("dateCreated")
	if level == "" || dateCreated == "" {
		return c.String(http.StatusBadRequest, "Level and dateCreated are required")
	}

	var challenge models.Challenge
	query := `SELECT title, task, tip, dateCreated, level FROM central_challenge WHERE level = ? AND dateCreated = ?`
	err := sqlManager.DB.QueryRow(query, level, dateCreated).Scan(&challenge.Title, &challenge.Task, &challenge.Tip, &challenge.DateCreated, &challenge.Level)
	if err != nil {
		return c.String(http.StatusNotFound, "Challenge not found")
	}

	return c.JSON(http.StatusOK, challenge)
}
