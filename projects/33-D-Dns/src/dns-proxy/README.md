# d-dns-proxy

## Compile
```bash
go mod tidy
go build .
```

## Steps
1. Please specify the dep-dns-chain URL. By default, the local chain (ws://127.0.0.1:9944) will be used.

2. Please specify the HTTP server port. The default port is 8888.

3. Please specify the file path for the database. The default path is ./record.db.

## Complete command:
```bash
./d-dns-proxy -url ws://127.0.1.1:9944 -port 8888 -db_path ./record.db
```