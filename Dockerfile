FROM node:14.16-alpine3.13 as builder
WORKDIR /app
COPY ./package.json ./package-lock.json ./
RUN npm --registry https://registry.npmmirror.com/ install
COPY . .
RUN npm run-script ng build -- --prod
FROM nginx:1.21.0-alpine as runner
COPY --from=builder /app/dist/license-front /usr/share/nginx/html
COPY ./nginx-backend.conf /etc/nginx/templates/default.conf.template
# 创建 myuser 用户
RUN apk update\
    && apk add shadow
RUN mkdir -p /var/cache/nginx/client_temp \
    /var/cache/nginx/fastcgi_temp \
    /var/cache/nginx/proxy_temp \
    /var/cache/nginx/uwsgi_temp \
    /var/cache/nginx/scgi_temp
RUN groupadd --gid 5000 newuser \
    && chown -R newuser:newuser /var/cache/nginx \
    && chmod -R 755 /var/cache/nginx \
    && useradd --home-dir /home/newuser --create-home --uid 5000 \
        --gid 5000 --shell /bin/sh --skel /dev/null newuser
# 切换到 myuser 用户
USER newuser