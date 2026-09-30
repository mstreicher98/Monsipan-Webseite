# 1) Statische Seite bauen
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# 2) Ausliefern mit Apache + PHP (PHP nur für das Kontaktformular)
FROM php:8.3-apache
RUN a2enmod rewrite headers expires deflate \
 && sed -ri 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf \
 && printf 'ServerTokens Prod\nServerSignature Off\n' > /etc/apache2/conf-enabled/zz-security.conf \
 && mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini" \
 && echo 'expose_php = Off' > "$PHP_INI_DIR/conf.d/zz-monsipan.ini"
COPY --from=build /app/dist/ /var/www/html/
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s CMD php -r "exit(@file_get_contents('http://localhost/') === false ? 1 : 0);"
CMD ["apache2-foreground", "-DDOCKER"]
