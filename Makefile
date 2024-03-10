# Makefile

# 变量
GOLANG_VERSION=1.20
PYTHON_IMAGE=python:3.9
BACKEND_DIR=./BackEnd
UTIL_DIR=./BackEnd/util

# 构建Go应用
build-go:
	cd $(BACKEND_DIR) && go build -o main .

# 运行Go应用
run-go: build-go
	cd $(BACKEND_DIR) && ./main

# 运行Python脚本
run-python:
	cd $(UTIL_DIR) && python3 ./quickstart.py

# Docker：构建Go应用的Docker镜像
docker-build-go:
	docker build --build-arg GOLANG_VERSION=$(GOLANG_VERSION) -t go-app -f Dockerfile.go .

# Docker：运行Go应用容器
docker-run-go:
	docker run --rm -d -p 8080:8080 --name go-app go-app

# Docker：运行Python脚本容器
docker-run-python:
	docker run --rm -v "$(PWD)/$(UTIL_DIR):/app" -w "/app" $(PYTHON_IMAGE) python3 ./quickstart.py

# 默认目标
.PHONY: build-go run-go run-python docker-build-go docker-run-go docker-run-python
