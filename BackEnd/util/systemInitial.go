package util

import (
	"capstone-project-9900h14atiktokk/Models"
	"context"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
	"github.com/spf13/viper"
	"golang.org/x/oauth2"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"
)

var BasePath = "./"

func InitConfig() {
	if basePath := os.Getenv("BASE_PATH"); basePath != "" {
		BasePath = basePath
	}
	configPath := filepath.Join(BasePath, "Config", "app.yml")
	viper.SetConfigName("app")
	viper.SetConfigType("yaml")
	viper.SetConfigFile(configPath)
	err := viper.ReadInConfig()
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println("config app", viper.Get("app"))
	fmt.Println("config mysql", viper.Get("mysql"))
	//
	//// google API, if you cant use this, use the Python version.
	//ctx := context.Background()
	//b, err := os.ReadFile(tokenPath)
	//if err != nil {
	//	log.Fatalf("Unable to read client secret file: %v", err)
	//}
	//
	//// If modifying these scopes, delete your previously saved token.json.
	//config, err := google.ConfigFromJSON(b, gmail.GmailReadonlyScope, gmail.GmailSendScope, gmail.GmailComposeScope)
	//if err != nil {
	//	log.Fatalf("Unable to parse client secret file to config: %v", err)
	//}
	////fmt.Println("config", config)
	//client := GetClient(config, nil)
	//
	//srv, err := gmail.NewService(ctx, option.WithHTTPClient(client))
	//if err != nil {
	//	log.Fatalf("Unable to retrieve Gmail client: %v", err)
	//}
	//
	//user := "me"
	//r, err := srv.Users.Labels.List(user).Do()
	//if err != nil {
	//	log.Fatalf("Unable to retrieve labels: %v", err)
	//}
	//if len(r.Labels) == 0 {
	//	fmt.Println("No labels found.")
	//	return nil
	//}
	//fmt.Println("Labels:")
	//for _, l := range r.Labels {
	//	fmt.Printf("- %s\n", l.Name)
	//}
	//return srv
}

// GetClient Retrieve a token, saves the token, then returns the generated client.
func GetClient(config *oauth2.Config, c *gin.Context) *http.Client {
	// The file token.json stores the user's access and refresh tokens, and is
	// created automatically when the authorization flow completes for the first
	// time.
	tokFile := filepath.Join(BasePath, "util", "token.json")
	tok, err := tokenFromFile(tokFile, c)
	if err != nil {
		tok = getTokenFromWeb(config)
		saveToken(tokFile, tok, c)
	}
	return config.Client(context.Background(), tok)
}

// tokenFromFile Retrieves a token from a local file.
func tokenFromFile(file string, c *gin.Context) (*oauth2.Token, error) {
	f, err := os.Open(file)
	if err != nil {
		return nil, err
	}
	defer func(f *os.File) {
		err := f.Close()
		if err != nil {
			c.JSON(500, "Cannot close file")
			return
		}
	}(f)
	tok := &oauth2.Token{}
	err = json.NewDecoder(f).Decode(tok)
	return tok, err
}

// saveToken Saves a token to a file path.
func saveToken(path string, token *oauth2.Token, c *gin.Context) {
	fmt.Printf("Saving credential file to: %s\n", path)
	f, err := os.OpenFile(path, os.O_RDWR|os.O_CREATE|os.O_TRUNC, 0600)
	if err != nil {
		log.Fatalf("Unable to cache oauth token: %v", err)
	}
	defer func(f *os.File) {
		err := f.Close()
		if err != nil {
			c.JSON(500, "Cannot close file")
			return
		}
	}(f)
	err = json.NewEncoder(f).Encode(token)
	if err != nil {
		c.JSON(500, "文件写入失败")
		return
	}
}

// getTokenFromWeb Your program flow should have already authorized the user before getting here.
func getTokenFromWeb(config *oauth2.Config) *oauth2.Token {
	authUrl := config.AuthCodeURL("state-token", oauth2.AccessTypeOffline)
	fmt.Println("Go to the following link and type the authorization code:\n", authUrl)

	var authCode string
	if _, err := fmt.Scan(&authCode); err != nil {
		log.Fatalln("Unable to read auth code:", err)
	}

	tok, err := config.Exchange(context.TODO(), authCode)
	if err != nil {
		log.Fatalln("Unable to retrieve token:", err)
	}

	return tok
}

func InitMySQL() *gorm.DB {
	// dsn := "root
	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags), // io writer
		logger.Config{
			SlowThreshold: time.Second,  // Slow SQL threshold
			LogLevel:      logger.Error, // Log level
			Colorful:      true,
		},
	)

	dsn := viper.GetString("mysql.dns")
	fmt.Println(dsn)
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: newLogger,
	})
	if err != nil {
		panic("failed to connect database")
	}
	//user := models.UserBasic{}
	//db.Find(&user)
	//fmt.Println(user)
	if err := db.AutoMigrate(&Models.UserBasic{}); err != nil {
		fmt.Println(err)

	}
	if err := db.AutoMigrate(&Models.ManagerBasic{}); err != nil {
		fmt.Println(err)

	}
	if err := db.AutoMigrate(&Models.CarBasic{}); err != nil {
		fmt.Println(err)

	}
	if err := db.AutoMigrate(&Models.OrderBasic{}); err != nil {
		fmt.Println(err)

	}
	if err := db.AutoMigrate(&Models.Message{}); err != nil {
		fmt.Println(err)
	}
	if err := db.AutoMigrate(&Models.SpotBasic{}); err != nil {
		fmt.Println(err)
	}
	if err := db.AutoMigrate(&Models.ReportBasic{}); err != nil {
		fmt.Println(err)
	}
	if err := db.AutoMigrate(&Models.Notification{}); err != nil {
		fmt.Println(err)
	}
	if err := db.AutoMigrate(&Models.Review{}); err != nil {
		fmt.Println(err)
	}
	if err := db.AutoMigrate(&Models.DailyOrderCost{}); err != nil {
		fmt.Println(err)
	}
	if err := db.AutoMigrate(&Models.Voucher{}); err != nil {
		fmt.Println(err)
	}
	return db
}

type RedisConfig struct {
	Addr     string `mapstructure:"addr"`
	Password string `mapstructure:"password"`
	DB       int    `mapstructure:"db"`
}

func InitRedis() *redis.Client {
	var redisConf RedisConfig
	err := viper.UnmarshalKey("redis", &redisConf)
	if err != nil {
		log.Fatalf("unable to decode into struct, %v", err)
	}
	redisClient := redis.NewClient(&redis.Options{
		Addr:     redisConf.Addr,
		Password: redisConf.Password,
		DB:       redisConf.DB,
	})

	ctx := context.Background()
	res, err := redisClient.Ping(ctx).Result()
	if err != nil {
		log.Fatalf("redis connect failed, %v", err)
	}
	fmt.Printf("redis connect result:%v\n", res)

	return redisClient
}
