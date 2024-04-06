package main

import (
	pb "capstone-project-9900h14atiktokk/Service/Message/proto"
	"google.golang.org/grpc"
	"google.golang.org/protobuf/types/known/timestamppb"
	"io"
	"log"
	"net"
	"time"
)

type server struct {
	pb.UnimplementedGreeterServer
}

func (s *server) SayHello(stream pb.Greeter_SayHelloServer) error {
	for {
		in, err := stream.Recv()
		if err == io.EOF {
			return nil
		}
		if err != nil {
			return err
		}
		reply := &pb.HelloReply{
			Message:   "Hello " + in.Name,
			Time:      timestamppb.New(time.Now()),
			MessageId: in.MessageId, // assuming MessageId is echoed back
		}
		if err := stream.Send(reply); err != nil {
			return err
		}
	}
}

func main() {
	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterGreeterServer(s, &server{})
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
