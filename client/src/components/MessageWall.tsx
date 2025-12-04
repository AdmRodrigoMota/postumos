import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { MessageCircle, Loader2, Flag, EyeOff, Eye } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MessageWallProps {
  memorialId: number;
  isOwner: boolean;
}

export default function MessageWall({ memorialId, isOwner }: MessageWallProps) {
  const { user } = useAuth();
  const [guestName, setGuestName] = useState("");
  const [messageContent, setMessageContent] = useState("");

  const utils = trpc.useUtils();
  const { data: messages, isLoading } = trpc.message.getByMemorial.useQuery({ memorialId });

  const addMessageMutation = trpc.message.add.useMutation({
    onSuccess: () => {
      toast.success("Mensagem enviada com sucesso");
      utils.message.getByMemorial.invalidate({ memorialId });
      setMessageContent("");
      setGuestName("");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao enviar mensagem");
    },
  });

  const reportMutation = trpc.message.report.useMutation({
    onSuccess: () => {
      toast.success("Mensagem reportada para moderação");
      utils.message.getByMemorial.invalidate({ memorialId });
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao reportar mensagem");
    },
  });

  const hideMutation = trpc.message.hide.useMutation({
    onSuccess: () => {
      toast.success("Mensagem ocultada");
      utils.message.getByMemorial.invalidate({ memorialId });
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao ocultar mensagem");
    },
  });

  const unhideMutation = trpc.message.unhide.useMutation({
    onSuccess: () => {
      toast.success("Mensagem reexibida");
      utils.message.getByMemorial.invalidate({ memorialId });
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao reexibir mensagem");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageContent.trim()) {
      toast.error("Por favor, escreva uma mensagem");
      return;
    }

    if (!user && !guestName.trim()) {
      toast.error("Por favor, informe seu nome");
      return;
    }

    addMessageMutation.mutate({
      memorialId,
      content: messageContent,
      authorName: !user ? guestName : undefined,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mural de Mensagens</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Message Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-muted/30 rounded-lg">
          {!user && (
            <div className="space-y-2">
              <Label htmlFor="guest-name">Seu Nome</Label>
              <Input
                id="guest-name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Digite seu nome"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="message-content">Sua Mensagem</Label>
            <Textarea
              id="message-content"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="Compartilhe uma memória, condolência ou tributo..."
              rows={4}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={addMessageMutation.isPending}
            className="w-full"
          >
            {addMessageMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <MessageCircle className="mr-2 h-4 w-4" />
                Enviar Mensagem
              </>
            )}
          </Button>
        </form>

        {/* Messages List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
            </div>
          ) : !messages || messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Seja o primeiro a deixar uma mensagem.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`p-4 rounded-lg border ${
                  message.isHidden
                    ? "bg-muted/50 border-muted"
                    : "bg-card border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">
                        {message.authorName || "Anônimo"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(message.createdAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                      {message.isHidden && (
                        <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                          Oculta
                        </span>
                      )}
                      {message.isReported && (
                        <span className="text-xs px-2 py-0.5 rounded bg-destructive/10 text-destructive">
                          Reportada
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {isOwner && (
                      <>
                        {message.isHidden ? (
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() =>
                              unhideMutation.mutate({ id: message.id, memorialId })
                            }
                            disabled={unhideMutation.isPending}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() =>
                              hideMutation.mutate({ id: message.id, memorialId })
                            }
                            disabled={hideMutation.isPending}
                          >
                            <EyeOff className="h-4 w-4" />
                          </Button>
                        )}
                      </>
                    )}
                    {!isOwner && !message.isReported && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => {
                          if (
                            confirm(
                              "Deseja reportar esta mensagem para moderação?"
                            )
                          ) {
                            reportMutation.mutate({ id: message.id });
                          }
                        }}
                        disabled={reportMutation.isPending}
                      >
                        <Flag className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
