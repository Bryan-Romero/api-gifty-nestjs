###################
# BASE
###################
FROM node:18-alpine AS base

ENV DIR=/usr/src/app

WORKDIR $DIR

###################
# BUILD FOR PRODUCTION
###################
FROM base AS build

RUN apk update && apk add --no-cache dumb-init
# apk update actualiza el índice de paquetes de Alpine.
# apk add --no-cache dumb-init instala dumb-init sin guardar caché.
# Así puedes usar dumb-init como entrypoint para tu app Node.js y mejorar el manejo de procesos dentro del contenedor.

COPY package*.json $DIR
COPY tsconfig*.json $DIR
COPY src $DIR/src
COPY static $DIR/static
COPY .env.* $DIR

RUN npm ci
# Es más rápido y confiable para entornos de integración continua y producción.
# Elimina la carpeta node_modules antes de instalar, asegurando una instalación limpia.

RUN npm run build && \
    npm prune --production
# npm run build 
    # normalmente transpila tu código TypeScript a JavaScript y lo coloca en la carpeta dist.
# npm prune --production
    # Elimina del directorio node_modules todos los paquetes que están listados como devDependencies en tu package.json.
    # Deja solo las dependencias necesarias para producción.
    # Esto reduce el tamaño de la imagen y mejora la seguridad y el rendimiento.


###################
# PRODUCTION
###################
FROM base AS production

ARG PORT
ENV PORT=$PORT

# Valor por defecto, pero puede ser sobrescrito por Compose
ENV NODE_ENV=production
# El usuario node ya existe en las imágenes oficiales de Node.js y es un usuario sin privilegios de root.
ENV USER=node

COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=build $DIR/node_modules $DIR/node_modules
COPY --from=build $DIR/dist $DIR/dist
COPY --from=build $DIR/static $DIR/static
COPY --from=build $DIR/package*.json $DIR

EXPOSE ${PORT}

# Aquí, ${USER} se expande a node, así que tu aplicación no se ejecuta como root, sino como el usuario seguro node.
USER ${USER}

CMD ["dumb-init", "npm", "run", "start:prod:docker" ]