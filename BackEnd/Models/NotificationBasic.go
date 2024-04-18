package Models

import (
	"gorm.io/gorm"
	"time"
)

type Notification struct {
	gorm.Model
	ReceiverID uint       `gorm:"not null"`
	Content    string     `gorm:"type:text;not null"`
	SentAt     time.Time  `gorm:"type:datetime;not null"`
	ReadAt     *time.Time `gorm:"type:datetime;null"`
	Delivered  bool       `gorm:"type:boolean;default:false"` // Whether the message has been delivered

	Receiver UserBasic `gorm:"foreignKey:ReceiverID;"`
}

func (Notification) TableName() string {
	return "notifications"
}
