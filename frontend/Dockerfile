# 使用node的官方镜像作为基础镜像
FROM node:16

# 设置工作目录
WORKDIR /usr/src/app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制所有文件到工作目录
COPY . .

# 构建应用
RUN npm run build

# 暴露端口3000
EXPOSE 3000

# 运行nginx服务器，服务于构建的静态文件
CMD ["npm", "start"]
