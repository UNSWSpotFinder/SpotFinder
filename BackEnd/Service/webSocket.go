package Service

import (
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"net/http"
)

var upgrade = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // 不做跨域检查
	},
}

func WebSocketsHandler(c *gin.Context) {
	ws, err := upgrade.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.String(http.StatusBadRequest, "Failed to set websocket upgrade: %+v", err)
		return
	}

	defer func(ws *websocket.Conn) {
		err := ws.Close()
		if err != nil {
			return
		}
	}(ws)

	for {
		// 读取消息
		_, msg, err := ws.ReadMessage()
		if err != nil {
			break
		}
		// 回复消息
		if err := ws.WriteMessage(websocket.TextMessage, msg); err != nil {
			break
		}
	}
}
