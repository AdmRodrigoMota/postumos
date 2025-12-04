import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Heart, Upload, Loader2 } from "lucide-react";
import { Link } from "wouter";

export default function CreateMemorial() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    deathDate: "",
    biography: "",
    photoUrl: "",
    photoKey: "",
  });

  const createMutation = trpc.memorial.create.useMutation({
    onSuccess: (data) => {
      toast.success("Perfil memorial criado com sucesso");
      setLocation(`/memorial/${data.id}`);
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao criar perfil memorial");
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
      const fileKey = `memorials/photos/${user?.id}-${randomSuffix}-${file.name}`;
      
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
      toast.error("Por favor, informe o nome");
      return;
    }

    createMutation.mutate({
      name: formData.name,
      photoUrl: formData.photoUrl || undefined,
      photoKey: formData.photoKey || undefined,
      birthDate: formData.birthDate ? new Date(formData.birthDate) : undefined,
      deathDate: formData.deathDate ? new Date(formData.deathDate) : undefined,
      biography: formData.biography || undefined,
    });
  };

  if (authLoading) {
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
              Você precisa estar autenticado para criar um perfil memorial.
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
          <Link href="/my-memorials">
            <Button variant="outline" size="sm">Meus Memoriais</Button>
          </Link>
        </div>
      </header>

      {/* Form */}
      <div className="container py-12 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Criar Perfil Memorial
          </h1>
          <p className="text-muted-foreground">
            Crie uma homenagem digna e eterna para seu ente querido.
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
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-muted">
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
                    onChange={(e) => setFormData((prev) => ({ ...prev, birthDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deathDate">Data de Falecimento</Label>
                  <Input
                    id="deathDate"
                    type="date"
                    value={formData.deathDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, deathDate: e.target.value }))}
                  />
                </div>
              </div>

              {/* Biography */}
              <div className="space-y-2">
                <Label htmlFor="biography">Biografia</Label>
                <Textarea
                  id="biography"
                  value={formData.biography}
                  onChange={(e) => setFormData((prev) => ({ ...prev, biography: e.target.value }))}
                  placeholder="Compartilhe a história de vida, realizações e memórias especiais..."
                  rows={6}
                />
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || uploading}
                  className="flex-1"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    "Criar Memorial"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/")}
                  disabled={createMutation.isPending}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
