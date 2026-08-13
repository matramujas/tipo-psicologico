import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface QuestionnaireStartProps {
  onStart: (fullName: string) => void;
}

export default function QuestionnaireStart({ onStart }: QuestionnaireStartProps) {
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName.trim()) {
      setError("Por favor, insira seu nome completo");
      return;
    }

    if (fullName.trim().split(" ").length < 2) {
      setError("Por favor, insira seu nome completo (nome e sobrenome)");
      return;
    }

    setError("");
    onStart(fullName.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pl-[1cm]" style={{ backgroundColor: "#faf7f2" }}>
      {/* Formas decorativas */}
      <div className="absolute top-10 left-10 w-32 h-32 rounded-full opacity-10" style={{ backgroundColor: "#c97a5c" }}></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full opacity-10" style={{ backgroundColor: "#8b9d6f" }}></div>

      <Card className="w-full max-w-md p-8 shadow-lg border-0" style={{ backgroundColor: "#fefbf7" }}>
        <div className="space-y-6">
          {/* Cabeçalho */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold" style={{ color: "#5a4a42" }}>
              Identificador de Tipo Psicológico
            </h1>
            <p className="text-sm uppercase tracking-wider" style={{ color: "#a89080" }}>
              Descubra seu tipo psicológico
            </p>
          </div>

          {/* Instruções */}
          <div className="space-y-4 bg-opacity-50 rounded-lg" style={{ backgroundColor: "#f5f0eb" }}>
            <h2 className="font-semibold" style={{ color: "#5a4a42" }}>
              Instruções de Preenchimento
            </h2>
            <ul className="space-y-2 text-sm" style={{ color: "#6b5b52", marginTop: '10px' }}>
              <li className="flex gap-2">
                <span className="text-lg" style={{ color: "#c97a5c" }}>•</span>
                <span>Responda com base em sua verdadeira maneira de ser, não em situações específicas.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-lg" style={{ color: "#c97a5c" }}>•</span>
                <span>Analise as respostas em relação à sua vida como um todo.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-lg" style={{ color: "#c97a5c" }}>•</span>
                <span>Não há respostas certas ou erradas, apenas preferências pessoais.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-lg" style={{ color: "#c97a5c" }}>•</span>
                <span>O questionário contém 70 questões e leva aproximadamente 15-20 minutos.</span>
              </li>
            </ul>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm uppercase tracking-wider" style={{ color: "#a89080" }}>
                Nome Completo *
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Digite seu nome completo"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (error) setError("");
                }}
                className="border-2 rounded-lg p-3"
                style={{
                  borderColor: error ? "#c97a5c" : "#d4c4b8",
                  backgroundColor: "#fefbf7"
                }}
              />
              {error && (
                <p className="text-sm" style={{ color: "#c97a5c" }}>
                  {error}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full py-3 font-semibold uppercase tracking-wider rounded-lg transition-all"
              style={{
                backgroundColor: "#8b9d6f",
                color: "#fefbf7"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#7a8b5f";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#8b9d6f";
              }}
            >
              Começar Questionário
            </Button>
          </form>

          {/* Rodapé */}
          <p className="text-xs text-center" style={{ color: "#a89080" }}>
            Seus dados serão mantidos em sigilo e usados apenas para calcular seu tipo psicológico.
          </p>
        </div>
      </Card>
    </div>
  );
}
