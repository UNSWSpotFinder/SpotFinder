package Message

import (
	"capstone-project-9900h14atiktokk/Models"
	"capstone-project-9900h14atiktokk/Service"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/websocket"
	"github.com/spf13/viper"
	"net/http"
	"strconv"
	"time"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	// 注意：这里的CheckOrigin函数要根据你的安全需求来修改，下面的设置是允许所有CORS请求
	CheckOrigin: func(r *http.Request) bool { return true },
}

type AuthMessage struct {
	Type  string `json:"type"`  // Type of the message, e.g., "authenticate"
	Token string `json:"token"` // The JWT token
}

type WSMessage struct {
	Type       string `json:"type"` // "message" 或 "notification"
	ReceiverID uint   `json:"receiverId"`
	Content    string `json:"content"`
}

var clientConnections = make(map[uint]*websocket.Conn)

// WebsocketHandler handles WebSocket requests.
// @Summary WebSocket communication endpoint
// @Description Upgrades the HTTP connection to a WebSocket connection to handle real-time communication.
// @Tags websocket
// @Accept  json
// @Produce json
// @Param WSMessage body WSMessage true "WebSocket message"
// @Router /ws [get]
// @Success 101 {string} string "Upgraded to WebSocket protocol."
// @Failure 400 {string} string "Bad request, cannot upgrade to WebSocket."
// @Failure 500 {string} string "Internal server error."
// @Security BearerAuth
func WebsocketHandler(c *gin.Context) {

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		fmt.Printf("Failed to set websocket upgrade: %+v", err)
		return
	}

	defer func(conn *websocket.Conn) {
		err := conn.Close()
		if err != nil {
			fmt.Printf("Failed to close connection: %+v", err)
		}
	}(conn)

	// Read the first message which must be the authentication message
	_, message, err := conn.ReadMessage()
	if err != nil {
		fmt.Println("Failed to read the first message for authentication:", err)
		return
	}

	var authMsg AuthMessage
	err = json.Unmarshal(message, &authMsg)
	if err != nil || authMsg.Type != "authenticate" {
		SendErrorMessage(conn, "Invalid authentication message")
		fmt.Println("Failed to unmarshal authentication message or wrong message type:", err)
		return
	}

	// Validate the token
	claims, err := ValidateToken(authMsg.Token, viper.GetString("secrete.key"))
	if err != nil {
		SendErrorMessage(conn, fmt.Sprintf("Authentication failed: %v", err))
		return
	}

	//role := claims["role"].(string)
	//if role != "manager" {
	//	SendErrorMessage(conn, "You are not allowed to access this service")
	//	return
	//}

	userId, err := strconv.ParseUint(claims["userID"].(string), 10, 64)
	if err != nil {
		SendErrorMessage(conn, "Invalid user ID in token")
		fmt.Println("Invalid user ID in token:", err)
		return
	}

	clientConnections[uint(userId)] = conn
	defer delete(clientConnections, uint(userId))
	SendRecentMessages(conn, uint(userId))
	SendRecentNotifications(conn, uint(userId))

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			SendErrorMessage(conn, "Error during message reading")
			fmt.Println("Error during message reading:", err)
			break
		}

		var msg WSMessage
		err = json.Unmarshal(message, &msg)
		if err != nil {
			SendErrorMessage(conn, "Error during message unmarshalling")
			fmt.Println("Error during message unmarshalling:", err)
			continue
		}

		switch msg.Type {
		case "message":
			// 处理发送消息逻辑
			handleMessage(conn, uint(userId), msg)
		case "notification":
			// 处理发送通知逻辑
			if err := SendNotification(msg.ReceiverID, msg.Content); err != nil {
				SendErrorMessage(conn, "Failed to send notification")
				fmt.Printf("Failed to send notification: %v\n", err)
			}
		default:
			SendErrorMessage(conn, "Invalid message type")
			fmt.Println("Received invalid message type")
		}
	}
}

// ValidateToken parses and validates a JWT token and returns the user ID if the token is valid.
func ValidateToken(tokenString, secretKey string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(secretKey), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, fmt.Errorf("invalid token")
}

func SendErrorMessage(conn *websocket.Conn, errorMsg string) {
	errMsg := map[string]string{
		"error": errorMsg,
	}
	errJson, _ := json.Marshal(errMsg)
	err := conn.WriteMessage(websocket.TextMessage, errJson)
	if err != nil {
		return
	}
}

// handleMessage Processes a message received from a WebSocket connection user to user.
func handleMessage(conn *websocket.Conn, senderID uint, msg WSMessage) {
	fmt.Println(senderID, msg.ReceiverID, msg.Content)
	// 创建数据库消息实例
	dbMessage := Models.Message{
		SenderID:   senderID,
		ReceiverID: msg.ReceiverID,
		Content:    msg.Content,
		SentAt:     time.Now(),
	}

	// 存储到数据库
	result := Service.DB.Preload("Receiver").Create(&dbMessage)
	if result.Error != nil {
		SendErrorMessage(conn, "Failed to save message")
		fmt.Printf("Failed to save message: %v", result.Error)
		return
	}

	dbMessage.Receiver.Password = ""

	dataToSend := map[string]interface{}{
		"type":    "message",
		"content": dbMessage,
	}

	// 尝试找到接收者的连接，如果在线，则发送消息
	receiverConn, found := clientConnections[msg.ReceiverID]
	if found {
		message, err := json.Marshal(dataToSend)
		if err != nil {
			SendErrorMessage(conn, "Error marshalling message")
			fmt.Printf("Error marshalling message: %v\n", err)
			return
		}
		// 发送消息给接收端
		if err := receiverConn.WriteMessage(websocket.TextMessage, message); err != nil {
			SendErrorMessage(conn, "Error sending message to receiver")
			fmt.Printf("Error sending message to receiver: %v\n", err)
		}
	} else {
		Service.DB.Model(&dbMessage).Update("Delivered", true)
		SendErrorMessage(conn, "Receiver not found")
		fmt.Printf("Receiver %d not found\n", msg.ReceiverID)
	}
}
