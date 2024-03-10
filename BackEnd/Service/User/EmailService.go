package User

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
	"google.golang.org/api/gmail/v1"
	"net/http"
	"strings"
)

// Ctx 全局变量
var Ctx = context.Background()

// CodeStructData 验证验证码所需要的结构体
type CodeStructData struct {
	Email string `json:"email"`
	// Code 验证码
	Code string `json:"code"`
}

// GenerateCode 生成6位数字验证码
func GenerateCode() string {
	const (
		codeLength = 6
		charset    = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	)
	code := make([]byte, codeLength)
	charsetLength := byte(len(charset))

	randomBytes := make([]byte, codeLength)
	_, err := rand.Read(randomBytes)
	if err != nil {
		panic(err)
	}

	for i := 0; i < codeLength; i++ {
		code[i] = charset[randomBytes[i]%charsetLength]
	}

	return string(code)
}

// SendEmail 发送邮件
func SendEmail(srv *gmail.Service, to, subject, body string) error {
	fmt.Println("sendEmail")
	var message gmail.Message
	emailBody := []byte("To: " + to + "\r\n" + "Subject: " + subject + "\r\n" + "\r\n" + body)
	message.Raw = base64.URLEncoding.EncodeToString(emailBody)
	_, err := srv.Users.Messages.Send("me", &message).Do()
	if err != nil {
		fmt.Println("Error: ", err)
		return err
	}
	return nil
}

// verifyCode 验证码校验处理函数
func verifyCode(email, code string, RedisClient *redis.Client) bool {
	fmt.Println("Email:", email, "Code", code)
	theGenerateCode, err := RedisClient.Get(Ctx, email).Result()
	if err != nil {
		fmt.Printf("Error getting key: %f\n", err)
		return false
	}
	theGenerateCode = strings.ToLower(theGenerateCode)
	code = strings.ToLower(code)

	valid := code == theGenerateCode

	ttl, err := RedisClient.TTL(Ctx, email).Result()
	if err != nil {
		fmt.Printf("Error getting key ttl: %f\n", err)
		return false
	}
	if ttl <= 0 {
		valid = false
		fmt.Println("验证码已过期")
	}
	fmt.Println(valid)
	return valid
}

// VerifiedCodeHandler 验证码校验处理函数
//
//	@Summary		Verify code
//	@Description	Verify the code/
//	@Tags			User
//	@Accept			json
//	@Produce		json
//	@Param			json	body	CodeStructData true "email and code"
//	@Success		200		{object}	RequestData	"OK"
//
// @Failure 		400 	{string} 	string "code error"
// @Failure 		400 	{string} 	string "unmarshal error"
//
//	@Router			/user/create/verifyEmail [post]
func VerifiedCodeHandler(c *gin.Context, redisCli *redis.Client) {
	var codeStructData CodeStructData
	err := c.ShouldBindJSON(&codeStructData)
	if err != nil {
		c.JSON(400, "unmarshal error")
		return
	}
	valid := verifyCode(codeStructData.Email, codeStructData.Code, redisCli)
	if !valid {
		c.JSON(400, "code error")
		return
	}
	c.JSON(http.StatusOK, "login success")
}
