# # 使用官方的 Node 作为基础镜像
# FROM node:14 AS build

# # 设置工作目录
# WORKDIR /app

# # 复制 package.json 和 package-lock.json 并安装依赖
# COPY package*.json ./
# RUN npm install

# # 复制源代码并构建应用程序
# COPY . .
# RUN npm run build

# # 复制 Nginx 配置文件和启动脚本
# COPY nginx.conf /etc/nginx/nginx.conf
# COPY start.sh /usr/local/bin/

# # 设置启动脚本可执行权限
# RUN chmod +x /usr/local/bin/start.sh

# # 复制构建的静态文件到 Nginx 的默认公共目录
# COPY --from=build /app/build /usr/share/nginx/html

# # 暴露 Nginx 默认端口
# EXPOSE 8080

# # 使用启动脚本启动 Nginx 服务器
# CMD ["start.sh"]

                                                                
#使用官方的 Node 作为基础镜像
FROM node:14 AS build

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json 并安装依赖
COPY package*.json ./
RUN npm install

# 复制源代码并构建应用程序
COPY . .

EXPOSE 3000
CMD ["sh", "-c", "HOST=0.0.0.0 npm start"]