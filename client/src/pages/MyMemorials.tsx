import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Heart, Plus, Eye } from "lucide-react";
import { Link } from "wouter";

export default function MyMemorials() {
  const { user, loading: authLoading } = useAuth();
  const { data: profiles, isLoading } = trpc.memorial.getMyProfiles.useQuery(undefined, {
    enabled: !!user,
  });

  if (authLoading || isLoading) {
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
              Você precisa estar autenticado para ver seus memoriais.
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container py-4 flex justify-between items-center">
          <Link href="/">
            <a className="flex items-center gap-2 text-2xl font-semibold text-foreground">
              <Heart className="h-7 w-7 text-primary" />
              <span>Postmus</span>
            </a>
          </Link>
          <Button asChild>
            <Link href="/create">
              <a className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Criar Memorial
              </a>
            </Link>
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="container py-12 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Meus Memoriais
          </h1>
          <p className="text-muted-foreground">
            Gerencie os perfis memoriais que você criou.
          </p>
        </div>

        {!profiles || profiles.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Nenhum Memorial Criado
              </h3>
              <p className="text-muted-foreground mb-6">
                Você ainda não criou nenhum perfil memorial.
              </p>
              <Button asChild>
                <Link href="/create">
                  <a className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Criar Primeiro Memorial
                  </a>
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <Link key={profile.id} href={`/memorial/${profile.id}`}>
                <a>
                  <Card className="border-border/50 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer h-full">
                    <CardHeader className="space-y-3">
                      {profile.photoUrl ? (
                        <div className="w-full aspect-square rounded-lg overflow-hidden bg-muted">
                          <img
                            src={profile.photoUrl}
                            alt={profile.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-full aspect-square rounded-lg bg-muted flex items-center justify-center">
                          <Heart className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-xl">{profile.name}</CardTitle>
                        {profile.birthDate && profile.deathDate && (
                          <CardDescription className="mt-1">
                            {new Date(profile.birthDate).getFullYear()} -{" "}
                            {new Date(profile.deathDate).getFullYear()}
                          </CardDescription>
                        )}
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <Eye className="h-3 w-3" />
                          <span>{profile.visitCount} {profile.visitCount === 1 ? 'visita' : 'visitas'}</span>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </a>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
