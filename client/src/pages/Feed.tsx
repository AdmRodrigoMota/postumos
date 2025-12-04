import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Heart, Loader2, UserPlus, MessageCircle, Image } from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Feed() {
  const { data: activities, isLoading } = trpc.activity.getRecent.useQuery({ limit: 30 });
  const { data: profiles } = trpc.memorial.getAll.useQuery({ limit: 100 });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "profile_created":
        return <UserPlus className="h-5 w-5 text-primary" />;
      case "message_posted":
        return <MessageCircle className="h-5 w-5 text-primary" />;
      case "photo_added":
        return <Image className="h-5 w-5 text-primary" />;
      default:
        return <Heart className="h-5 w-5 text-primary" />;
    }
  };

  const getActivityText = (type: string) => {
    switch (type) {
      case "profile_created":
        return "Novo perfil memorial criado";
      case "message_posted":
        return "Nova mensagem publicada";
      case "photo_added":
        return "Nova foto adicionada";
      default:
        return "Nova atividade";
    }
  };

  const getProfileById = (id: number) => {
    return profiles?.find((p) => p.id === id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container py-4 flex justify-between items-center">
          <Link href="/">
            <a className="flex items-center gap-2 text-2xl font-semibold text-foreground">
              <Heart className="h-7 w-7 text-primary" />
              <span>Postumos</span>
            </a>
          </Link>
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <a>Voltar</a>
            </Link>
          </Button>
        </div>
      </header>

      {/* Feed Content */}
      <div className="container py-12 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Feed de Atividades
          </h1>
          <p className="text-muted-foreground">
            Acompanhe as atividades recentes na plataforma.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Carregando atividades...</p>
          </div>
        ) : !activities || activities.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Nenhuma Atividade Ainda
              </h3>
              <p className="text-muted-foreground mb-6">
                Seja o primeiro a criar um perfil memorial.
              </p>
              <Button asChild>
                <Link href="/create">
                  <a>Criar Memorial</a>
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const profile = getProfileById(activity.memorialId);
              if (!profile) return null;

              return (
                <Link key={activity.id} href={`/memorial/${activity.memorialId}`}>
                  <a>
                    <Card className="border-border/50 shadow-sm hover:shadow-md transition-all hover:scale-[1.01] cursor-pointer">
                      <CardContent className="py-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-foreground">
                                  {getActivityText(activity.type)}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {profile.name}
                                </p>
                              </div>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {formatDistanceToNow(new Date(activity.createdAt), {
                                  addSuffix: true,
                                  locale: ptBR,
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
