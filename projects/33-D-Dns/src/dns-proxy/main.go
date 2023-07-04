package main

import (
	"flag"
	"log"

	"github.com/centrifuge/go-substrate-rpc-client/v4/config"
)

func compareMap(a, b map[string]string) (added map[string]string, removed map[string]string) {
	added = make(map[string]string)
	removed = make(map[string]string)

	for k, v := range b {
		if av, ok := a[k]; !ok || av != v {
			added[k] = v
		}
	}

	for k, v := range a {
		if _, ok := b[k]; !ok {
			removed[k] = v
		}
	}
	return added, removed
}

func init_records(wal_db WalDB, m map[string]string, m_chain map[string]string, version uint64) uint64 {
	added, removed := compareMap(m, m_chain)
	if len(added) != 0 || len(removed) != 0 {
		version += 1

		for addr, ip := range added {
			err := wal_db.Insert(addr, ip)
			if err != nil {
				log.Println(err)
			}
		}
		for d_addr := range removed {
			err := wal_db.Delete(d_addr)
			if err != nil {
				log.Println(err)
			}
		}
		err := wal_db.UpdateV(version)
		if err != nil {
			log.Println(err)
		}
	}
	return version
}

func main() {
	log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)
	var url string
	var port uint
	var db_path string
	flag.StringVar(&url, "url", config.Default().RPCURL, "Chain url")
	flag.UintVar(&port, "port", 8888, "Listen Port")
	flag.StringVar(&db_path, "db_path", "./record.db", "path of DB file")
	flag.Parse()

	log.Println(url)
	wal_db, err := NewDB(db_path)
	if err != nil {
		panic(err)
	}
	defer wal_db.Close()

	err = wal_db.CreateTable()
	if err != nil {
		log.Println(err)
	}

	version, m := wal_db.LoadRecords()
	log.Println("From Db records: ", m)
	m_chain := GetLatestRecords(url)
	log.Println("From Chain records: ", m_chain)

	new_version := init_records(wal_db, m, m_chain, version)

	jobs := make(chan RecordOp)
	d := DomainServer{
		Port:        uint16(port),
		version:     new_version,
		record_chan: jobs,
		records:     m_chain,
		Db:          wal_db,
	}
	go ChianWorking(url, jobs)
	d.StartServer()
}
