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
		//fmt.Println("Sending message:", msg)
		msgJson, err := json.Marshal(msg)
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
