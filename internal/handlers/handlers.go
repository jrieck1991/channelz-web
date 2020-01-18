package handlers

import (
	"context"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"google.golang.org/grpc"
	channelz "google.golang.org/grpc/channelz/grpc_channelz_v1"
)

type Server interface {
	ServeHTTP(w http.ResponseWriter, r *http.Request)
}

type server struct {
	r http.Handler
	c channelz.ChannelzClient
}

func New(addr string) (Server, error) {

	s := &server{}

	// init grpc server channelz client
	conn, err := grpc.Dial(addr, grpc.WithInsecure(), grpc.WithBlock())
	if err != nil {
		return nil, err
	}
	client := channelz.NewChannelzClient(conn)
	s.c = client

	// add endpoints
	route(s)

	return s, nil
}

// Add endpoints to server struct
func route(s *server) {

	r := mux.NewRouter()

	r.Handle("/", http.StripPrefix("/", http.FileServer(http.Dir("internal/web"))))

	r.HandleFunc("/server", s.getServer).Methods(http.MethodGet)
	r.HandleFunc("/servers", s.getServers).Methods(http.MethodGet)
	r.HandleFunc("/server_sockets", s.getServerSockets).Methods(http.MethodGet)
	r.HandleFunc("/socket", s.getSocket).Methods(http.MethodGet)
	r.HandleFunc("/channel", s.getChannel).Methods(http.MethodGet)
	r.HandleFunc("/subchannel", s.getSubChannel).Methods(http.MethodGet)
	r.HandleFunc("/topchannels", s.getTopChannels).Methods(http.MethodGet)

	s.r = r
}

// ServeHTTP used to implement http.Handler
func (s *server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	s.r.ServeHTTP(w, r)
}

// getServer will query the GetServer channelz function on the grpc server
func (s *server) getServer(w http.ResponseWriter, r *http.Request) {

	// get query params
	if err := r.ParseForm(); err != nil {
		return
	}
	id := r.FormValue("server_id")

	serverID, err := strconv.Atoi(id)
	if err != nil {
		return
	}

	in := &channelz.GetServerRequest{
		ServerId: int64(serverID),
	}

	rs, err := s.c.GetServer(context.TODO(), in)
	if err != nil {
		return
	}

	w.Write([]byte(rs.String()))
}

// getServer will query the GetServer channelz function on the grpc server
func (s *server) getServers(w http.ResponseWriter, r *http.Request) {

	in := &channelz.GetServersRequest{}

	rs, err := s.c.GetServers(context.TODO(), in)
	if err != nil {
		return
	}

	w.Write([]byte(rs.String()))
}

// getServer will query the GetServer channelz function on the grpc server
func (s *server) getServerSockets(w http.ResponseWriter, r *http.Request) {

	// get query params
	if err := r.ParseForm(); err != nil {
		return
	}
	id := r.FormValue("server_id")

	serverID, err := strconv.Atoi(id)
	if err != nil {
		return
	}

	in := &channelz.GetServerSocketsRequest{
		ServerId: int64(serverID),
	}

	rs, err := s.c.GetServerSockets(context.TODO(), in)
	if err != nil {
		return
	}

	w.Write([]byte(rs.String()))
}

// getServer will query the GetServer channelz function on the grpc server
func (s *server) getSocket(w http.ResponseWriter, r *http.Request) {

	in := &channelz.GetSocketRequest{}

	rs, err := s.c.GetSocket(context.TODO(), in)
	if err != nil {
		return
	}

	w.Write([]byte(rs.String()))
}

// getServer will query the GetServer channelz function on the grpc server
func (s *server) getChannel(w http.ResponseWriter, r *http.Request) {

	in := &channelz.GetChannelRequest{}

	rs, err := s.c.GetChannel(context.TODO(), in)
	if err != nil {
		return
	}

	w.Write([]byte(rs.String()))
}

func (s *server) getSubChannel(w http.ResponseWriter, r *http.Request) {

	in := &channelz.GetSubchannelRequest{}

	rs, err := s.c.GetSubchannel(context.TODO(), in)
	if err != nil {
		return
	}

	w.Write([]byte(rs.String()))
}

func (s *server) getTopChannels(w http.ResponseWriter, r *http.Request) {

	in := &channelz.GetTopChannelsRequest{}

	rs, err := s.c.GetTopChannels(context.TODO(), in)
	if err != nil {
		return
	}

	w.Write([]byte(rs.String()))
}