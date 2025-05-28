########################################
# 1️⃣  Etapa de BUILD                  #
########################################
FROM node:20-alpine AS build

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos sólo los manifests para aprovechar cache
COPY package*.json ./

# Instalamos dependencias exactas
RUN npm ci --omit=dev

# Copiamos el resto del código fuente
COPY . .

# Compilamos en modo producción (ajusta el nombre del proyecto si hace falta)
# Si tu proyecto se llama distinto, usa: npm run build -- --configuration production --output-path=dist
RUN npx ng build --configuration production

########################################
# 2️⃣  Etapa de RUNTIME (Nginx)        #
########################################
FROM nginx:1.25-alpine AS runtime

# Copiamos el build Angular al doc-root de Nginx
# ⚠️ Ajusta 'dist/LOQUESEA' al nombre real de tu proyecto dentro de 'dist/'
COPY --from=build /app/dist /usr/share/nginx/html

# Opcional: configuración SPA para rutas profundas (try_files … index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
