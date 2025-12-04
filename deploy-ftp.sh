#!/bin/bash

# Script de Deploy via FTP para Postumos.com
# Este script faz upload dos arquivos para o servidor via FTP

FTP_HOST="ftp.querocomprarmeuconsorcio.com.br"
FTP_USER="querocomprarmeuc"
FTP_PASS="#umhb5958Jcy\$+Uu"
REMOTE_DIR="/public_html/postumos"

echo "========================================="
echo "Deploy Postumos.com via FTP"
echo "========================================="
echo ""

# Verificar se lftp está instalado
if ! command -v lftp &> /dev/null; then
    echo "Erro: lftp não está instalado"
    exit 1
fi

echo "1. Conectando ao servidor FTP..."
echo "   Host: $FTP_HOST"
echo "   Usuário: $FTP_USER"
echo ""

# Criar diretório remoto se não existir e fazer upload
lftp -c "
set ftp:ssl-allow no
set net:timeout 30
set net:max-retries 3
set net:reconnect-interval-base 5
open -u $FTP_USER,$FTP_PASS $FTP_HOST
echo 'Conectado ao servidor FTP'
mkdir -p $REMOTE_DIR
cd $REMOTE_DIR
echo 'Criando estrutura de diretórios...'
mkdir -p dist
mkdir -p drizzle
echo 'Fazendo upload de package.json...'
put package.json
echo 'Fazendo upload da pasta dist/...'
mirror -R --verbose dist/ dist/
echo 'Fazendo upload da pasta drizzle/...'
mirror -R --verbose drizzle/ drizzle/
echo 'Upload concluído!'
bye
"

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================="
    echo "✅ Deploy concluído com sucesso!"
    echo "========================================="
    echo ""
    echo "Próximos passos:"
    echo "1. Configurar variáveis de ambiente (.env) no servidor"
    echo "2. Criar banco de dados MySQL no cPanel"
    echo "3. Executar migrações do banco de dados"
    echo "4. Instalar dependências (npm install --production)"
    echo "5. Iniciar aplicação Node.js"
    echo ""
    echo "Consulte DEPLOY_GUIDE.md para instruções detalhadas"
else
    echo ""
    echo "========================================="
    echo "❌ Erro durante o deploy"
    echo "========================================="
    exit 1
fi
