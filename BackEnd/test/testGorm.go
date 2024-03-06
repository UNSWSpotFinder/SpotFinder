package main

import (
	"bytes"
	"capstone-project-9900h14atiktokk/Models/Order"
	"capstone-project-9900h14atiktokk/Models/Spot"
	"capstone-project-9900h14atiktokk/Models/User"
	"capstone-project-9900h14atiktokk/util"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"github.com/brianvoe/gofakeit/v6"
	"github.com/fogleman/gg"
	"golang.org/x/exp/rand"
	"strconv"
	"time"
)

func randomAvatar() (string, error) {
	const S = 1024
	dc := gg.NewContext(S, S)
	rand.Seed(uint64(time.Now().UnixNano()))
	dc.SetRGB(
		float64(gofakeit.Float32Range(0, 1)),
		float64(gofakeit.Float32Range(0, 1)),
		float64(gofakeit.Float32Range(0, 1)),
	)
	dc.Clear()

	dc.SetRGB(
		float64(gofakeit.Float32Range(0, 1)),
		float64(gofakeit.Float32Range(0, 1)),
		float64(gofakeit.Float32Range(0, 1)),
	)
	dc.DrawCircle(S/2, S/2, S/3)
	dc.Fill()

	// 将图像编码为 PNG 并存储到缓冲区
	var buf bytes.Buffer
	err := dc.EncodePNG(&buf)
	if err != nil {
		println(err)
		return "", err
	}

	// 将图像编码为 base64 字符串
	return base64.StdEncoding.EncodeToString(buf.Bytes()), nil

}

