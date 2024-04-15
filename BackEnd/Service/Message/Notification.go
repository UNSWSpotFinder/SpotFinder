package Message

import (
	"capstone-project-9900h14atiktokk/Models"
	"capstone-project-9900h14atiktokk/Service"
	"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
	"time"
)

// SendNotification 发送通知给特定用户
func SendNotification(receiverID uint, content string) error {
	notification := Models.Notification{
		ReceiverID: receiverID,
		Content:    content,
		SentAt:     time.Now(),
	}

	// 存储通知到数据库
	result := Service.DB.Preload("Receiver").Create(&notification)
	if result.Error != nil {
		return result.Error
	}

	notification.Receiver.Password = ""

	dataToSend := map[string]interface{}{
		"type":    "notification",
		"content": notification,
	}

	// 尝试找到接收者的连接，如果在线，则发送实时通知
	if conn, found := clientConnections[receiverID]; found {
		notifJson, err := json.Marshal(dataToSend)
		if err != nil {
			return fmt.Errorf("error marshalling notification: %v", err)
		}
		if err := conn.WriteMessage(websocket.TextMessage, notifJson); err != nil {
			return fmt.Errorf("error sending notification to receiver: %v", err)
		}
	} else {
		// 如果用户不在线，通知将在他们下次连接时发送
		fmt.Printf("Receiver %d not online. Notification saved for later delivery.\n", receiverID)
	}

	return nil
}
