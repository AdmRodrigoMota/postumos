#!/bin/bash

# Deploy Postumos.com via FTP
# Diretório de destino: /home/querocomprarmeuc/postumos.com

echo "Iniciando deploy via FTP para postumos.com..."

lftp -u querocomprarmeuc,'#umhb5958Jcy$+Uu' ftp://querocomprarmeuconsorcio.com.br <<EOF
set ftp:ssl-allow no
set net:timeout 30
set net:max-retries 3

# Criar diretório se não existir
mkdir -p /home/querocomprarmeuc/postumos.com

# Limpar diretório de destino
cd /home/querocomprarmeuc/postumos.com
rm -rf *

# Upload de todos os arquivos do projeto
lcd /home/ubuntu/postmus
mirror -R --verbose --exclude .git --exclude node_modules/.vite --exclude .env . /home/querocomprarmeuc/postumos.com

bye
EOF

echo "✅ Deploy concluído!"
echo "Arquivos enviados para: /home/querocomprarmeuc/postumos.com"
