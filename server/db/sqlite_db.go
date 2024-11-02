package db

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

// SQLiteDB struct implementing the Database interface
type SQLiteDB struct {
	*sql.DB
}

// NewSQLiteDB initializes a new SQLiteDB
func NewSQLiteDB(filepath string) (*SQLiteDB, error) {
	db, err := sql.Open("sqlite3", filepath)
	if err != nil {
		return nil, err
	}

	if err := createTables(db); err != nil {
		log.Fatal(err)
	}

	return &SQLiteDB{db}, nil
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
        history TEXT NOT NULL,
		dateUpdated TEXT NOT NULL
    );`

	preferenceTable := `
    CREATE TABLE IF NOT EXISTS preference (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userID TEXT NOT NULL,
        level INTEGER NOT NULL
    );`

	_, err := db.Exec(challengeTable)
	if err != nil {
		return err
	}

	_, err = db.Exec(progressTable)
	if err != nil {
		return err
	}

	_, err = db.Exec(preferenceTable)
	return err
}
