package db

import (
	"database/sql"
)

// SQLDB interface for SQL database operations
type SQLDB interface {
	Exec(query string, args ...interface{}) (sql.Result, error)
	Query(query string, args ...interface{}) (*sql.Rows, error)
	QueryRow(query string, args ...interface{}) *sql.Row
}

// SQLManager struct that uses the SQLDB interface
type SQLManager struct {
	DB SQLDB
}

// NewSQLManager creates a new SQLManager with the given SQLDB
func NewSQLManager(db SQLDB) *SQLManager {
	return &SQLManager{DB: db}
}
