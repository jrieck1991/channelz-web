package main

import (
	"fmt"
	"net"
	"net/http"

	"github.com/jrieck1991/channelz-web/internal/handlers"
	"github.com/jrieck1991/channelz-web/internal/pipe"
	"google.golang.org/grpc"
	"google.golang.org/grpc/channelz/service"
	"google.golang.org/grpc/reflection"
)

const (
	webAddr  string = "localhost:8080"
	grpcAddr string = "localhost:7777"
)

func main() {

	// start http channelz ui
	go func() {

		s, err := handlers.New(grpcAddr)
		if err != nil {
			fmt.Println(err)
			return
		}

		fmt.Println("now serving channelz web at", webAddr)
		if err := http.ListenAndServe(webAddr, s); err != nil {
			fmt.Println(err)
			return
		}
	}()

	// start grpc server
	l, err := net.Listen("tcp", grpcAddr)
	if err != nil {
		panic(err)
	}

	p := pipe.Server{}
	s := grpc.NewServer()

	pipe.RegisterPipeServer(s, &p)
	service.RegisterChannelzServiceToServer(s) // register channelz
	reflection.Register(s)

	// start serving grpc requests
	fmt.Println("now serving grpc requests at", grpcAddr)
	if err := s.Serve(l); err != nil {
		panic(err)
	}
}
