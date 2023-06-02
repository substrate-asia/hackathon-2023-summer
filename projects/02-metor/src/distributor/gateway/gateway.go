package gateway

import (
	"github.com/gabriel-vasile/mimetype"
	"github.com/gorilla/mux"
	"github.com/samirshao/itools/ihelp"
	"github.com/samirshao/itools/ilog"
	"metor-distributor/config"
	"net/http"
)

type Server struct {
}

func (_this *Server) Start() {
	defer ihelp.ErrCatch()

	ilog.Logger.Infof("gateway - %s", config.Api.GatewayHost)

	router := mux.NewRouter()
	router.Handle("/metor/{cid}", http.HandlerFunc(metor)).Methods("get")

	if err := http.ListenAndServe(config.Api.GatewayHost, router); err != nil {
		ilog.Logger.Fatalf("Could not setup HTTP endpoint: %v", err)
	}
}

func metor(w http.ResponseWriter, r *http.Request) {
	defer ihelp.ErrCatch()

	w.WriteHeader(200)

	vars := mux.Vars(r)
	cid := vars["cid"]
	path := config.Api.Home + config.Api.CacheStore + "/" + cid
	mtype, err := mimetype.DetectFile(path)
	if err != nil {
		ilog.Logger.Error(err)
		_, _ = w.Write([]byte("file unknow"))
		return
	}
	w.Header().Set("Content-Type", mtype.String())
	http.ServeFile(w, r, path)
}
