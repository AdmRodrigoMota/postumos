export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center space-y-8">
        <h1 className="text-6xl font-bold text-gray-900">
          Postmus
        </h1>
        <p className="text-2xl text-gray-600">
          Rede Social de Memória
        </p>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Uma plataforma para preservar e compartilhar memórias de pessoas queridas que já partiram.
        </p>
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-4">🚀 Em Desenvolvimento</h2>
          <p className="text-gray-600">
            Estamos trabalhando para trazer esta experiência única para você em breve!
          </p>
        </div>
      </div>
    </div>
  );
}
