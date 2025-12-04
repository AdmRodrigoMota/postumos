# Guia Completo de Deploy - Postumos.com no Railway.app

## Pré-requisitos
- Conta GitHub (você já tem ✅)
- Conta Railway.app (gratuita - vamos criar)
- Domínio postumos.com (você já tem ✅)

---

## Passo 1: Preparar Repositório GitHub

### 1.1 Criar novo repositório no GitHub
1. Acesse https://github.com/new
2. Nome do repositório: `postumos`
3. Visibilidade: **Private** (recomendado)
4. **NÃO** inicialize com README, .gitignore ou licença
5. Clique em "Create repository"

### 1.2 Fazer push do código
Abra o terminal na pasta do projeto e execute:

```bash
cd /caminho/para/postmus
git init
git add .
git commit -m "Initial commit - Postumos.com"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/postumos.git
git push -u origin main
```

---

## Passo 2: Criar Conta no Railway.app

1. Acesse https://railway.app
2. Clique em "Login"
3. Escolha "Login with GitHub"
4. Autorize o Railway a acessar sua conta GitHub
5. Você receberá $5 de crédito gratuito (suficiente para começar)

---

## Passo 3: Criar Projeto no Railway

### 3.1 Novo Projeto
1. No dashboard do Railway, clique em "New Project"
2. Escolha "Deploy from GitHub repo"
3. Selecione o repositório `postumos`
4. Railway começará o deploy automaticamente

### 3.2 Adicionar Banco de Dados MySQL
1. No projeto, clique em "+ New"
2. Escolha "Database"
3. Selecione "MySQL"
4. Railway criará automaticamente um banco MySQL

---

## Passo 4: Configurar Variáveis de Ambiente

### 4.1 Conectar ao Banco de Dados
1. Clique no serviço MySQL
2. Vá na aba "Variables"
3. Copie a variável `DATABASE_URL`

### 4.2 Configurar Aplicação
1. Clique no serviço `postumos` (sua aplicação)
2. Vá na aba "Variables"
3. Clique em "Raw Editor"
4. Cole as seguintes variáveis:

```env
# Database (copie do serviço MySQL)
DATABASE_URL=mysql://root:SENHA@MYSQL_HOST:3306/railway

# JWT Secret (gere uma senha forte aleatória)
JWT_SECRET=sua-senha-super-secreta-aqui-minimo-32-caracteres

# Application
NODE_ENV=production
PORT=3000
VITE_APP_TITLE=Postumos
VITE_APP_LOGO=/favicon.png
```

5. Clique em "Save Changes"

---

## Passo 5: Executar Migrações do Banco

### 5.1 Acessar Terminal do Railway
1. No serviço `postumos`, clique na aba "Deployments"
2. Clique no deployment mais recente
3. Clique em "View Logs"
4. No menu superior, clique em "Terminal"

### 5.2 Executar Comandos
No terminal, execute:

```bash
pnpm db:push
```

Isso criará todas as tabelas no banco de dados.

---

## Passo 6: Configurar Domínio postumos.com

### 6.1 Gerar Domínio Railway
1. No serviço `postumos`, vá na aba "Settings"
2. Role até "Domains"
3. Clique em "Generate Domain"
4. Railway gerará um domínio tipo: `postumos-production.up.railway.app`
5. Teste acessando esse domínio para ver se está funcionando

### 6.2 Adicionar Domínio Customizado
1. Na mesma seção "Domains", clique em "Custom Domain"
2. Digite: `postumos.com`
3. Railway mostrará os registros DNS necessários

### 6.3 Configurar DNS no Registro.br (ou onde está seu domínio)
1. Acesse o painel do seu provedor de domínio
2. Vá em "Gerenciar DNS" ou "DNS Settings"
3. Adicione os registros que o Railway mostrou:

**Tipo A:**
- Nome: `@`
- Valor: (IP fornecido pelo Railway)

**Tipo CNAME:**
- Nome: `www`
- Valor: (domínio fornecido pelo Railway)

4. Salve as alterações
5. Aguarde propagação DNS (5 minutos a 48 horas, geralmente 1-2 horas)

---

## Passo 7: Verificar Deploy

### 7.1 Testar Aplicação
1. Acesse `https://postumos.com` (após propagação DNS)
2. Crie um perfil memorial de teste
3. Teste upload de fotos
4. Teste mural de mensagens

### 7.2 Monitorar Logs
1. No Railway, vá na aba "Deployments"
2. Clique no deployment ativo
3. Monitore os logs para verificar erros

---

## Custos e Limites

### Plano Gratuito Railway
- $5 de crédito inicial
- ~500 horas de execução/mês
- Suficiente para começar e testar

### Quando Precisar Pagar
- Após usar os $5 iniciais
- Plano Hobby: $5/mês
- Plano Pro: $20/mês (para produção)

---

## Solução de Problemas

### Erro: "Cannot connect to database"
- Verifique se a variável `DATABASE_URL` está correta
- Confirme que o serviço MySQL está rodando

### Erro: "Module not found"
- Execute `pnpm install` no terminal do Railway
- Faça novo deploy

### Site não carrega após configurar domínio
- Aguarde propagação DNS (até 48h)
- Verifique registros DNS no provedor
- Use https://dnschecker.org para verificar propagação

---

## Backup e Manutenção

### Backup do Banco de Dados
1. No serviço MySQL, vá em "Data"
2. Clique em "Backup"
3. Railway faz backups automáticos diários

### Atualizar Código
```bash
git add .
git commit -m "Descrição da alteração"
git push
```

Railway fará deploy automático após cada push!

---

## Suporte

- Documentação Railway: https://docs.railway.app
- Discord Railway: https://discord.gg/railway
- GitHub Issues: Crie issues no seu repositório

---

## Resumo dos Passos

✅ 1. Criar repositório GitHub e fazer push do código
✅ 2. Criar conta no Railway.app
✅ 3. Criar projeto e adicionar MySQL
✅ 4. Configurar variáveis de ambiente
✅ 5. Executar migrações do banco
✅ 6. Configurar domínio postumos.com
✅ 7. Testar e monitorar

**Tempo estimado:** 30-60 minutos
**Dificuldade:** Média
**Custo inicial:** Gratuito ($5 de crédito)

---

Boa sorte com o deploy! 🚀
