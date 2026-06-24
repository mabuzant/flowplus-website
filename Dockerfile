FROM nginx:1.27-alpine

COPY index.html founder.html brand-guidelines.html image-slot.js /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets
COPY css /usr/share/nginx/html/css
COPY js /usr/share/nginx/html/js

RUN printf 'server {\n\
  listen       $PORT;\n\
  server_name  _;\n\
  root         /usr/share/nginx/html;\n\
  index        index.html;\n\
  location / { try_files $uri $uri/ /index.html; }\n\
}\n' > /etc/nginx/conf.d/default.conf.template

CMD ["/bin/sh", "-c", "envsubst '${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
