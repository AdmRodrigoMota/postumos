import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Heart, Eye, Calendar, Edit, Trash2, Loader2 } from "lucide-react";
import { Link, useLocation, useRoute } from "wouter";
import PhotoGallery from "@/components/PhotoGallery";
import MessageWall from "@/components/MessageWall";
import SocialShare from "@/components/SocialShare";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function MemorialProfile() {
  const { user } = useAuth();
  const [, params] = useRoute("/memorial/:id");
  const [, setLocation] = useLocation();
  const memorialId = params?.id ? parseInt(params.id) : 0;

  const { data: profile, isLoading } = trpc.memorial.getById.useQuery(
    { id: memorialId },
    { enabled: memorialId > 0 }
  );

  const deleteMutation = trpc.memorial.delete.useMutation({
    onSuccess: () => {
      toast.success("Perfil memorial excluído com sucesso");
      setLocation("/");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao excluir perfil memorial");
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Perfil Não Encontrado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              O perfil memorial que você está procurando não existe.
            </p>
            <Button asChild>
              <Link href="/">
                <span>Voltar para Início</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isOwner = user?.id === profile.creatorId;
  const birthYear = profile.birthDate ? new Date(profile.birthDate).getFullYear() : null;
  const deathYear = profile.deathDate ? new Date(profile.deathDate).getFullYear() : null;

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
            {isOwner && (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/memorial/${memorialId}/edit`}>
                    <span className="flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      Editar
                    </span>
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir este perfil memorial? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteMutation.mutate({ id: memorialId })}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {deleteMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Excluindo...
                          </>
                        ) : (
                          "Excluir"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
            <SocialShare 
              memorialName={profile.name}
              memorialId={memorialId}
              birthYear={birthYear || undefined}
              deathYear={deathYear || undefined}
            />
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <span>Voltar</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <div className="container py-12 max-w-4xl">
        <Card className="mb-8">
          <CardContent className="pt-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Photo */}
              <div className="flex-shrink-0">
                {profile.photoUrl ? (
                  <div className="w-48 h-48 rounded-lg overflow-hidden bg-muted shadow-md">
                    <img
                      src={profile.photoUrl}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-48 h-48 rounded-lg bg-muted flex items-center justify-center">
                    <Heart className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                    {profile.name}
                  </h1>
                  {(birthYear || deathYear) && (
                    <div className="flex items-center gap-2 text-lg text-muted-foreground">
                      <Calendar className="h-5 w-5" />
                      <span>
                        {birthYear && deathYear
                          ? `${birthYear} - ${deathYear}`
                          : birthYear
                          ? `Nascido em ${birthYear}`
                          : `Falecido em ${deathYear}`}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span>{profile.visitCount} {profile.visitCount === 1 ? 'visita' : 'visitas'}</span>
                </div>

                {profile.biography && (
                  <div className="pt-4">
                    <h2 className="text-xl font-semibold text-foreground mb-3">Biografia</h2>
                    <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {profile.biography}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gallery and Messages */}
        <div className="space-y-6">
          <PhotoGallery memorialId={memorialId} isOwner={isOwner} />
          <MessageWall memorialId={memorialId} isOwner={isOwner} />
        </div>
      </div>
    </div>
  );
}
