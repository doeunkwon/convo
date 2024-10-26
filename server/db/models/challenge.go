package models

type Challenge struct {
	UserID      string `json:"userID"`
	Title       string `json:"title"`
	Task        string `json:"task"`
	Tip         string `json:"tip"`
	DateCreated string `json:"dateCreated"`
}
