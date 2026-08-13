import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Share2, RotateCcw, Sparkles } from "lucide-react";
import { typeDescriptions } from "../../../questionnaire-data";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface QuestionnaireResultProps {
  fullName: string;
  psychologicalType: string;
  scores: {
    E: number;
    I: number;
    S: number;
    N: number;
    T: number;
    F: number;
    J: number;
    P: number;
  };
  onRestart: () => void;
}

export default function QuestionnaireResult({
  fullName,
  psychologicalType,
  scores,
  onRestart,
}: QuestionnaireResultProps) {
  const typeInfo = typeDescriptions[psychologicalType];

  const handleShare = async () => {
    const strengths = typeInfo?.strengths?.join(", ") || "";
    const shareText = `🌟 Descobri meu tipo psicológico!\n\nTipo: ${psychologicalType} - ${typeInfo?.name}\n\nDescrição: ${typeInfo?.description}\n\nPontos Fortes: ${strengths}\n\nE/I: ${scores.E}/${scores.I} | S/N: ${scores.S}/${scores.N} | T/F: ${scores.T}/${scores.F} | J/P: ${scores.J}/${scores.P}\n\nFaça o teste também em: https://tipopsico-nqkwyjxj.manus.space`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Teste de Tipo Psicológico",
          text: shareText,
        });
      } catch (error) {
        console.log("Compartilhamento cancelado");
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Texto copiado para compartilhar com sucesso!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pl-[1cm] relative overflow-hidden" style={{ backgroundColor: "#faf7f2" }}>
      {/* Formas decorativas animadas */}
      <div 
        className="absolute top-10 left-10 w-32 h-32 rounded-full opacity-5 blur-3xl animate-pulse" 
        style={{ backgroundColor: "#c97a5c" }}
      ></div>
      <div 
        className="absolute bottom-20 right-10 w-40 h-40 rounded-full opacity-5 blur-3xl animate-pulse" 
        style={{ backgroundColor: "#8b9d6f" }}
      ></div>
      <div 
        className="absolute top-1/2 left-1/4 w-48 h-48 rounded-full opacity-5 blur-3xl" 
        style={{ backgroundColor: "#d4a574" }}
      ></div>

      <Card className="w-full max-w-3xl p-8 shadow-2xl border-0 backdrop-blur-sm" style={{ backgroundColor: "#fefbf7" }}>
        <div className="space-y-8">
          {/* Cabeçalho com animação */}
          <div className="text-center space-y-3">
            <div className="inline-block px-4 py-2 rounded-full text-xs uppercase tracking-widest font-semibold" style={{ backgroundColor: "#f0e8e0", color: "#c97a5c" }}>
              <Sparkles className="inline mr-2" size={14} />
              Resultado Final
            </div>
            <h1 className="text-4xl font-bold" style={{ color: "#5a4a42" }}>
              Seu Resultado
            </h1>
            <p className="text-lg" style={{ color: "#6b5b52" }}>
              Parabéns, <span className="font-semibold" style={{ color: "#8b9d6f" }}>{fullName}</span>!
            </p>
          </div>

          {/* Tipo Psicológico com destaque visual */}
          <div
            className="text-center p-10 rounded-2xl space-y-4 shadow-lg"
            style={{ 
              background: "linear-gradient(135deg, #f5f0eb 0%, #f0e8e0 100%)",
              borderLeft: "5px solid #8b9d6f",
            }}
          >
            <p className="text-sm uppercase tracking-widest font-semibold" style={{ color: "#8b9d6f" }}>
              Seu Tipo Psicológico
            </p>
            <h2 className="text-6xl font-bold tracking-wider" style={{ color: "#8b9d6f" }}>
              {psychologicalType}
            </h2>
            <h3 className="text-3xl font-semibold" style={{ color: "#5a4a42" }}>
              {typeInfo?.name}
            </h3>
            <p className="text-sm pt-2" style={{ color: "#a89080" }}>
              Uma personalidade única e valiosa
            </p>
          </div>

          {/* Descrição com estilo */}
          <div className="space-y-3">
            <h4 className="font-semibold text-lg text-center" style={{ color: "#5a4a42" }}>
              Quem Você É
            </h4>
            <p className="text-center leading-relaxed text-base p-4 rounded-lg" style={{ color: "#6b5b52", backgroundColor: "#f5f0eb" }}>
              {typeInfo?.description}
            </p>
          </div>

          {/* Pontos Fortes com ícones */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-center" style={{ color: "#5a4a42" }}>
              Seus Pontos Fortes
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
              {typeInfo?.strengths.map((strength: string, index: number) => (
                <div 
                  key={index} 
                  className="flex gap-3 p-4 rounded-lg"
                  style={{ backgroundColor: "#f5f0eb" }}
                >
                  <span className="text-2xl flex-shrink-0" style={{ color: "#8b9d6f" }}>✓</span>
                  <span className="text-sm font-medium" style={{ color: "#5a4a42" }}>
                    {strength}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Somatórias de Preferências com design melhorado */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-center" style={{ color: "#5a4a42" }}>
              Seu Perfil de Preferências
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {/* Extroversão vs Introversão */}
              <div className="space-y-3 p-4 rounded-xl" style={{ backgroundColor: "#f5f0eb" }}>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold" style={{ color: "#5a4a42" }}>
                    Extroversão (E)
                  </span>
                  <span className="text-lg font-bold" style={{ color: "#8b9d6f" }}>
                    {scores.E}
                  </span>
                </div>
                <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: "#e8ddd3" }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(scores.E / (scores.E + scores.I)) * 100}%`,
                      backgroundColor: "#8b9d6f",
                    }}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold" style={{ color: "#5a4a42" }}>
                    Introversão (I)
                  </span>
                  <span className="text-lg font-bold" style={{ color: "#c97a5c" }}>
                    {scores.I}
                  </span>
                </div>
              </div>

              {/* Sensação vs Intuição */}
              <div className="space-y-3 p-4 rounded-xl" style={{ backgroundColor: "#f5f0eb" }}>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold" style={{ color: "#5a4a42" }}>
                    Sensação (S)
                  </span>
                  <span className="text-lg font-bold" style={{ color: "#d4a574" }}>
                    {scores.S}
                  </span>
                </div>
                <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: "#e8ddd3" }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(scores.S / (scores.S + scores.N)) * 100}%`,
                      backgroundColor: "#d4a574",
                    }}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold" style={{ color: "#5a4a42" }}>
                    Intuição (N)
                  </span>
                  <span className="text-lg font-bold" style={{ color: "#8b9d6f" }}>
                    {scores.N}
                  </span>
                </div>
              </div>

              {/* Pensamento vs Sentimento */}
              <div className="space-y-3 p-4 rounded-xl" style={{ backgroundColor: "#f5f0eb" }}>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold" style={{ color: "#5a4a42" }}>
                    Pensamento (T)
                  </span>
                  <span className="text-lg font-bold" style={{ color: "#8b9d6f" }}>
                    {scores.T}
                  </span>
                </div>
                <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: "#e8ddd3" }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(scores.T / (scores.T + scores.F)) * 100}%`,
                      backgroundColor: "#8b9d6f",
                    }}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold" style={{ color: "#5a4a42" }}>
                    Sentimento (F)
                  </span>
                  <span className="text-lg font-bold" style={{ color: "#c97a5c" }}>
                    {scores.F}
                  </span>
                </div>
              </div>

              {/* Julgamento vs Percepção */}
              <div className="space-y-3 p-4 rounded-xl" style={{ backgroundColor: "#f5f0eb" }}>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold" style={{ color: "#5a4a42" }}>
                    Julgamento (J)
                  </span>
                  <span className="text-lg font-bold" style={{ color: "#d4a574" }}>
                    {scores.J}
                  </span>
                </div>
                <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: "#e8ddd3" }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(scores.J / (scores.J + scores.P)) * 100}%`,
                      backgroundColor: "#d4a574",
                    }}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold" style={{ color: "#5a4a42" }}>
                    Percepção (P)
                  </span>
                  <span className="text-lg font-bold" style={{ color: "#8b9d6f" }}>
                    {scores.P}
                  </span>
                </div>
              </div>
            </div>
          </div>


          {/* Botões de Ação com design aprimorado */}
          <div className="flex gap-3 pt-4 flex-col sm:flex-row justify-center">
            <Button
              onClick={handleShare}
              className="flex-1 py-3 rounded-lg flex gap-2 items-center justify-center font-semibold transition-all duration-300 hover:shadow-lg"
              style={{
                borderColor: "#8b9d6f",
                color: "#8b9d6f",
                backgroundColor: "transparent",
                border: "2px solid #8b9d6f",
              }}
            >
              <Share2 size={18} />
              <span>Compartilhar</span>
            </Button>
            <Button
              onClick={onRestart}
              className="flex-1 py-3 font-semibold rounded-lg flex gap-2 items-center justify-center transition-all duration-300 hover:shadow-lg"
              style={{
                backgroundColor: "#c97a5c",
                color: "#fefbf7",
              }}
            >
              <RotateCcw size={18} />
              <span>Recomeçar</span>
            </Button>
          </div>

          {/* Rodapé inspirador */}
          <div className="text-center pt-4">
            <p className="text-xs" style={{ color: "#a89080" }}>
              Lembre-se: Não há tipos melhores ou piores. Cada tipo tem seus próprios talentos e desafios únicos.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
