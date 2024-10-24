package db

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

func InitDB(filepath string) *sql.DB {
	db, err := sql.Open("sqlite3", filepath)
	if err != nil {
		log.Fatal(err)
	}

	if err := createTables(db); err != nil {
		log.Fatal(err)
	}

	return db
}

func createTables(db *sql.DB) error {
	challengeTable := `
    CREATE TABLE IF NOT EXISTS challenge (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userID TEXT NOT NULL,
        title TEXT NOT NULL,
        task TEXT NOT NULL,
        tip TEXT NOT NULL,
		dateCreated TEXT NOT NULL
    );`

	progressTable := `
    CREATE TABLE IF NOT EXISTS progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userID TEXT NOT NULL,
        currentStreak INTEGER NOT NULL,
        longestStreak INTEGER NOT NULL,
        history TEXT NOT NULL
    );`

	_, err := db.Exec(challengeTable)
	if err != nil {
		return err
	}

	_, err = db.Exec(progressTable)
	return err
}
