import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Home, Search } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-3">
            <Heart className="h-12 w-12 text-primary" />
            <span className="text-3xl font-semibold text-foreground">Postumos</span>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardContent className="pt-12 pb-12">
            {/* 404 Number */}
            <div className="mb-6">
              <h1 className="text-8xl font-bold text-primary/20 mb-2">404</h1>
              <div className="h-1 w-24 bg-primary/30 mx-auto rounded-full"></div>
            </div>

            {/* Message */}
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
              Página Não Encontrada
            </h2>

            <p className="text-muted-foreground mb-8 leading-relaxed max-w-md mx-auto">
              A página que você está procurando não existe ou foi movida. 
              Retorne à página inicial ou use a busca para encontrar perfis memoriais.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="gap-2">
                <Link href="/">
                  <Home className="w-4 h-4" />
                  <span>Voltar para Início</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link href="/search">
                  <Search className="w-4 h-4" />
                  <span>Buscar Memoriais</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="mt-8 text-sm text-muted-foreground">
          © 2024 Postumos. Preservando memórias com respeito e dignidade.
        </p>
      </div>
    </div>
  );
}
