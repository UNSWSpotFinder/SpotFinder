# Variable Naming Conventions
1. **Naming Start**: Variable names must begin with a letter (A-Z or a-z) or an underscore (_), followed by any number of letters, digits (0-9), or underscores.
2. **CamelCase Naming**: It is recommended to use CamelCase naming for variables. Exported variables (those accessible outside the package) should start with a capital letter (e.g., `ExportedVariable`), while non-exported variables (those accessible only within the package) should start with a lowercase letter (e.g., `internalVariable`).
3. **Conciseness and Clarity**: Choose meaningful names that clearly express the purpose of the variable, but keep them as short as possible. For example, use index or `loopIndex` instead of `i`, and `customerDataRecord` instead of `customer`.
4. **Avoid Using Underscores**
5. **Naming Examples**: Users renting parking spaces are called `customer`, the lessors are called `host`, parking spaces are referred to as `spot`, orders are named `order`, comments are `comment`, ratings are `rating`, images of the parking spot are `spotImage`, user avatars are `avatar`, user identification cards are `idCard`, driver's licenses are `driverLicense`, and vehicle license plates are `licensePlate`.

# Backend
1. Redis is set to run on the local port `6379` by default, but you can try running it on a server next.
2. The database runs on the server port `3306`
3. The email feature utilizes the Google Gmail API. To use it, run quickstart.py to log in to your account and obtain token.json for successful API calls. Alternatively, you can skip this feature and not send emails, or use other methods to send them, with verification codes stored in Redis.
   1. For how to call the API, see this article: https://developers.google.com/gmail/api/quickstart/python
   2. Why use Python? Because Go code can cause the token to not be passed back to the webpage.
   3. Why use the Google Gmail API instead of SMTP? Because SMTP requires a password, while the Google Gmail API does not; it only needs `token.json`.
   ```shell
   cd ./util/
   pip install --upgrade google-api-python-client google-auth-httplib2 google-auth-oauthlib
   python ./quickstart.py
    ```
4. What about the Database? [UserBasic.go](BackEnd%2FModels%2FUserBasic.go)
   ```go
   type CustomerBasic struct {
       gorm.Model
       Name       string     `gorm:"type:varchar(255);not null"`
       Password   string     `gorm:"type:varchar(255);not null"`
       Phone      string     `gorm:"type:varchar(20);not null"`
       DateBirth  time.Time  `gorm:"type:datetime;not null"`
       Avatar     string     `gorm:"type:mediumtext;not null"`
       Email      string     `gorm:"type:varchar(100);not null"`
       CreateTime time.Time  `gorm:"type:datetime;null"`
       DeleteTime *time.Time `gorm:"type:datetime;null"`
   
       // 用户可以有多个车辆信息，租多个车位
       CarInfo    string `gorm:"type:text;not null"` // JSON 编码的字符串
       LeasedSpot string `gorm:"type:text"`
       Addr       string `gorm:"type:text;"`
   
       // 账户余额
       Account float64 `gorm:"type:float;not null"`
       Earning float64 `gorm:"type:float;not null"`
       TopUp   float64 `gorm:"type:float;not null"`
   
       OwnedSpot string `gorm:"type:text;not null"`
   }
   
   func (CustomerBasic) TableName() string {
       return "customer"
   }
   
   type SpotBasic struct {
       gorm.Model
       ID uint `gorm:"primaryKey; autoIncrement"`
       // 一个车位只能属于一个用户
       OwnerID   uint   `gorm:"type:int;not null"`
       SpotName  string `gorm:"type:varchar(255);not null"`
       SpotAddr  string `gorm:"type:text;not null"`
       SpotType  string `gorm:"type:varchar(255);not null"`
       IsOccupy  bool   `gorm:"type:boolean;not null"`
       IsVisible bool   `gorm:"type:boolean;not null"`
       Rate      uint   `gorm:"type:int"`
       // 可以被停车的车辆类型
       Size string `gorm:"type:text;not null"`
   
       Pictures string `gorm:"type:mediumtext;not null"`
   
       PricePerDay   float64 `gorm:"type:float"`
       PricePerWeek  float64 `gorm:"type:float"`
       PricePerMonth float64 `gorm:"type:float"`
   
       // 车位被占用的时间，从久远到现在，方便用二分查找算法
       OccupiedTime string `gorm:"type:text;not null"`
   }
   
   func (SpotBasic) TableName() string {
       return "spot"
   }
   
   type OrderBasic struct {
       gorm.Model
       id uint `gorm:"primaryKey; autoIncrement"`
       // 一个订单只能属于一个用户
       OwnerID uint `gorm:"type:int;not null"`
       // 一个订单只能属于一个车位
       SpotID uint `gorm:"type:int;not null"`
       // Cost = Price * Time
       Cost float64 `gorm:"type:float;not null"`
       // Status = "Pending" or "Paid" or "Refund" or "Canceled"
       Status string `gorm:"type:varchar(255);not null"`
   }
   
   func (OrderBasic) TableName() string {
       return "order"
   }
   ```