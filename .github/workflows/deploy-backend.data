name: Deploy Laravel (Selectivo)
on:
  push:
    paths:
      - 'apirest/app/**'
      - 'apirest/database/**'
      - 'apirest/public/**'
      - 'apirest/routes/**'
    branches:
      - main

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:      
      - name: Diagnóstico de Red
        run: |
          echo "Probando conexión a ${{ secrets.SSH_HOST }}..."
          # Intentamos conectar al puerto 22
          nc -zv -w 10 ${{ secrets.SSH_HOST }} 22 || (echo "PUERTO CERRADO" && exit 1)
      
      - name: Checkout del código
        uses: actions/checkout@v3

      - name: Sincronizar Carpetas Específicas
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          port: 22
          timeout: 60s
          command_timeout: 10m
          # Fuente de los archivos
          source: "apirest/app,apirest/database,apirest/public,apirest/routes"
          target: "/var/www/incodelpa/"
          strip_components: 0 # Mantiene la carpeta 'apirest' en el destino

      - name: Optimización post-deploy
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            # Verificar si existe el directorio antes de entrar
            if [ -d "/var/www/incodelpa/apirest" ]; then
              cd /var/www/incodelpa/apirest
              php artisan config:cache
              php artisan route:cache
            else
              echo "Error: El directorio /var/www/incodelpa/apirest no existe."
              exit 1
            fi