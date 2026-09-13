# ==============================================================================
# AgroBey - Dockerfile de Production Ultra-Léger (< 25 Mo)
# ==============================================================================
FROM nginx:alpine

# Métadonnées du Conteneur
LABEL maintainer="AgroBey Technologies <contact@agrobey.sn>"
LABEL version="1.3.0"
LABEL description="Plateforme AgroBey en production avec Nginx sécurisé"

# Suppression de la configuration Nginx par défaut
RUN rm -rf /etc/nginx/conf.d/* /etc/nginx/nginx.conf /usr/share/nginx/html/*

# Copie de la configuration personnalisée Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copie des fichiers applicatifs statiques AgroBey
COPY . /usr/share/nginx/html/

# Nettoyage des fichiers de développement superflus dans l'image
RUN rm -rf /usr/share/nginx/html/Dockerfile \
           /usr/share/nginx/html/docker-compose.yml \
           /usr/share/nginx/html/nginx.conf \
           /usr/share/nginx/html/.git \
           /usr/share/nginx/html/.env.example

# Droits de lecture pour l'utilisateur Nginx
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Exposition du port HTTP
EXPOSE 80

# Healthcheck de surveillance
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
