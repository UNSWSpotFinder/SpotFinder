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

	userId, err := strconv.ParseUint(claims["userID"].(string), 10, 64)
	if err != nil {
		SendErrorMessage(conn, "Invalid user ID in token")
		fmt.Println("Invalid user ID in token:", err)
		return
	}

	clientConnections[uint(userId)] = conn
	defer delete(clientConnections, uint(userId))
	SendRecentMessages(conn, uint(userId))
	//sendPendingMessages(conn, uint(userId))

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			SendErrorMessage(conn, "Error during message reading")
			fmt.Println("Error during message reading:", err)
			break
		}

		conn.SetCloseHandler(func(code int, text string) error {
			fmt.Printf("Connection closed with code %d: %s\n", code, text)
			delete(clientConnections, uint(userId))
			return nil
		})

		var msg WSMessage
		err = json.Unmarshal(message, &msg)
		if err != nil {
			SendErrorMessage(conn, "Error during message unmarshalling")
			fmt.Println("Error during message unmarshalling:", err)
			continue
		}

		fmt.Println(userId, msg.ReceiverID, msg.Content)
		// 创建数据库消息实例
		dbMessage := Models.Message{
			SenderID:   uint(userId),
			ReceiverID: msg.ReceiverID,
			Content:    msg.Content,
			SentAt:     time.Now(),
		}

		// 存储到数据库
		result := Service.DB.Create(&dbMessage) // 确保Models.DB已经正确配置和初始化
		if result.Error != nil {
			SendErrorMessage(conn, "Failed to save message")
			fmt.Printf("Failed to save message: %v", result.Error)
			continue
		}

		fmt.Printf("Received message from %d to %d: %s", userId, msg.ReceiverID, msg.Content)
		// 尝试找到接收者的连接
		receiverConn, found := clientConnections[msg.ReceiverID]
		if found {
			message, err := json.Marshal(dbMessage)
			if err != nil {
				SendErrorMessage(conn, "Error marshalling message")
				fmt.Printf("Error marshalling message: %v\n", err)
				continue
			}
			// 发送消息给接收端
			if err := receiverConn.WriteMessage(websocket.TextMessage, message); err != nil {
				SendErrorMessage(conn, "Error sending message to receiver")
				fmt.Printf("Error sending message to receiver: %v\n", err)
			} else {
				SendErrorMessage(conn, "Message sent unsuccessfully")
			}
		} else {
			Service.DB.Model(&dbMessage).Update("delivered", true)
			SendErrorMessage(conn, "Receiver not found")
			fmt.Printf("Receiver %d not found\n", msg.ReceiverID)
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

func sendPendingMessages(conn *websocket.Conn, userID uint) {
	var messages []Models.Message
	// 查询未送达的消息
	result := Service.DB.Where("receiver_id = ? AND delivered = false", userID).Find(&messages)
	if result.Error != nil {
		fmt.Printf("Failed to retrieve pending messages: %v\n", result.Error)
		return
	}

	for _, msg := range messages {
		msgJson, err := json.Marshal(msg)
		if err != nil {
			fmt.Printf("Error marshalling message: %v\n", err)
			continue
		}
		if err := conn.WriteMessage(websocket.TextMessage, msgJson); err != nil {
			fmt.Printf("Failed to send pending message: %v\n", err)
			continue
		}
		// 更新消息为已送达
		Service.DB.Model(&msg).Update("Delivered", true)
	}
}
