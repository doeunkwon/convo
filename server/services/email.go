package services

import (
	"convo/db"
	"log"
	"os"

	firebase "firebase.google.com/go"
	"github.com/robfig/cron/v3"
	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

// SendEmails sends emails to the provided list of email addresses
func SendEmails(emails []string) error {
	from := mail.NewEmail("Convo", "convosocialai@gmail.com")
	subject := "💡 Your Daily Social Challenge Awaits."
	plainTextContent := "Hey! Check out today's challenge at https://tryconvo.today/daily. Join our <a href=\"https://www.reddit.com/r/ConvoApp/\">Subreddit</a> to discuss your progress with other Convo users. If you ever want a break from these reminders, just head over to https://tryconvo.today/settings. Happy socializing!"
	htmlContent := "Hey! Check out today's challenge at our <a href=\"https://tryconvo.today/daily\">daily page</a>.<br><br>Join our <a href=\"https://www.reddit.com/r/ConvoApp/\">Subreddit</a> to discuss your progress with other Convo users.<br><br>If you ever want a break from these reminders, just head over to <a href=\"https://tryconvo.today/settings\">settings</a>.<br><br>Happy socializing!"

	for _, email := range emails {
		to := mail.NewEmail(email, email)
		message := mail.NewSingleEmail(from, subject, to, plainTextContent, htmlContent)
		client := sendgrid.NewSendClient(os.Getenv("SENDGRID_API_KEY"))
		response, err := client.Send(message)
		if err != nil {
			return err
		}

		// Log the response status and email address
		log.Printf("Email sent to %s with status code %d", email, response.StatusCode)
	}
	return nil
}

// StartEmailScheduler sets up a cron job to send emails at 7 AM PST every day
func StartEmailScheduler(sqlManager *db.SQLManager, app *firebase.App) {
	c := cron.New()
	c.AddFunc("0 13 * * *", func() {
		// Fetch user IDs with notifications enabled
		userIDs, err := GetUserIDsWithNotificationsEnabled(sqlManager)
		if err != nil {
			log.Println("Error fetching user IDs:", err)
			return
		}

		// Fetch emails for these user IDs
		emails, err := GetEmailsForUserIDs(app, userIDs)
		if err != nil {
			log.Println("Error fetching emails:", err)
			return
		}

		// Send emails
		err = SendEmails(emails)
		if err != nil {
			log.Println("Error sending emails:", err)
		}
	})
	c.Start()
}

// GetUserIDsWithNotificationsEnabled fetches user IDs from the database where notifications are enabled
func GetUserIDsWithNotificationsEnabled(sqlManager *db.SQLManager) ([]string, error) {
	var userIDs []string
	query := `SELECT userID FROM preference WHERE notifications = 1`
	rows, err := sqlManager.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var userID string
		if err := rows.Scan(&userID); err != nil {
			return nil, err
		}
		userIDs = append(userIDs, userID)
	}
	return userIDs, nil
}
