# Makefile

# 变量
DOCKER_COMPOSE_CMD = docker-compose
DOCKER_COMPOSE_FILE = BackEnd/Docker-compose.yml
SERVICE_NAME = backend  # 如果你有不同的服务名，请更改这里

# 定义 'run' 目标
run:
	$(DOCKER_COMPOSE_CMD) -f $(DOCKER_COMPOSE_FILE) build $(SERVICE_NAME)
	$(DOCKER_COMPOSE_CMD) -f $(DOCKER_COMPOSE_FILE) up -d $(SERVICE_NAME)

# 使用docker-compose构建服务
docker-compose-build:
	$(DOCKER_COMPOSE) build $(SERVICE_NAME)

# 使用docker-compose启动服务
docker-compose-up:
	$(DOCKER_COMPOSE) up -d $(SERVICE_NAME)

# 使用docker-compose停止服务
docker-compose-down:
	$(DOCKER_COMPOSE) down

# 查看服务日志
docker-compose-logs:
	$(DOCKER_COMPOSE) logs $(SERVICE_NAME)

# 默认目标
.PHONY: docker-compose-build docker-compose-up docker-compose-down docker-compose-logs