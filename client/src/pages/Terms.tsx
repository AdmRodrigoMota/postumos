import { Heart } from "lucide-react";
import { Link } from "wouter";

export default function Terms() {
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
              <h1 className="text-4xl font-bold text-foreground mb-4">Termos de Uso</h1>
              <p className="text-sm text-muted-foreground">Última atualização: Dezembro de 2024</p>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">1. Aceitação dos Termos</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Ao acessar e utilizar a plataforma Postumos ("Plataforma", "Serviço", "nós" ou "nosso"), você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concorda com qualquer parte destes termos, não deve utilizar nossa plataforma.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">2. Descrição do Serviço</h2>
                <p className="text-muted-foreground leading-relaxed">
                  O Postumos é uma plataforma digital que permite aos usuários criar perfis memoriais permanentes para homenagear entes queridos falecidos. Os serviços incluem:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                  <li>Criação e gerenciamento de perfis memoriais</li>
                  <li>Upload e compartilhamento de fotografias</li>
                  <li>Publicação de biografias e histórias</li>
                  <li>Mural de mensagens e tributos</li>
                  <li>Compartilhamento de perfis em redes sociais</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">3. Registro e Conta de Usuário</h2>
                
                <h3 className="text-xl font-semibold text-foreground mb-2">3.1 Elegibilidade</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Você deve ter pelo menos 18 anos de idade para criar uma conta. Ao se registrar, você declara que todas as informações fornecidas são verdadeiras e precisas.
                </p>

                <h3 className="text-xl font-semibold text-foreground mb-2">3.2 Responsabilidade da Conta</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Você é responsável por manter a confidencialidade de suas credenciais de acesso e por todas as atividades realizadas em sua conta. Notifique-nos imediatamente sobre qualquer uso não autorizado.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">4. Conteúdo do Usuário</h2>
                
                <h3 className="text-xl font-semibold text-foreground mb-2">4.1 Propriedade</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Você mantém todos os direitos sobre o conteúdo que publica (textos, fotos, biografias). Ao publicar, você nos concede uma licença não exclusiva para exibir, armazenar e distribuir esse conteúdo na plataforma.
                </p>

                <h3 className="text-xl font-semibold text-foreground mb-2">4.2 Responsabilidade pelo Conteúdo</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Você é o único responsável pelo conteúdo que publica e deve garantir que:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li>Possui os direitos necessários sobre fotos e textos</li>
                  <li>O conteúdo não viola direitos de terceiros</li>
                  <li>As informações são verdadeiras e precisas</li>
                  <li>O conteúdo é respeitoso e apropriado</li>
                </ul>

                <h3 className="text-xl font-semibold text-foreground mb-2">4.3 Conteúdo Proibido</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  É estritamente proibido publicar conteúdo que:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Seja ofensivo, difamatório ou desrespeitoso</li>
                  <li>Viole direitos autorais ou propriedade intelectual</li>
                  <li>Contenha informações falsas ou enganosas</li>
                  <li>Promova atividades ilegais</li>
                  <li>Contenha vírus ou códigos maliciosos</li>
                  <li>Viole a privacidade de terceiros</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">5. Moderação e Remoção de Conteúdo</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Reservamo-nos o direito de revisar, moderar, editar ou remover qualquer conteúdo que viole estes Termos ou que consideremos inadequado, a nosso exclusivo critério. Criadores de perfis memoriais podem moderar mensagens deixadas em seus perfis.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">6. Privacidade e Proteção de Dados</h2>
                <p className="text-muted-foreground leading-relaxed">
                  O uso de suas informações pessoais é regido por nossa Política de Privacidade. Ao utilizar a plataforma, você concorda com a coleta e uso de informações conforme descrito naquela política.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">7. Permanência dos Perfis</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Comprometemo-nos a manter os perfis memoriais de forma permanente. No entanto, reservamo-nos o direito de remover perfis que violem estes Termos ou em caso de encerramento da plataforma, mediante aviso prévio adequado.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">8. Uso Aceitável</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Ao utilizar a plataforma, você concorda em:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Usar a plataforma apenas para fins legítimos de memorial</li>
                  <li>Não tentar acessar áreas restritas ou contas de outros usuários</li>
                  <li>Não interferir com o funcionamento da plataforma</li>
                  <li>Não usar a plataforma para spam ou marketing não autorizado</li>
                  <li>Respeitar outros usuários e seus memoriais</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">9. Propriedade Intelectual</h2>
                <p className="text-muted-foreground leading-relaxed">
                  A plataforma Postumos, incluindo seu design, código, logotipo e funcionalidades, é protegida por direitos autorais e outras leis de propriedade intelectual. Você não pode copiar, modificar ou distribuir qualquer parte da plataforma sem autorização expressa.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">10. Isenção de Garantias</h2>
                <p className="text-muted-foreground leading-relaxed">
                  A plataforma é fornecida "como está" e "conforme disponível". Não garantimos que o serviço será ininterrupto, livre de erros ou completamente seguro. Você usa a plataforma por sua própria conta e risco.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">11. Limitação de Responsabilidade</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Na máxima extensão permitida por lei, não seremos responsáveis por quaisquer danos diretos, indiretos, incidentais ou consequenciais resultantes do uso ou incapacidade de usar a plataforma, incluindo perda de dados ou lucros.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">12. Suspensão e Encerramento</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Podemos suspender ou encerrar sua conta a qualquer momento se você violar estes Termos. Você pode encerrar sua conta a qualquer momento através das configurações da plataforma. Após o encerramento, você perde o acesso ao conteúdo publicado.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">13. Modificações dos Termos</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Reservamo-nos o direito de modificar estes Termos a qualquer momento. Alterações significativas serão notificadas através da plataforma ou por e-mail. O uso continuado após as modificações constitui aceitação dos novos termos.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">14. Lei Aplicável</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Estes Termos são regidos pelas leis da República Federativa do Brasil. Quaisquer disputas serão resolvidas nos tribunais competentes do Brasil.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">15. Contato</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Para questões sobre estes Termos de Uso, entre em contato através dos canais de suporte disponíveis na plataforma.
                </p>
              </section>

              <section className="bg-card border border-border rounded-lg p-6">
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Ao utilizar a plataforma Postumos, você reconhece que leu, compreendeu e concorda em estar vinculado a estes Termos de Uso.</strong>
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
