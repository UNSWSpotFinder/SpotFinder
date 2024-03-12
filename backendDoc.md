整个后端的架构为Model层，Service层，Controller层，Router层。Model层负责定义数据库表的结构，Service层负责处理业务逻辑，Controller层负责处理请求和返回响应，Router层负责路由分发。下面是Model层的代码：

```go
func main() {
	srv := util.InitConfig()
	db := util.InitMySQL()
	redisCli := util.InitRedis()
	// 全局数据库链接
	Service.DB = db
	r := Router.Router(srv, redisCli)
	err := r.Run(":8080")
	if err != nil {
		return
	}
	err = browser.OpenURL("http://localhost:8080/swagger/index.html")
	if err != nil {
		log.Fatal(err)
		return
	}
}
```

```go
这里的main函数初始化gmail 验证，数据库连接，redis连接，然后初始化路由，并开始监听端口8080。如果监听失败，就返回。


```
下面介绍 以下email验证码生成的流程：
```go
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
```
```go
这里的逻辑就是生成使用randomBytes生成随机数，并通过redis存储，最后通过emailsend函数发送给用户
