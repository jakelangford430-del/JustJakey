# Production image: static Just Jakey site served by nginx.
# Spaceship (or any host) can set $PORT; defaults to 80.
FROM nginx:alpine

ENV PORT=80

# nginx:alpine renders /etc/nginx/templates/*.template with envsubst at start-up
# (only defined env vars like ${PORT} are replaced; nginx $variables are left alone).
RUN rm -f /etc/nginx/conf.d/default.conf
COPY docker/default.conf.template /etc/nginx/templates/default.conf.template
COPY docker/security-headers.conf /etc/nginx/snippets/security-headers.conf

COPY . /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- "http://127.0.0.1:${PORT}/" >/dev/null || exit 1
