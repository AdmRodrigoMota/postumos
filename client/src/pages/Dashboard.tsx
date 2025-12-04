import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Heart, Eye, MessageSquare, Calendar, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();

  const { data: memorials, isLoading: memorialsLoading } = trpc.memorial.listByCreator.useQuery(
    undefined,
    { enabled: !!user }
  );

  if (authLoading || memorialsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Autenticação Necessária</CardTitle>
            <CardDescription>
              Você precisa estar autenticado para acessar o dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href={getLoginUrl()}>Entrar</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalVisits = memorials?.reduce((sum: number, m: any) => sum + m.visitCount, 0) || 0;
  const totalMemorials = memorials?.length || 0;

  // Calcular total de mensagens (aproximado baseado nos dados disponíveis)
  const recentMemorial = memorials?.[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container py-4 flex justify-between items-center">
          <Link href="/">
            <span className="flex items-center gap-2 text-2xl font-semibold text-foreground cursor-pointer">
              <Heart className="h-7 w-7 text-primary" />
              <span>Postumos</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/my-memorials">
                <span>Meus Memoriais</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <span>Início</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container py-12 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Dashboard de Estatísticas
          </h1>
          <p className="text-muted-foreground">
            Acompanhe o engajamento e as visitas dos seus perfis memoriais.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Perfis</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMemorials}</div>
              <p className="text-xs text-muted-foreground">
                Perfis memoriais criados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Visitas</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVisits}</div>
              <p className="text-xs text-muted-foreground">
                Visitas em todos os perfis
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média de Visitas</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalMemorials > 0 ? Math.round(totalVisits / totalMemorials) : 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Visitas por perfil
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Memorials List */}
        <Card>
          <CardHeader>
            <CardTitle>Seus Perfis Memoriais</CardTitle>
            <CardDescription>
              Estatísticas detalhadas de cada perfil memorial
            </CardDescription>
          </CardHeader>
          <CardContent>
            {memorials && memorials.length > 0 ? (
              <div className="space-y-4">
                {memorials.map((memorial: any) => {
                  const birthYear = memorial.birthDate
                    ? new Date(memorial.birthDate).getFullYear()
                    : null;
                  const deathYear = memorial.deathDate
                    ? new Date(memorial.deathDate).getFullYear()
                    : null;

                  return (
                    <div
                      key={memorial.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {memorial.photoUrl ? (
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                            <img
                              src={memorial.photoUrl}
                              alt={memorial.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                            <Heart className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-foreground">{memorial.name}</h3>
                          {(birthYear || deathYear) && (
                            <p className="text-sm text-muted-foreground">
                              {birthYear && deathYear
                                ? `${birthYear} - ${deathYear}`
                                : birthYear
                                ? `Nascido em ${birthYear}`
                                : `Falecido em ${deathYear}`}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            Criado em {format(new Date(memorial.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Eye className="h-4 w-4" />
                            <span className="text-sm font-medium">{memorial.visitCount}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">visitas</p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/memorial/${memorial.id}`}>
                            <span>Ver Perfil</span>
                          </Link>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Você ainda não criou nenhum perfil memorial.
                </p>
                <Button asChild>
                  <Link href="/create">
                    <span>Criar Primeiro Memorial</span>
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
