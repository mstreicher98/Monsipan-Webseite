# 1) Statische Seite bauen – läuft immer auf der Plattform des Build-Rechners,
#    das Ergebnis (HTML, CSS, Bilder) ist plattformunabhängig
FROM --platform=$BUILDPLATFORM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# 2) Ausliefern mit Apache + PHP (PHP nur für das Kontaktformular)
FROM php:8.3-apache
COPY docker/apache-monsipan.conf /etc/apache2/conf-enabled/zz-monsipan.conf
RUN a2enmod rewrite headers expires deflate remoteip \
 && sed -ri 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf \
 && mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini" \
 && echo 'expose_php = Off' > "$PHP_INI_DIR/conf.d/zz-monsipan.ini"
COPY --from=build /app/dist/ /var/www/html/
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s CMD php -r "exit(@file_get_contents('http://localhost/') === false ? 1 : 0);"
CMD ["apache2-foreground", "-DDOCKER"]
