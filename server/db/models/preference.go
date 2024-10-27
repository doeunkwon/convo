package models

type Preference struct {
	UserID string `json:"userID"`
	Level  int    `json:"level"`
}
