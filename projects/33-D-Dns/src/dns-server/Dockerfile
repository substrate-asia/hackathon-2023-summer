FROM golang:1.20.5-alpine AS builder
COPY . /app
WORKDIR /app
ENV http_proxy http://192.168.2.38:1081
ENV https_proxy http://192.168.2.38:1081
RUN apk --no-cache add ca-certificates
RUN CGO_ENABLED=0 go build .

# FROM golang:1.20.5-buster AS runner
FROM scratch AS runner

COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /app/ddns /app/ddns
WORKDIR /app
EXPOSE 53/udp
ENTRYPOINT ["/app/ddns"]
