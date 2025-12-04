import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Heart, Loader2, Upload } from "lucide-react";
import { Link, useLocation, useRoute } from "wouter";
import { toast } from "sonner";

export default function EditMemorial() {
  const { user, loading: authLoading } = useAuth();
  const [, params] = useRoute("/memorial/:id/edit");
  const [, setLocation] = useLocation();
  const memorialId = params?.id ? parseInt(params.id) : 0;

  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    deathDate: "",
    biography: "",
    photoUrl: "",
    photoKey: "",
  });

  const { data: profile, isLoading } = trpc.memorial.getById.useQuery(
    { id: memorialId },
    { enabled: memorialId > 0 }
  );

  const updateMutation = trpc.memorial.update.useMutation({
    onSuccess: () => {
      toast.success("Perfil atualizado com sucesso");
      setLocation(`/memorial/${memorialId}`);
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar perfil");
    },
  });

  const uploadMutation = trpc.upload.photo.useMutation({
    onSuccess: (data) => {
      setFormData((prev) => ({ ...prev, photoUrl: data.url, photoKey: data.key }));
      toast.success("Foto enviada com sucesso");
      setUploading(false);
    },
    onError: (error) => {
      toast.error("Erro ao enviar foto");
      console.error(error);
      setUploading(false);
    },
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        birthDate: profile.birthDate
          ? new Date(profile.birthDate).toISOString().split("T")[0]
          : "",
        deathDate: profile.deathDate
          ? new Date(profile.deathDate).toISOString().split("T")[0]
          : "",
        biography: profile.biography || "",
        photoUrl: profile.photoUrl || "",
        photoKey: profile.photoKey || "",
      });
    }
  }, [profile]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem válida");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB");
      return;
    }

    setUploading(true);
    try {
      const buffer = await file.arrayBuffer();
      const randomSuffix = Math.random().toString(36).substring(2, 15);
      const fileKey = `memorials/${memorialId}/profile/${user?.id}-${randomSuffix}-${file.name}`;

      uploadMutation.mutate({
        fileKey,
        buffer: Array.from(new Uint8Array(buffer)),
        contentType: file.type,
      });
    } catch (error) {
      toast.error("Erro ao processar imagem");
      console.error(error);
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("O nome é obrigatório");
      return;
    }

    updateMutation.mutate({
      id: memorialId,
      name: formData.name,
      birthDate: formData.birthDate ? new Date(formData.birthDate) : undefined,
      deathDate: formData.deathDate ? new Date(formData.deathDate) : undefined,
      biography: formData.biography || undefined,
      photoUrl: formData.photoUrl || undefined,
      photoKey: formData.photoKey || undefined,
    });
  };

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
              Você precisa estar autenticado para editar perfis memoriais.
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

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Perfil Não Encontrado</CardTitle>
            <CardDescription>
              O perfil memorial que você está tentando editar não foi encontrado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/">
                <span>Voltar para Início</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (profile.creatorId !== user.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>
              Você não tem permissão para editar este perfil memorial.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href={`/memorial/${memorialId}`}>
                <span>Voltar para Perfil</span>
              </Link>
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
            <span className="flex items-center gap-2 text-2xl font-semibold text-foreground cursor-pointer">
              <Heart className="h-7 w-7 text-primary" />
              <span>Postumos</span>
            </span>
          </Link>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/memorial/${memorialId}`}>
              <span>Cancelar</span>
            </Link>
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="container py-12 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Editar Perfil Memorial
          </h1>
          <p className="text-muted-foreground">
            Atualize as informações do perfil memorial.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Photo Upload */}
              <div className="space-y-2">
                <Label htmlFor="photo">Foto do Perfil</Label>
                <div className="flex items-center gap-4">
                  {formData.photoUrl ? (
                    <div className="w-32 h-32 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={formData.photoUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={uploading}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Imagem até 5MB (JPG, PNG)
                    </p>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Digite o nome completo"
                  required
                />
              </div>

              {/* Dates */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, birthDate: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deathDate">Data de Falecimento</Label>
                  <Input
                    id="deathDate"
                    type="date"
                    value={formData.deathDate}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, deathDate: e.target.value }))
                    }
                  />
                </div>
              </div>

              {/* Biography */}
              <div className="space-y-2">
                <Label htmlFor="biography">Biografia</Label>
                <Textarea
                  id="biography"
                  value={formData.biography}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, biography: e.target.value }))
                  }
                  placeholder="Compartilhe a história de vida, realizações e memórias especiais..."
                  rows={6}
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={updateMutation.isPending || uploading}
                  className="flex-1"
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar Alterações"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  asChild
                  className="flex-1"
                >
                  <Link href={`/memorial/${memorialId}`}>
                    <span>Cancelar</span>
                  </Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
