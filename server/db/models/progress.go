package models

type Progress struct {
	UserID        string    `json:"userID"`
	CurrentStreak int       `json:"currentStreak"`
	LongestStreak int       `json:"longestStreak"`
	History       [182]bool `json:"history"` // Vert important to remember 182 is just week (26) * days (7). So if these values change on the frontend, remember to update it here.
	DateUpdated   string    `json:"dateUpdated"`
}
