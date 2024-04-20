FROM golang:1.22 as builder

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy go mod and sum files
COPY . .

RUN go mod tidy
RUN go mod download
RUN go install github.com/swaggo/swag/cmd/swag@latest
RUN swag init
# Copy the source from the current directory to the Working Directory inside the container
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Use a minimal alpine image
FROM alpine:latest

# Copy the Pre-built binary file from the previous stage
COPY --from=builder /app/main .
COPY ./Config/app.yml /app/Config/
COPY ./util/credentials.json /app/util/
COPY ./util/token.json /app/util/
# Show the file structure
RUN ls -la

ENV BASE_PATH /app
# Expose port 8080 to the outside world
EXPOSE 8080
RUN ls -la /app/util/
# Run the executable
CMD ["./main"]
