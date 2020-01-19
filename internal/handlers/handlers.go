package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/sirupsen/logrus"
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

// logger
var log *logrus.Logger

// New inits a http server with a connection to
// the grpc server at `addr`
func New(addr string) (Server, error) {

	s := &server{}

	log = logrus.New()
	log.SetFormatter(&logrus.TextFormatter{})

	// connect to grpc server plaintext
	// TODO: add TLS support
	conn, err := grpc.Dial(addr, grpc.WithInsecure(), grpc.WithBlock())
	if err != nil {
		return nil, err
	}

	// init channelz client from connection
	client := channelz.NewChannelzClient(conn)
	s.c = client

	// add endpoints
	route(s)

	return s, nil
}

// Add endpoints to server struct
func route(s *server) {

	r := mux.NewRouter()

	// web frontend
	r.Handle("/", http.StripPrefix("/", http.FileServer(http.Dir("internal/web"))))

	// api
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

// getServer return information about a grpc server
func (s *server) getServer(w http.ResponseWriter, r *http.Request) {

	// get server id
	id, err := getID("server_id", r)
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// form grpc request
	in := &channelz.GetServerRequest{
		ServerId: int64(id),
	}

	// get server
	rs, err := s.c.GetServer(context.TODO(), in)
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// marshal response to json
	b, err := json.Marshal(rs.GetServer())
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Write(b)
}

// getServers returns all registered grpc servers
func (s *server) getServers(w http.ResponseWriter, r *http.Request) {

	in := &channelz.GetServersRequest{}

	// call channelz api
	rs, err := s.c.GetServers(context.TODO(), in)
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// marshal requst to json
	b, err := json.Marshal(rs.GetServer())
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Write(b)
}

// getServerSockets returns all sockets on a grpc server
func (s *server) getServerSockets(w http.ResponseWriter, r *http.Request) {

	// get server id
	id, err := getID("server_id", r)
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	in := &channelz.GetServerSocketsRequest{
		ServerId: int64(id),
	}

	// get sockets
	rs, err := s.c.GetServerSockets(context.TODO(), in)
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// marshal into json
	b, err := json.Marshal(rs.GetSocketRef())
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Write(b)
}

// getSocket returns detailed information about a socket
func (s *server) getSocket(w http.ResponseWriter, r *http.Request) {

	// get socket id
	id, err := getID("socket_id", r)
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	in := &channelz.GetSocketRequest{
		SocketId: int64(id),
	}

	// get socket
	rs, err := s.c.GetSocket(context.TODO(), in)
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// convert to json
	b, err := json.Marshal(rs.GetSocket())
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Write(b)
}

// getChannel returns details about a channel, including events
func (s *server) getChannel(w http.ResponseWriter, r *http.Request) {

	id, err := getID("channel_id", r)
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	in := &channelz.GetChannelRequest{
		ChannelId: int64(id),
	}

	rs, err := s.c.GetChannel(context.TODO(), in)
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// convert to json
	b, err := json.Marshal(rs.GetChannel())
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Write(b)
}

// getSubChannel returns details about a subchannel, including events
func (s *server) getSubChannel(w http.ResponseWriter, r *http.Request) {

	// get id
	id, err := getID("subchannel_id", r)
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	in := &channelz.GetSubchannelRequest{
		SubchannelId: int64(id),
	}

	rs, err := s.c.GetSubchannel(context.TODO(), in)
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// convert to json
	b, err := json.Marshal(rs.GetSubchannel())
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Write(b)
}

// getTopChannels will return all channels
func (s *server) getTopChannels(w http.ResponseWriter, r *http.Request) {

	in := &channelz.GetTopChannelsRequest{}

	rs, err := s.c.GetTopChannels(context.TODO(), in)
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// convert to json
	b, err := json.Marshal(rs.GetChannel())
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Write(b)
}

// getID will parse a url for an ID and return an int
func getID(name string, r *http.Request) (int, error) {

	// parse request for parameters
	if err := r.ParseForm(); err != nil {
		return 0, err
	}
	p := r.FormValue(name)

	// convert to int
	id, err := strconv.Atoi(p)
	if err != nil {
		return 0, err
	}

	return id, nil
}
