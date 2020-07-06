FROM  nginx:alpine
COPY  nginx.conf /etc/nginx/nginx.conf
COPY  default.conf /etc/nginx/conf.d/default.conf
COPY  build /ai
# COPY  Devex.html /devops
EXPOSE 80