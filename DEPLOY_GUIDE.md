# Guia de Deploy - Postumos.com

Este guia detalha o processo completo de deploy da plataforma Postumos no cPanel via FTP.

## Pré-requisitos

- Acesso ao cPanel do servidor
- Cliente FTP (FileZilla, WinSCP ou similar)
- Node.js 18+ instalado no servidor (verificar com provedor de hospedagem)
- MySQL/MariaDB disponível no servidor

## Passo 1: Configurar Domínio Adicional no cPanel

1. Acesse o cPanel: `http://querocomprarmeuconsorcio.com.br/cpanel`
2. Faça login com as credenciais fornecidas
3. Procure por "Domínios Adicionais" ou "Addon Domains"
4. Adicione o domínio `postumos.com`:
   - **Novo Nome de Domínio**: `postumos.com`
   - **Subdomínio/Nome FTP**: `postumos` (será criado automaticamente)
   - **Raiz do Documento**: `public_html/postumos` (ou conforme preferência)
5. Clique em "Adicionar Domínio"

## Passo 2: Criar Banco de Dados MySQL

1. No cPanel, vá em "Bancos de Dados MySQL"
2. Crie um novo banco de dados:
   - Nome sugerido: `postumos_db`
3. Crie um novo usuário MySQL:
   - Nome de usuário: `postumos_user`
   - Senha: (crie uma senha forte e anote)
4. Adicione o usuário ao banco de dados com TODOS OS PRIVILÉGIOS

**Anote as seguintes informações:**
- Nome do banco: `[prefixo]_postumos_db`
- Usuário: `[prefixo]_postumos_user`
- Senha: `[sua_senha]`
- Host: `localhost` (geralmente)

## Passo 3: Conectar via FTP

1. Abra seu cliente FTP (FileZilla, WinSCP, etc.)
2. Configure a conexão:
   - **Host**: `ftp.querocomprarmeuconsorcio.com.br` ou IP do servidor
   - **Usuário**: `querocomprarmeuc`
   - **Senha**: `#umhb5958Jcy$+Uu`
   - **Porta**: 21 (FTP) ou 22 (SFTP, se disponível)
3. Conecte-se ao servidor

## Passo 4: Upload dos Arquivos

1. Navegue até o diretório do domínio adicional:
   - Geralmente: `/public_html/postumos/`
   
2. Faça upload dos seguintes arquivos/pastas:
   ```
   dist/           (pasta completa com arquivos compilados)
   package.json
   drizzle/        (pasta com schema do banco de dados)
   ```

3. Aguarde o upload completar (pode levar alguns minutos)

## Passo 5: Configurar Variáveis de Ambiente

1. No diretório raiz do projeto (`/public_html/postumos/`), crie um arquivo `.env`
2. Adicione as seguintes variáveis (ajuste conforme necessário):

```env
# Banco de Dados
DATABASE_URL=mysql://[usuario]:[senha]@localhost:3306/[nome_banco]

# Exemplo:
# DATABASE_URL=mysql://postumos_user:SuaSenhaAqui@localhost:3306/postumos_db

# JWT Secret (gere uma string aleatória longa)
JWT_SECRET=sua_chave_secreta_jwt_muito_longa_e_aleatoria

# OAuth (se aplicável - configurar depois)
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im

# App Info
VITE_APP_TITLE=Postumos - Rede Social de Memória
VITE_APP_LOGO=/favicon.png

# Owner Info (seu email/nome)
OWNER_OPEN_ID=seu_id
OWNER_NAME=Seu Nome
```

**IMPORTANTE**: Substitua os valores entre `[colchetes]` pelas informações reais do seu banco de dados.

## Passo 6: Instalar Dependências no Servidor

**Via SSH (se disponível):**

```bash
cd /home/[usuario]/public_html/postumos
npm install --production
```

**Alternativa (se não tiver SSH):**
- Instale as dependências localmente
- Faça upload da pasta `node_modules` via FTP (pode demorar bastante)

## Passo 7: Executar Migrações do Banco de Dados

Via SSH:

```bash
cd /home/[usuario]/public_html/postumos
npx drizzle-kit generate
npx drizzle-kit migrate
```

Isso criará todas as tabelas necessárias no banco de dados.

## Passo 8: Configurar Processo Node.js

### Opção A: Usando PM2 (Recomendado)

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar a aplicação
cd /home/[usuario]/public_html/postumos
pm2 start dist/index.js --name postumos

# Configurar para iniciar automaticamente
pm2 startup
pm2 save
```

### Opção B: Usando cPanel Node.js Selector

1. No cPanel, procure por "Setup Node.js App" ou "Node.js Selector"
2. Clique em "Create Application"
3. Configure:
   - **Node.js version**: 18.x ou superior
   - **Application mode**: Production
   - **Application root**: `postumos`
   - **Application URL**: `postumos.com`
   - **Application startup file**: `dist/index.js`
4. Clique em "Create"

## Passo 9: Configurar .htaccess (se necessário)

Se estiver usando Apache, crie/edite o arquivo `.htaccess` na raiz do domínio:

```apache
# Redirecionar todo tráfego para Node.js
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
```

**Nota**: Ajuste a porta `3000` conforme configurado na aplicação.

## Passo 10: Testar a Aplicação

1. Acesse `https://postumos.com` no navegador
2. Verifique se a página inicial carrega corretamente
3. Teste criar uma conta e um perfil memorial
4. Verifique upload de fotos e mensagens

## Solução de Problemas Comuns

### Erro de Conexão com Banco de Dados

- Verifique se o `DATABASE_URL` está correto
- Confirme que o usuário MySQL tem permissões corretas
- Teste a conexão usando phpMyAdmin no cPanel

### Página em Branco ou Erro 500

- Verifique os logs de erro do Node.js
- Confirme que todas as dependências foram instaladas
- Verifique permissões dos arquivos (755 para pastas, 644 para arquivos)

### Arquivos Estáticos Não Carregam

- Verifique se a pasta `dist/public` foi enviada corretamente
- Confirme que o servidor está servindo arquivos estáticos da pasta correta

### Node.js Não Inicia

- Verifique a versão do Node.js instalada (`node --version`)
- Confirme que o arquivo `dist/index.js` existe
- Verifique logs de erro no cPanel ou via SSH

## Manutenção

### Atualizar a Aplicação

1. Faça backup do banco de dados
2. Faça upload dos novos arquivos via FTP
3. Reinicie o processo Node.js:
   ```bash
   pm2 restart postumos
   ```
   ou use o botão "Restart" no cPanel Node.js Selector

### Backup

- **Banco de Dados**: Use phpMyAdmin para exportar regularmente
- **Arquivos**: Faça backup da pasta `postumos` via FTP
- **Fotos**: As fotos são armazenadas no S3, mas mantenha backup das URLs no banco

## Suporte

Para questões técnicas ou problemas durante o deploy:
- Consulte a documentação do seu provedor de hospedagem
- Verifique os logs de erro do servidor
- Entre em contato com o suporte técnico da hospedagem

---

**Versão do Guia**: 1.0  
**Data**: Dezembro 2024  
**Plataforma**: Postumos - Rede Social de Memória