func main() {
	util.InitConfig()
	db := util.InitMySQL()
	// 迁移 schema
	if err := db.AutoMigrate(&User.Basic{}); err != nil {
		fmt.Println("Failed to migrate database:", err)
		return
	}
	if err := db.AutoMigrate(&Spot.Basic{}); err != nil {
		fmt.Println("Failed to migrate database:", err)
		return
	}
	if err := db.AutoMigrate(&Order.Basic{}); err != nil {
		fmt.Println("Failed to migrate database:", err)
		return
	}

	userCount := 300
	batchSize := 50 // 每批处理的用户数量

	var users []User.Basic
	var spots []Spot.Basic
	var orders []Order.Basic

	// 车位类别
	spotType := []string{"Carport", "Driveway", "Garage", "Parking-lot"}
	spotSize := []string{"Box", "Sedan", "Hatchback", "4WD/SUV", "Van"}
	orderStatus := []string{"Pending", "Paid", "Cancelled", "Refund"}
	for i := 1; i <= userCount; i++ {
		// Create User
		userAvatar, err := randomAvatar()
		if err != nil {
			fmt.Printf("Failed to create avatar at user %d: %v\n\n", i, err)
			return
		}

		// Addr
		addrInfo := gofakeit.Address()
		addrJSON, err := json.Marshal(addrInfo)
		if err != nil {
			fmt.Printf("Failed to create address at user %d: %v\n\n", i, err)
			return
		}
		// About Money
		earning := gofakeit.Float64Range(0, 1000)
		topUp := gofakeit.Float64Range(0, 1000)
		Account := earning + topUp

		// 生成随机的日期
		day := strconv.Itoa(gofakeit.Number(1, 31))       // 将日转换为字符串
		month := strconv.Itoa(gofakeit.Number(1, 12))     // 将月转换为字符串
		year := strconv.Itoa(gofakeit.Number(1950, 2000)) // 将年转换为字符串

		// 构造出生日期字符串
		dateBirth := day + "/" + month + "/" + year

		// 为每个用户创建不同的数据
		user := User.Basic{
			Name:       gofakeit.Name(),
			Password:   gofakeit.Password(true, true, true, false, false, 10),
			Phone:      gofakeit.Phone(),
			DateBirth:  dateBirth,
			Avatar:     userAvatar,
			Email:      gofakeit.Email(),
			CreateTime: time.Now(),
			CarInfo:    gofakeit.Car().Model,
			Addr:       string(addrJSON),
			Account:    Account,
			Earning:    earning,
			TopUp:      topUp,
		}

		// Create Spot
		var PricePerDay float64 = gofakeit.Float64Range(90, 100)
		PricePerWeek := gofakeit.Float64Range(PricePerDay*5, PricePerDay*7)
		PricePerMonth := gofakeit.Float64Range(PricePerWeek*4, PricePerWeek*5)
		var occupiedTime []string
		for j := 0; j < rand.Intn(4); j++ {
			occupiedTime = append(occupiedTime, gofakeit.Date().String())
		}
		occupiedTimeJSON, err := json.Marshal(occupiedTime)
		if err != nil {
			println(err)
			return
		}

		pictures := []string{}
		for j := 0; j < rand.Intn(4); j++ {
			avatar, err := randomAvatar()
			if err != nil {
				fmt.Printf("Failed to create avatar at user %d: %v\n\n", i, err)
				return
			}
			pictures = append(pictures, avatar)
		}
		picturesJSON, err := json.Marshal(pictures)

		spot := Spot.Basic{
			SpotName:      gofakeit.Word(),
			SpotAddr:      gofakeit.Address().Address,
			SpotType:      spotType[gofakeit.Number(0, 3)],
			IsOccupy:      false,
			IsVisible:     true,
			Rate:          uint(gofakeit.Number(0, 100)),
			Size:          spotSize[gofakeit.Number(0, 4)],
			Pictures:      string(picturesJSON),
			PricePerDay:   PricePerDay,
			PricePerWeek:  PricePerWeek,
			PricePerMonth: PricePerMonth,

			OccupiedTime: string(occupiedTimeJSON),
		}

		order := Order.Basic{
			Cost:   PricePerDay * float64(rand.Intn(10)),
			Status: orderStatus[gofakeit.Number(0, 3)],
		}
		users = append(users, user)
		spots = append(spots, spot)
		orders = append(orders, order)
		println(users, spots, orders)

		// 每当达到一定批量或处理完最后一批时，执行批量插入
		if i%batchSize == 0 || i == userCount {
			if err := db.CreateInBatches(users, batchSize).Error; err != nil {
				fmt.Printf("Failed to create batch at user %d: %v\n", i, err)
			}
			if err := db.CreateInBatches(spots, batchSize).Error; err != nil {
				fmt.Printf("Failed to create batch at spot %d: %v\n", i, err)
			}
			if err := db.CreateInBatches(orders, batchSize).Error; err != nil {
				fmt.Printf("Failed to create batch at order %d: %v\n", i, err)
			}
			users = []User.Basic{} // 重置切片，准备下一批次
			spots = []Spot.Basic{}
			orders = []Order.Basic{}
		}
	}

	/* TODO: 最困难的部分
	车位的OwnerId需要与userid对应，即user所拥有的车位列表中应该存在该车位的id
	连接逻辑：{
	1. 我们有用户（可同时作为出租者，租借者）和车位和订单、
	2. 车位的id关联着出租者的id、
	3. 用户可以租复数个车位，当然也可以拥有复数个车位。
	}
	*/
	// 遍历所有用户
	var customers []User.Basic
	db.Find(&customers)

	for _, customer := range customers {
		// 查找一个未被占用的车位
		var spot Spot.Basic
		db.Where("is_occupy = ?", false).First(&spot)

		if spot.ID != 0 { // 确保找到了车位
			// 更新车位信息，将当前用户设为车位的拥有者
			spot.OwnerID = customer.ID
			spot.IsOccupy = true
			db.Save(&spot)

			// 解析用户所拥有的车位列表 JSON
			var ownedSpots []int
			if err := json.Unmarshal([]byte(customer.OwnedSpot), &ownedSpots); err != nil {
				// 处理可能的错误
				fmt.Println("Error unmarshalling OwnedSpots:", err)
				continue // 跳过当前用户
			}

			// 添加新的车位ID
			ownedSpots = append(ownedSpots, int(spot.ID))

			// 将更新后的车位列表转回 JSON 字符串
			updatedOwnedSpots, err := json.Marshal(ownedSpots)
			if err != nil {
				// 处理可能的错误
				fmt.Println("Error marshalling OwnedSpots:", err)
				continue // 跳过当前用户
			}

			// 更新用户所拥有的车位列表
			customer.OwnedSpot = string(updatedOwnedSpots)
			db.Save(&customer)
		}
	}
}
