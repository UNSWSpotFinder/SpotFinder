FROM golang:1.20 as builder

# 设置工作目录
WORKDIR /app

# 先复制go.mod和go.sum文件
COPY go.mod go.sum ./

# 暂时注释掉这些命令，防止下载依赖
# RUN go mod tidy
# RUN go mod download

# 然后复制项目文件到容器中
COPY . .

# 列出当前目录下的所有文件和文件夹，以确保所有东西都已复制
RUN ls -la
# 或者使用 RUN find . -type f 来列出所有文件，如果需要更详细的输出

# 构建应用的命令也可以暂时注释掉，因为此时我们只检查文件
# RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .
