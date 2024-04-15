package Message

import (
	"capstone-project-9900h14atiktokk/Models"
	"capstone-project-9900h14atiktokk/Service"
	"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
)

// SendRecentMessages 在用户连接WebSocket时发送历史消息
func SendRecentMessages(conn *websocket.Conn, userID uint) {
	var messages []Models.Message
	result := Service.DB.Preload("Sender").Preload("Receiver").
		Where("receiver_id = ?", userID).
		Or("sender_id = ?", userID).
		Order("sent_at desc").Limit(50).Find(&messages)
	if result.Error != nil {
		fmt.Println("Failed to fetch recent messages:", result.Error)
		return
	}

	for _, msg := range messages {
		msgWrapper := map[string]interface{}{
			"type":    "message",
			"content": msg,
		}
		//fmt.Println("Sending message:", msg)
		msgJson, err := json.Marshal(msgWrapper)
		if err != nil {
			fmt.Println("Error marshalling message:", err)
			continue
		}
		err = conn.WriteMessage(websocket.TextMessage, msgJson)
		if err != nil {
			fmt.Println("Error sending message:", err)
			return
		}
	}
}

// SendRecentNotifications 在用户连接WebSocket时发送历史通知
func SendRecentNotifications(conn *websocket.Conn, userID uint) {
	var notifications []Models.Notification
	// 查询该用户的未读通知，可以根据实际需求调整查询条件
	result := Service.DB.Preload("Receiver").
		Where("receiver_id = ?", userID).
		Order("sent_at desc").Limit(50).Find(&notifications)

	if result.Error != nil {
		fmt.Println("Failed to fetch recent notifications:", result.Error)
		return
	}

	for _, notification := range notifications {
		notifWrapper := map[string]interface{}{
			"type":    "notification",
			"content": notification,
		}
		notifJson, err := json.Marshal(notifWrapper)
		if err != nil {
			fmt.Println("Error marshalling notification:", err)
			continue
		}
		err = conn.WriteMessage(websocket.TextMessage, notifJson)
		if err != nil {
			fmt.Println("Error sending notification:", err)
			return
		}
	}
}
