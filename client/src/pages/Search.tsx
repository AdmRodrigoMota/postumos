import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Heart, Search as SearchIcon, Loader2, Eye } from "lucide-react";
import { Link } from "wouter";

export default function Search() {
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: results, isLoading } = trpc.memorial.search.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length > 0 }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchQuery(query.trim());
    }
  };

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
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <a>Voltar</a>
            </Link>
          </Button>
        </div>
      </header>

      {/* Search Content */}
      <div className="container py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Buscar Perfis Memoriais
          </h1>
          <p className="text-muted-foreground">
            Encontre e homenageie a memória de entes queridos.
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex gap-3">
              <Input
                type="text"
                placeholder="Digite o nome para buscar..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={!query.trim()}>
                <SearchIcon className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Search Results */}
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Buscando...</p>
          </div>
        ) : searchQuery && results ? (
          <div>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                {results.length === 0
                  ? "Nenhum resultado encontrado"
                  : `${results.length} ${results.length === 1 ? "resultado encontrado" : "resultados encontrados"}`}
              </p>
            </div>

            {results.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                {results.map((profile) => (
                  <Link key={profile.id} href={`/memorial/${profile.id}`}>
                    <a>
                      <Card className="border-border/50 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer h-full">
                        <CardHeader className="space-y-3">
                          <div className="flex gap-4">
                            {profile.photoUrl ? (
                              <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                <img
                                  src={profile.photoUrl}
                                  alt={profile.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                                <Heart className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-xl truncate">
                                {profile.name}
                              </CardTitle>
                              {profile.birthDate && profile.deathDate && (
                                <CardDescription className="mt-1">
                                  {new Date(profile.birthDate).getFullYear()} -{" "}
                                  {new Date(profile.deathDate).getFullYear()}
                                </CardDescription>
                              )}
                              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                <Eye className="h-3 w-3" />
                                <span>
                                  {profile.visitCount}{" "}
                                  {profile.visitCount === 1 ? "visita" : "visitas"}
                                </span>
                              </div>
                            </div>
                          </div>
                          {profile.biography && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {profile.biography}
                            </p>
                          )}
                        </CardHeader>
                      </Card>
                    </a>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <SearchIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Comece sua Busca
            </h3>
            <p className="text-muted-foreground">
              Digite um nome no campo acima para encontrar perfis memoriais.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
