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

// randomAvatar Generates a random avatar image and returns it as a base64 string
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

	// Save the image to a buffer
	var buf bytes.Buffer
	err := dc.EncodePNG(&buf)
	if err != nil {
		println(err)
		return "", err
	}

	// Encode the image to base64
	return base64.StdEncoding.EncodeToString(buf.Bytes()), nil

}

func main() {
	util.InitConfig()
	db := util.InitMySQL()
	// Migrate schema
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
	batchSize := 100 // Perform batch insert every 100 records

	var users []Models.UserBasic
	var spots []Models.SpotBasic
	var orders []Models.OrderBasic
	var managers []Models.ManagerBasic

	for i := 1; i <= 1; i++ {
		// Generate random user data
		day := strconv.Itoa(gofakeit.Number(1, 31))       // Turn day into a string
		month := strconv.Itoa(gofakeit.Number(1, 12))     // Turn month into a string
		year := strconv.Itoa(gofakeit.Number(1950, 2000)) // Turn year into a string
		avatar, err := randomAvatar()
		if err != nil {
			fmt.Printf("Failed to create avatar at user %d: %v\n\n", i, err)
			return
		}
		hashPassword, err := bcrypt.GenerateFromPassword([]byte("123456"), bcrypt.DefaultCost)

		// Make the date of birth string
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

	// Class of spot
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

		// Generate random user data
		day := strconv.Itoa(gofakeit.Number(1, 31))
		month := strconv.Itoa(gofakeit.Number(1, 12))
		year := strconv.Itoa(gofakeit.Number(1950, 2000))

		// Make the date of birth string
		dateBirth := day + "/" + month + "/" + year

		hashPassword, err := bcrypt.GenerateFromPassword([]byte("123456"), bcrypt.DefaultCost)
		// Create User Data
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
			Rate:         float64(gofakeit.Number(0, 100)),
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

		// Perform batch insert every 100 records or at the end of the loop
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
			users = []Models.UserBasic{} // Clear the slice
			spots = []Models.SpotBasic{}
			orders = []Models.OrderBasic{}
			managers = []Models.ManagerBasic{}
		}
	}
}
