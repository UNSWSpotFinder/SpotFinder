package Models

import (
	"gorm.io/gorm"
	"time"
)

type Message struct {
	gorm.Model
	SenderID   uint       `gorm:"type:uint;not null"`
	ReceiverID uint       `gorm:"type:uint;not null"`
	Content    string     `gorm:"type:text;not null"`
	SentAt     time.Time  `gorm:"type:datetime;not null"`
	ReadAt     *time.Time `gorm:"type:datetime;null"`
	Delivered  bool       `gorm:"type:boolean;default:false"` // 新增字段表示消息是否已送达

	Sender   UserBasic `gorm:"foreignKey:SenderID;"`
	Receiver UserBasic `gorm:"foreignKey:ReceiverID;"`
}

func (Message) TableName() string {
	return "messages"
}
