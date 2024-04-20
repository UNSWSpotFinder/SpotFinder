package Message

import (
	"capstone-project-9900h14atiktokk/Models"
	"capstone-project-9900h14atiktokk/Service"
	"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
	"time"
)

// SendNotification Send a notification to a user
func SendNotification(receiverID uint, content string) error {
	notification := Models.Notification{
		ReceiverID: receiverID,
		Content:    content,
		SentAt:     time.Now(),
	}

	// Save notification to database
	result := Service.DB.Preload("Receiver").Create(&notification)
	if result.Error != nil {
		return result.Error
	}

	notification.Receiver.Password = ""

	dataToSend := map[string]interface{}{
		"type":    "notification",
		"content": notification,
	}

	// Try to send notification to receiver
	if conn, found := clientConnections[receiverID]; found {
		notifJson, err := json.Marshal(dataToSend)
		if err != nil {
			return fmt.Errorf("error marshalling notification: %v", err)
		}
		if err := conn.WriteMessage(websocket.TextMessage, notifJson); err != nil {
			return fmt.Errorf("error sending notification to receiver: %v", err)
		}
	} else {
		// If receiver is not online, save notification for later delivery
		fmt.Printf("Receiver %d not online. Notification saved for later delivery.\n", receiverID)
	}

	return nil
}
