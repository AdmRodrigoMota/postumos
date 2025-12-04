import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Upload, Loader2, X, Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

interface PhotoGalleryProps {
  memorialId: number;
  isOwner: boolean;
}

export default function PhotoGallery({ memorialId, isOwner }: PhotoGalleryProps) {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    photoUrl: "",
    photoKey: "",
    caption: "",
  });

  const utils = trpc.useUtils();
  const { data: photos, isLoading } = trpc.photo.getByMemorial.useQuery({ memorialId });

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

  const addPhotoMutation = trpc.photo.add.useMutation({
    onSuccess: () => {
      toast.success("Foto adicionada à galeria");
      utils.photo.getByMemorial.invalidate({ memorialId });
      setDialogOpen(false);
      setFormData({ photoUrl: "", photoKey: "", caption: "" });
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao adicionar foto");
    },
  });

  const deletePhotoMutation = trpc.photo.delete.useMutation({
    onSuccess: () => {
      toast.success("Foto removida da galeria");
      utils.photo.getByMemorial.invalidate({ memorialId });
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao remover foto");
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
      const fileKey = `memorials/${memorialId}/gallery/${user?.id}-${randomSuffix}-${file.name}`;

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

  const handleAddPhoto = () => {
    if (!formData.photoUrl) {
      toast.error("Por favor, faça upload de uma foto");
      return;
    }

    addPhotoMutation.mutate({
      memorialId,
      photoUrl: formData.photoUrl,
      photoKey: formData.photoKey,
      caption: formData.caption || undefined,
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Galeria de Fotos</CardTitle>
        {user && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Adicionar Foto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Foto à Galeria</DialogTitle>
                <DialogDescription>
                  Compartilhe uma foto especial para a galeria memorial.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="gallery-photo">Foto</Label>
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
                        id="gallery-photo"
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

                <div className="space-y-2">
                  <Label htmlFor="caption">Legenda (opcional)</Label>
                  <Textarea
                    id="caption"
                    value={formData.caption}
                    onChange={(e) => setFormData((prev) => ({ ...prev, caption: e.target.value }))}
                    placeholder="Adicione uma legenda para a foto..."
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleAddPhoto}
                  disabled={addPhotoMutation.isPending || uploading || !formData.photoUrl}
                  className="w-full"
                >
                  {addPhotoMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adicionando...
                    </>
                  ) : (
                    "Adicionar à Galeria"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          </div>
        ) : !photos || photos.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              Nenhuma foto na galeria ainda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group">
                <div
                  className="aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer"
                  onClick={() => setSelectedImage(photo.photoUrl)}
                >
                  <img
                    src={photo.photoUrl}
                    alt={photo.caption || "Foto da galeria"}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                {isOwner && (
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Deseja remover esta foto da galeria?")) {
                        deletePhotoMutation.mutate({ id: photo.id });
                      }
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                {photo.caption && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {photo.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Image Viewer Dialog */}
        {selectedImage && (
          <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
            <DialogContent className="max-w-4xl">
              <img
                src={selectedImage}
                alt="Visualização"
                className="w-full h-auto rounded-lg"
              />
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}
