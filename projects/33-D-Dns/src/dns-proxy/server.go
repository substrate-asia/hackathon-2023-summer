package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"
)

type RecordRequest struct {
	Address string `json:"address"`
}

type RecordReponse struct {
	Ip string `json:"ip"`
}

type VersionResponse struct {
	Version uint64 `json:"version"`
}

type Record struct {
	Address string `json:"address"`
	Ip      string `json:"ip"`
}

type SnapshotResponse struct {
	Version uint64   `json:"version"`
	Records []Record `json:"records"`
}

type RecordOp struct {
	Flag    bool
	Address string
	Ip      string
}

type DomainServer struct {
	Port        uint16
	record_chan <-chan RecordOp
	records     map[string]string
	version     uint64
	mutex       sync.RWMutex
	Db          WalDB
}

func (s *DomainServer) GetRecord(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var rr *RecordRequest
	err := json.NewDecoder(req.Body).Decode(&rr)
	if err != nil {
		http.Error(w, fmt.Sprintf("error decoding the request, %v", err), http.StatusBadRequest)
		return
	}

	s.mutex.RLock()
	val := s.records[rr.Address]
	s.mutex.RUnlock()

	record := RecordReponse{
		Ip: val,
	}

	err = json.NewEncoder(w).Encode(record)
	if err != nil {
		http.Error(w, fmt.Sprintf("error encoding the response, %v", err), http.StatusInternalServerError)
		return
	}
}

func (s *DomainServer) GetVersion(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	s.mutex.RLock()
	version := s.version
	s.mutex.RUnlock()

	vr := VersionResponse{
		Version: version,
	}

	err := json.NewEncoder(w).Encode(vr)
	if err != nil {
		http.Error(w, fmt.Sprintf("error encoding the response, %v", err), http.StatusInternalServerError)
		return
	}
}

func (s *DomainServer) GetSnapshot(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var arr []Record

	s.mutex.RLock()
	for key, value := range s.records {
		r := Record{
			Address: key,
			Ip:      value,
		}
		arr = append(arr, r)
	}
	s.mutex.RUnlock()

	snapshot := SnapshotResponse{
		Version: s.version,
		Records: arr,
	}

	err := json.NewEncoder(w).Encode(snapshot)
	if err != nil {
		http.Error(w, fmt.Sprintf("error encoding the response, %v", err), http.StatusInternalServerError)
		return
	}
}

func (s *DomainServer) RecvRecord() {
	for v := range s.record_chan {
		s.mutex.Lock()
		if v.Flag {
			if s.records[v.Address] != v.Ip {

				s.records[v.Address] = v.Ip
				err := s.Db.Tx_insert(v.Address, v.Ip, s.version+1)
				s.version += 1
				if err != nil {
					log.Fatal(err)
				}
			}
		} else {
			delete(s.records, v.Address)
			err := s.Db.Tx_delete(v.Address, s.version+1)
			s.version += 1
			if err != nil {
				log.Fatal(err)
			}
		}
		s.mutex.Unlock()
	}
}

func (s *DomainServer) StartServer() {
	go s.RecvRecord()
	mux := http.NewServeMux()
	mux.HandleFunc("/querydomain", s.GetRecord)
	mux.HandleFunc("/version", s.GetVersion)
	mux.HandleFunc("/snapshot", s.GetSnapshot)

	server := &http.Server{
		Addr:    fmt.Sprintf(":%d", s.Port),
		Handler: mux,
	}
	log.Fatal(server.ListenAndServe())
}
