import { Heart } from "lucide-react";
import { Link } from "wouter";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <Heart className="h-6 w-6 text-primary" />
              <span className="text-xl font-semibold text-foreground">Postumos</span>
            </div>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Início
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-4">Política de Privacidade</h1>
              <p className="text-sm text-muted-foreground">Última atualização: Dezembro de 2024</p>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">1. Introdução</h2>
                <p className="text-muted-foreground leading-relaxed">
                  O Postumos ("nós", "nosso" ou "plataforma") está comprometido em proteger a privacidade e segurança das informações pessoais de nossos usuários. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações ao utilizar nossa plataforma de memórias digitais.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">2. Informações que Coletamos</h2>
                
                <h3 className="text-xl font-semibold text-foreground mb-2">2.1 Informações Fornecidas por Você</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Ao criar uma conta e perfis memoriais, coletamos:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li>Nome e informações de contato (e-mail)</li>
                  <li>Informações sobre entes queridos falecidos (nome, datas, biografia)</li>
                  <li>Fotografias e imagens enviadas</li>
                  <li>Mensagens e tributos publicados</li>
                </ul>

                <h3 className="text-xl font-semibold text-foreground mb-2">2.2 Informações Coletadas Automaticamente</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Quando você utiliza nossa plataforma, coletamos automaticamente:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Endereço IP e informações do dispositivo</li>
                  <li>Tipo de navegador e sistema operacional</li>
                  <li>Páginas visitadas e tempo de navegação</li>
                  <li>Cookies e tecnologias similares</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">3. Como Usamos Suas Informações</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Utilizamos as informações coletadas para:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Fornecer e manter os serviços da plataforma</li>
                  <li>Criar e gerenciar perfis memoriais</li>
                  <li>Permitir o compartilhamento de memórias e tributos</li>
                  <li>Melhorar a experiência do usuário e funcionalidades</li>
                  <li>Enviar notificações importantes sobre a plataforma</li>
                  <li>Proteger contra uso indevido e garantir a segurança</li>
                  <li>Cumprir obrigações legais</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">4. Compartilhamento de Informações</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Não vendemos suas informações pessoais. Podemos compartilhar informações apenas nas seguintes circunstâncias:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li><strong>Com seu consentimento:</strong> Quando você autoriza expressamente</li>
                  <li><strong>Perfis públicos:</strong> Informações em perfis memoriais são visíveis publicamente conforme configurado</li>
                  <li><strong>Prestadores de serviços:</strong> Com empresas que nos auxiliam na operação da plataforma (hospedagem, armazenamento)</li>
                  <li><strong>Requisitos legais:</strong> Quando exigido por lei ou ordem judicial</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">5. Armazenamento e Segurança</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição. Isso inclui criptografia de dados, controles de acesso e monitoramento regular de segurança.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Suas informações são armazenadas em servidores seguros e mantidas pelo tempo necessário para fornecer os serviços ou conforme exigido por lei.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">6. Seus Direitos</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Você tem direito a:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Acessar suas informações pessoais</li>
                  <li>Corrigir dados incorretos ou desatualizados</li>
                  <li>Solicitar a exclusão de suas informações</li>
                  <li>Revogar consentimentos previamente dados</li>
                  <li>Exportar seus dados em formato legível</li>
                  <li>Opor-se ao processamento de seus dados</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Para exercer esses direitos, entre em contato conosco através dos canais disponíveis na plataforma.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">7. Cookies</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Utilizamos cookies e tecnologias similares para melhorar sua experiência, manter sessões de login e analisar o uso da plataforma. Você pode configurar seu navegador para recusar cookies, mas isso pode afetar algumas funcionalidades.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">8. Menores de Idade</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Nossa plataforma não é direcionada a menores de 18 anos. Não coletamos intencionalmente informações de menores sem o consentimento dos pais ou responsáveis legais.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">9. Alterações nesta Política</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre mudanças significativas através da plataforma ou por e-mail. O uso continuado após as alterações constitui aceitação da nova política.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">10. Contato</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Para questões sobre esta Política de Privacidade ou sobre o tratamento de seus dados pessoais, entre em contato através da plataforma ou pelos canais de suporte disponíveis.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2024 Postumos. Preservando memórias com respeito e dignidade.
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                Sobre Nós
              </Link>
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacidade
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
