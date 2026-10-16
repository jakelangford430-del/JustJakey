# Production image: static Just Jakey site served by nginx.
# Listens on 8080 (Spaceship Hyperlift's APPLICATION_PORT) and 80.
# Plain config, no envsubst templates (Hyperlift's environment breaks the template step).
FROM nginx:alpine

RUN rm -f /etc/nginx/conf.d/default.conf /docker-entrypoint.d/20-envsubst-on-templates.sh
COPY docker/default.conf /etc/nginx/conf.d/default.conf
COPY docker/security-headers.conf /etc/nginx/snippets/security-headers.conf

COPY . /usr/share/nginx/html

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- "http://127.0.0.1:8080/" >/dev/null || exit 1
