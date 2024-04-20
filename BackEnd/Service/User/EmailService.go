package User

import (
	"context"
	"crypto/rand"
	"crypto/tls"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
	"net/http"
	"net/smtp"
	"strings"
)

// Ctx context
var Ctx = context.Background()

// CodeStructData Struct for code
type CodeStructData struct {
	Email string `json:"email"`
	// Code 6 characters
	Code string `json:"code"`
}

// GenerateCode Generate a random code
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

// SendEmail S end email
func SendEmail(email, code string) error {
	// SMTP Server settings
	smtpHost := "smtp.gmail.com"
	smtpPort := "465"
	smtpUsername := "longsizhuo@gmail.com"
	smtpPassword := "ixqn kadp cxgx btmp"

	// Set up authentication information.
	from := smtpUsername
	to := []string{email}
	subject := "SpotFinder Verification Code"
	body := "Your code is: " + code + "\nEnjoy our service!"

	// set up the message
	message := []byte("From: " + from + "\r\n" +
		"To: " + strings.Join(to, ", ") + "\r\n" +
		"Subject: " + subject + "\r\n\r\n" +
		body + "\r\n")

	// use tls to connect to server
	auth := smtp.PlainAuth("", smtpUsername, smtpPassword, smtpHost)
	addr := smtpHost + ":" + smtpPort

	tlsConfig := &tls.Config{
		InsecureSkipVerify: true,
		ServerName:         smtpHost,
	}

	conn, err := tls.Dial("tcp", addr, tlsConfig)
	if err != nil {
		fmt.Println("Error connecting to SMTP server:", err)
		return err
	}
	client, err := smtp.NewClient(conn, smtpHost)
	if err != nil {
		fmt.Println("Error creating SMTP client:", err)
		return err
	}

	// authenticate
	if err = client.Auth(auth); err != nil {
		fmt.Println("Error during SMTP auth:", err)
		return err
	}
	if err = client.Mail(from); err != nil {
		fmt.Println("Error setting sender address:", err)
		return err
	}
	for _, recipient := range to {
		if err = client.Rcpt(recipient); err != nil {
			fmt.Println("Error setting recipient address:", err)
			return err
		}
	}
	w, err := client.Data()
	if err != nil {
		fmt.Println("Error creating email:", err)
		return err
	}
	_, err = w.Write(message)
	if err != nil {
		fmt.Println("Error writing message:", err)
		return err
	}
	err = w.Close()
	if err != nil {
		fmt.Println("Error closing SMTP writer:", err)
		return err
	}
	err = client.Quit()
	if err != nil {
		return err
	}

	return nil
}

//func SendEmail(srv *gmail.Service, to, subject, body string) error {
//	fmt.Println("sendEmail")
//	var message gmail.Message
//	emailBody := []byte("To: " + to + "\r\n" + "Subject: " + subject + "\r\n" + "\r\n" + body)
//	message.Raw = base64.URLEncoding.EncodeToString(emailBody)
//	_, err := srv.Users.Messages.Send("me", &message).Do()
//	if err != nil {
//		fmt.Println("Error: ", err)
//		return err
//	}
//	return nil
//}

// verifyCode Verify the code
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
		fmt.Println("Code expired")
	}
	fmt.Println(valid)
	return valid
}

// VerifiedCodeHandler Verify the code handler function
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
