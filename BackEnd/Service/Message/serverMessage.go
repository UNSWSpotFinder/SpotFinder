package Message

import (
	pb "capstone-project-9900h14atiktokk/Service/Message/proto"
	"context"
)

type Server struct {
	pb.UnimplementedChatServiceServer
	messages []pb.Message // 假设这里用slice来暂存消息
}

func (s *Server) SendMessage(ctx context.Context, message *pb.Message) (*pb.SendMessageResponse, error) {
	// 这里简单地将消息存储起来
	s.messages = append(s.messages, *message)
	return &pb.SendMessageResponse{Success: true}, nil
}

func (s *Server) ReceiveMessage(req *pb.StreamMessagesRequest, stream pb.ChatService_ReceiveMessageServer) error {
	for i := range s.messages {
		msg := &s.messages[i] // Use a pointer to the message
		if msg.ReceiverId == req.ReceiverId {
			if err := stream.Send(msg); err != nil {
				return err
			}
		}
	}
	return nil
}
