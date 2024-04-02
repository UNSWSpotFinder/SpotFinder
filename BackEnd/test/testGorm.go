package main

import (
	"bytes"
	"capstone-project-9900h14atiktokk/Models"
	"capstone-project-9900h14atiktokk/util"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"github.com/brianvoe/gofakeit/v6"
	"github.com/fogleman/gg"
	"golang.org/x/crypto/bcrypt"
	"golang.org/x/exp/rand"
	"strconv"
	"time"
)

// randomAvatar 生成随机头像
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
	if err := db.AutoMigrate(&Models.UserBasic{}); err != nil {
		fmt.Println("Failed to migrate database:", err)
		return
	}
	if err := db.AutoMigrate(&Models.SpotBasic{}); err != nil {
		fmt.Println("Failed to migrate database:", err)
		return
	}
	if err := db.AutoMigrate(&Models.OrderBasic{}); err != nil {
		fmt.Println("Failed to migrate database:", err)
		return
	}
	if err := db.AutoMigrate(&Models.ManagerBasic{}); err != nil {
		fmt.Println("Failed to migrate database:", err)
		return
	}

	userCount := 1000
	batchSize := 100 // 每批处理的用户数量

	var users []Models.UserBasic
	var spots []Models.SpotBasic
	var orders []Models.OrderBasic
	var managers []Models.ManagerBasic

	for i := 1; i <= 1; i++ {
		// 生成随机的日期
		day := strconv.Itoa(gofakeit.Number(1, 31))       // 将日转换为字符串
		month := strconv.Itoa(gofakeit.Number(1, 12))     // 将月转换为字符串
		year := strconv.Itoa(gofakeit.Number(1950, 2000)) // 将年转换为字符串
		avatar, err := randomAvatar()
		if err != nil {
			fmt.Printf("Failed to create avatar at user %d: %v\n\n", i, err)
			return
		}
		hashPassword, err := bcrypt.GenerateFromPassword([]byte("123456"), bcrypt.DefaultCost)

		// 构造出生日期字符串
		dateBirth := day + "/" + month + "/" + year
		manager := Models.ManagerBasic{
			Name:       "longsizhuo",
			Password:   string(hashPassword),
			Phone:      gofakeit.Phone(),
			DateBirth:  dateBirth,
			Avatar:     avatar,
			AdminID:    gofakeit.UUID(),
			CreateTime: time.Now(),
		}
		managers = append(managers, manager)
	}

	// 车位类别
	spotType := []string{"Carport", "Driveway", "Garage", "Parking-lot"}
	spotSize := []string{"Box", "Sedan", "Hatchback", "4WD/SUV", "Van"}
	chargeType := []string{
		"None",
		"Wall(AU/NZ)",
		"SAE J-1772",
		"Type2",
		"CHAdeMO"}
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

		hashPassword, err := bcrypt.GenerateFromPassword([]byte("123456"), bcrypt.DefaultCost)
		// 为每个用户创建不同的数据
		user := Models.UserBasic{
			Name:       gofakeit.Name(),
			Password:   string(hashPassword),
			Phone:      gofakeit.Phone(),
			DateBirth:  dateBirth,
			Avatar:     userAvatar,
			Email:      gofakeit.Email(),
			CreateTime: time.Now(),
			CarID:      gofakeit.Car().Model,
			Addr:       string(addrJSON),
			Account:    Account,
			Earning:    earning,
			TopUp:      topUp,
		}

		// Create Spot
		var PricePerDay = gofakeit.Float64Range(90, 100)
		PricePerWeek := gofakeit.Float64Range(PricePerDay*5, PricePerDay*7)
		PricePerHour := gofakeit.Float64Range(PricePerDay/24, PricePerDay/8)
		var occupiedTime []string
		var availableTime []string
		for j := 0; j < rand.Intn(4); j++ {
			occupiedTime = append(occupiedTime, gofakeit.Date().String())
			availableTime = append(availableTime, gofakeit.Date().String())
		}
		occupiedTimeJSON, err := json.Marshal(occupiedTime)
		availableTimeJSON, err := json.Marshal(availableTime)
		if err != nil {
			println(err)
			return
		}

		var pictures []string
		for j := 0; j < gofakeit.Number(1, 4); j++ {
			avatar, err := randomAvatar()
			if err != nil {
				fmt.Printf("Failed to create avatar at user %d: %v\n\n", i, err)
				return
			}
			pictures = append(pictures, avatar)
		}
		primaryPicture := pictures[0]
		picturesJSON, err := json.Marshal(pictures)
		chargeType := chargeType[gofakeit.Number(0, 4)]
		spot := Models.SpotBasic{
			SpotName:     gofakeit.Word(),
			SpotAddr:     gofakeit.Address().Address,
			SpotType:     spotType[gofakeit.Number(0, 3)],
			IsVisible:    true,
			Rate:         uint(gofakeit.Number(0, 100)),
			Size:         spotSize[gofakeit.Number(0, 4)],
			Pictures:     primaryPicture,
			Charge:       chargeType,
			MorePictures: string(picturesJSON),
			IsDayRent:    gofakeit.Bool(),
			IsWeekRent:   gofakeit.Bool(),
			IsHourRent:   gofakeit.Bool(),
			PricePerDay:  PricePerDay,
			PricePerWeek: PricePerWeek,
			PricePerHour: PricePerHour,

			AvailableTime: string(availableTimeJSON),
			OccupiedTime:  string(occupiedTimeJSON),
			OrderNum:      uint(rand.Intn(10)),
		}

		order := Models.OrderBasic{
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
			if err :=
				db.CreateInBatches(managers, batchSize).Error; err != nil {
				fmt.Printf("Failed to create batch at manager %d: %v\n", i, err)
			}
			users = []Models.UserBasic{} // 重置切片，准备下一批次
			spots = []Models.SpotBasic{}
			orders = []Models.OrderBasic{}
			managers = []Models.ManagerBasic{}
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
	//var customers []User.ManagerBasic
	//db.Find(&customers)
	//
	//for _, customer := range customers {
	//	// 查找一个未被占用的车位
	//	var spot Spot.ManagerBasic
	//	db.Where("is_occupy = ?", false).First(&spot)
	//
	//	if spot.ID != 0 { // 确保找到了车位
	//		// 更新车位信息，将当前用户设为车位的拥有者
	//		spot.OwnerID = customer.ID
	//		spot.IsOccupy = true
	//		db.Save(&spot)
	//
	//		// 解析用户所拥有的车位列表 JSON
	//		var ownedSpots []int
	//		if err := json.Unmarshal([]byte(customer.OwnedSpot), &ownedSpots); err != nil {
	//			// 处理可能的错误
	//			fmt.Println("Error unmarshalling OwnedSpots:", err)
	//			continue // 跳过当前用户
	//		}
	//
	//		// 添加新的车位ID
	//		ownedSpots = append(ownedSpots, int(spot.ID))
	//
	//		// 将更新后的车位列表转回 JSON 字符串
	//		updatedOwnedSpots, err := json.Marshal(ownedSpots)
	//		if err != nil {
	//			// 处理可能的错误
	//			fmt.Println("Error marshalling OwnedSpots:", err)
	//			continue // 跳过当前用户
	//		}
	//
	//		// 更新用户所拥有的车位列表
	//		customer.OwnedSpot = string(updatedOwnedSpots)
	//		db.Save(&customer)
	//	}
	//}
}
