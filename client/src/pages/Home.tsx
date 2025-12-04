import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Heart, Image, MessageCircle, Search } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const { user, loading } = useAuth();
  const { data: recentProfiles } = trpc.memorial.getAll.useQuery({ limit: 6 });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex justify-between items-center">
          <Link href="/">
            <span className="flex items-center gap-2 text-2xl font-semibold text-foreground cursor-pointer">
              <Heart className="h-7 w-7 text-primary" />
              <span>Postumos</span>
            </span>
          </Link>
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/feed" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                  Feed
                </Link>
                <Link href="/search" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                  Buscar
                </Link>
                <Link href="/my-memorials" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                  Meus Memoriais
                </Link>
                <Link href="/create">
                  <Button size="sm">Criar Memorial</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/search" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                  Buscar Memoriais
                </Link>
                <Button size="sm" asChild>
                  <a href={getLoginUrl()}>Entrar</a>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
            Preserve Memórias que Vivem para Sempre
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Uma plataforma dedicada a homenagear e manter viva a memória de entes queridos. 
            Compartilhe histórias, fotos e tributos em um espaço respeitoso e acolhedor.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            {user ? (
              <Link href="/create">
                <Button size="lg">Criar Memorial</Button>
              </Link>
            ) : (
              <>
                <Button size="lg" asChild>
                  <a href={getLoginUrl()}>Começar Agora</a>
                </Button>
                <Link href="/search">
                  <Button size="lg" variant="outline">Explorar Memoriais</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Uma Homenagem Digna e Eterna
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <Heart className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="text-lg">Perfis Memoriais</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Crie perfis completos com fotos, biografia e datas importantes para homenagear seus entes queridos.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <Image className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="text-lg">Galeria de Fotos</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Preserve momentos especiais através de uma galeria de fotos compartilhada por familiares e amigos.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <MessageCircle className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="text-lg">Mural de Mensagens</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Compartilhe tributos, condolências e memórias em um espaço respeitoso e acolhedor.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <Search className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="text-lg">Busca Fácil</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Encontre perfis memoriais de forma simples e rápida através do sistema de busca.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Memorials */}
      {recentProfiles && recentProfiles.length > 0 && (
        <section className="container py-16 md:py-24 bg-card/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
              Memoriais Recentes
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentProfiles.map((profile) => (
                <Link key={profile.id} href={`/memorial/${profile.id}`}>
                  <Card className="border-border/50 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer">
                    <CardHeader className="space-y-3">
                      {profile.photoUrl && (
                        <div className="w-full aspect-square rounded-lg overflow-hidden bg-muted">
                          <img 
                            src={profile.photoUrl} 
                            alt={profile.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-xl">{profile.name}</CardTitle>
                        {profile.birthDate && profile.deathDate && (
                          <CardDescription className="mt-1">
                            {new Date(profile.birthDate).getFullYear()} - {new Date(profile.deathDate).getFullYear()}
                          </CardDescription>
                        )}
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm mt-20">
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
