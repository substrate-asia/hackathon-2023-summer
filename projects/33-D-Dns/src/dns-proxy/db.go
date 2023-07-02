package main

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

type WalDB struct {
	path string
	DB   *sql.DB
}

func NewDB(path string) (WalDB, error) {
	db, err := sql.Open("sqlite3", path)
	if err != nil {
		return WalDB{}, err
	}
	db.Exec("PRAGMA auto_vacuum = FULL")
	db.Exec("PRAGMA synchronous = NORMAL")
	db.Exec("PRAGMA journal_mode = WAL")
	return WalDB{path, db}, nil
}

func (wal WalDB) Close() {
	wal.DB.Close()
}

func (wal WalDB) CreateTable() error {
	_, err := wal.DB.Exec("CREATE TABLE IF NOT EXISTS records (address TEXT PRIMARY KEY,ip TEXT)")
	if err != nil {
		return err
	}

	_, err = wal.DB.Exec("begin;CREATE TABLE IF NOT EXISTS versions (version INTEGER);insert into versions values(?);end;", 0)
	if err != nil {
		return err
	}
	return nil
}

func (wal WalDB) Insert(address string, ip string) error {
	_, err := wal.DB.Exec("insert or replace into records (address ,ip ) values(?,?)", address, ip)
	if err != nil {
		return err
	}
	return nil
}

func (wal WalDB) Delete(address string) error {
	_, err := wal.DB.Exec("delete from records where address = ?", address)
	if err != nil {
		return err
	}
	return nil
}

func (wal WalDB) Tx_insert(address string, ip string, version uint64) error {
	_, err := wal.DB.Exec("begin;insert or replace into records (address ,ip ) values(?,?);update versions set version = ?;end;",
		address, ip, version)
	return err
}

func (wal WalDB) Tx_delete(address string, version uint64) error {
	_, err := wal.DB.Exec("begin;delete from records where address = ?;update versions set version = ?;end;",
		address, version)
	return err
}

func (wal WalDB) UpdateV(version uint64) error {
	_, err := wal.DB.Exec("update versions set version = ?", version)
	if err != nil {
		return err
	}
	return nil
}

func (wal WalDB) LoadRecords() (uint64, map[string]string) {
	rows, err := wal.DB.Query("SELECT address, ip FROM records")
	if err != nil {
		log.Println(err)
		return 0, nil
	}
	defer rows.Close()

	m := make(map[string]string)
	for rows.Next() {
		var address string
		var ip string
		err = rows.Scan(&address, &ip)
		log.Println(address, ip)
		if err != nil {
			panic(err)
		}
		m[address] = ip
	}

	version := wal.LoadVersion()

	return version, m
}

func (wal WalDB) LoadVersion() uint64 {
	var version uint64
	v_row, err := wal.DB.Query("SELECT version FROM versions")
	if err != nil {
		log.Println(err)
		return 0
	}
	if v_row.Next() {
		v_row.Scan(&version)
	}
	return version
}
