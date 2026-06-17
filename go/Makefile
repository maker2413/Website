run:
	@go run cmd/ssh-server/main.go

build:
	@go build -o website cmd/ssh-server/main.go

lint:
	@golangci-lint run

test:
	@go test -cover ./...
