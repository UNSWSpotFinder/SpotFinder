FROM golang:1.20 as builder

# 设置工作目录
WORKDIR /app

# 先复制go.mod和go.sum文件
COPY . .

RUN go mod tidy
RUN go mod download
# 构建应用的命令也可以暂时注释掉，因为此时我们只检查文件
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# 使用alpine作为基础镜像
FROM alpine:latest

# 从builder镜像中复制文件到当前目录
COPY --from=builder /app/main .

# 显示当前目录下的所有文件和文件夹，以确保所有东西都已复制
RUN ls -la

# 暴露端口
EXPOSE 8080

# 运行应用
#CMD ["./main"]
