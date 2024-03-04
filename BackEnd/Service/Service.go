package Service

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// DB 全局数据库链接
var DB *gorm.DB

// GetIndex PingExample godoc
// @Summary ping example
// @Schemes
// @Description do ping
// @Tags example
// @Accept json
// @Produce json
// @Success 200 {string} Hello world
// @Router /index [get]
func GetIndex(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "pong",
	})
}
