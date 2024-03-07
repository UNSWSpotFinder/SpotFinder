# 定义变量
APP_NAME=spotfinder-backend
PORT=8080

# 构建Docker镜像
build:
	docker build -t $(APP_NAME) .

# 运行Docker容器
run: build
	docker run -d -p $(PORT):$(PORT) $(APP_NAME)

# 停止并删除容器
stop:
	docker stop $(shell docker ps -q --filter ancestor=$(APP_NAME))
	docker rm $(shell docker ps -a -q --filter ancestor=$(APP_NAME))

# 组合命令，构建并运行容器
up: run

# 停止并删除容器的快捷方式
down: stop

# 清除构建的Docker镜像
clean:
	docker rmi $(APP_NAME)

# 声明伪目标
.PHONY: build run stop up down clean
