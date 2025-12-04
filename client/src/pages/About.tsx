import { Heart } from "lucide-react";
import { Link } from "wouter";

export default function About() {
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
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Sobre o Postumos
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Uma plataforma dedicada a preservar e honrar a memória de entes queridos
              </p>
            </div>

            {/* Mission Section */}
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-semibold text-foreground mb-4">Nossa Missão</h2>
              <p className="text-muted-foreground leading-relaxed">
                O Postumos nasceu da compreensão de que a memória de quem amamos merece ser preservada com dignidade e respeito. Acreditamos que cada vida deixa um legado único, composto de histórias, momentos e ensinamentos que merecem ser compartilhados e celebrados.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Nossa missão é oferecer um espaço digital acolhedor onde familiares e amigos possam criar perfis memoriais permanentes, compartilhar fotografias, registrar biografias e deixar mensagens de tributo. Mais do que uma plataforma tecnológica, somos um memorial vivo que conecta gerações através das memórias.
              </p>
            </div>

            {/* Values Section */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Respeito</h3>
                <p className="text-muted-foreground">
                  Tratamos cada memorial com a reverência e cuidado que as memórias de entes queridos merecem.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Dignidade</h3>
                <p className="text-muted-foreground">
                  Mantemos um ambiente solene e respeitoso, apropriado para homenagens e tributos.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Permanência</h3>
                <p className="text-muted-foreground">
                  Comprometemo-nos a preservar as memórias de forma segura e duradoura para as futuras gerações.
                </p>
              </div>
            </div>

            {/* How It Works Section */}
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-semibold text-foreground mb-4">Como Funciona</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">1. Crie um Perfil Memorial</h3>
                  <p className="text-muted-foreground">
                    Registre informações sobre seu ente querido: nome, datas importantes, fotografia e uma biografia que conte sua história única.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">2. Compartilhe Memórias</h3>
                  <p className="text-muted-foreground">
                    Adicione fotos especiais à galeria e convide familiares e amigos para deixarem suas mensagens de tributo e condolências.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">3. Preserve para Sempre</h3>
                  <p className="text-muted-foreground">
                    O perfil memorial permanece acessível de forma permanente, permitindo que futuras gerações conheçam e honrem a memória de seus antepassados.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-card border border-border rounded-lg p-8 text-center space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                Preserve a Memória de Quem Você Ama
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Crie um perfil memorial hoje e garanta que as histórias e legados permaneçam vivos para sempre.
              </p>
              <Link href="/create">
                <button className="bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors font-medium">
                  Criar Memorial
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            © 2024 Postumos. Preservando memórias com respeito e dignidade.
          </div>
        </div>
      </footer>
    </div>
  );
}
