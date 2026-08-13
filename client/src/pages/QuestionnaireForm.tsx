import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { questions } from "../../../questionnaire-data";

interface QuestionnaireFormProps {
  fullName: string;
  onComplete: (answers: Record<number, "a" | "b">) => void;
  saveResultMutation?: any;
}

export default function QuestionnaireForm({ fullName, onComplete, saveResultMutation }: QuestionnaireFormProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, "a" | "b">>({});

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const canProceed = answers[currentQuestion.id] !== undefined;

  const [justAnswered, setJustAnswered] = useState(false);

  const handleAnswerChange = (value: "a" | "b") => {
    const wasAlreadyAnswered = answers[currentQuestion.id] !== undefined;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
    // Marca que o usuário acabou de responder (apenas se não tinha respondido antes)
    if (!wasAlreadyAnswered) {
      setJustAnswered(true);
    }
  };

  // Avanço automático para próxima pergunta após responder
  useEffect(() => {
    if (justAnswered && !isLastQuestion) {
      const timer = setTimeout(() => {
        handleNext();
        setJustAnswered(false);
      }, 500); // Aguarda 500ms para dar feedback visual
      return () => clearTimeout(timer);
    }
  }, [justAnswered, isLastQuestion]);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setJustAnswered(false);
    }
  };

  const handleNextManual = () => {
    handleNext();
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setJustAnswered(false);
    }
  };

  const handleComplete = () => {
    if (Object.keys(answers).length === questions.length) {
      onComplete(answers);
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
        className="absolute top-1/2 right-1/4 w-48 h-48 rounded-full opacity-5 blur-3xl" 
        style={{ backgroundColor: "#d4a574" }}
      ></div>

      <Card className="w-full max-w-2xl p-8 shadow-2xl border-0 backdrop-blur-sm" style={{ backgroundColor: "#fefbf7" }}>
        <div className="space-y-8">
          {/* Cabeçalho com animação */}
          <div className="space-y-3 text-center">
            <div className="inline-block px-4 py-2 rounded-full text-xs uppercase tracking-widest font-semibold" style={{ backgroundColor: "#f0e8e0", color: "#8b9d6f" }}>
              Questionário Interativo
            </div>
            <h1 className="text-3xl font-bold" style={{ color: "#5a4a42" }}>
              Identificador de Tipo Psicológico
            </h1>
            <p className="text-sm" style={{ color: "#6b5b52" }}>
              Olá, <span className="font-semibold text-base" style={{ color: "#8b9d6f" }}>{fullName}</span>! Vamos descobrir seu tipo.
            </p>
          </div>

          {/* Barra de progresso com detalhes aprimorada */}
          <div className="space-y-3">
            <div className="flex justify-center">
              <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: "#8b9d6f" }}>
                Sua Jornada
              </span>
            </div>
            
            {/* Barra com efeito de gradiente */}
            <div className="w-full h-4 rounded-full overflow-hidden shadow-inner" style={{ backgroundColor: "#e8ddd3" }}>
              <div
                className="h-full rounded-full transition-all duration-700 ease-out shadow-lg"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #8b9d6f 0%, #d4a574 100%)",
                  boxShadow: "0 0 12px rgba(139, 157, 111, 0.4)",
                }}
              ></div>
            </div>
            
            <div className="flex justify-center text-xs gap-4" style={{ color: "#a89080" }}>
              <span className="font-semibold">{Math.round(progress)}% completo</span>
              <span>•</span>
              <span>{questions.length - currentQuestionIndex - 1} restantes</span>
            </div>
          </div>

          {/* Indicador de questão com estilo */}
          <div className="flex justify-center gap-2 items-center">
            <div className="h-1 flex-1 max-w-xs rounded-full" style={{ backgroundColor: "#e8ddd3" }}>
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  backgroundColor: "#8b9d6f"
                }}
              ></div>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: "#f5f0eb", color: "#8b9d6f" }}>
              {currentQuestionIndex + 1}/{questions.length}
            </span>
          </div>

          {/* Questão com design aprimorado */}
          <div className="space-y-6 pt-4">
            <div className="space-y-5">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold leading-relaxed" style={{ color: "#5a4a42" }}>
                  {currentQuestion.text}:
                </h2>
              </div>

              <RadioGroup
                value={answers[currentQuestion.id] || ""}
                onValueChange={handleAnswerChange}
              >
                <div className="w-full max-w-md mx-auto space-y-3">
                  {/* Opção A com efeito hover */}
                  <label
                    className="flex items-start space-x-4 p-6 rounded-xl cursor-pointer transition-all duration-300 w-full group hover:shadow-lg"
                    style={{
                      backgroundColor: answers[currentQuestion.id] === "a" ? "#f0e8e0" : "#fefbf7",
                      borderLeft: answers[currentQuestion.id] === "a" ? "5px solid #8b9d6f" : "5px solid transparent",
                      border: answers[currentQuestion.id] === "a" ? "2px solid #8b9d6f" : "2px solid #e8ddd3",
                      transform: answers[currentQuestion.id] === "a" ? "scale(1.02)" : "scale(1)",
                    }}
                  >
                    <RadioGroupItem value="a" id={`option-a-${currentQuestion.id}`} className="mt-1 flex-shrink-0" />
                    <span
                      className="flex-1 text-base leading-relaxed font-medium"
                      style={{ color: "#5a4a42" }}
                    >
                      {currentQuestion.optionA}
                    </span>
                  </label>

                  {/* Opção B com efeito hover */}
                  <label
                    className="flex items-start space-x-4 p-6 rounded-xl cursor-pointer transition-all duration-300 w-full group hover:shadow-lg"
                    style={{
                      backgroundColor: answers[currentQuestion.id] === "b" ? "#f0e8e0" : "#fefbf7",
                      borderLeft: answers[currentQuestion.id] === "b" ? "5px solid #c97a5c" : "5px solid transparent",
                      border: answers[currentQuestion.id] === "b" ? "2px solid #c97a5c" : "2px solid #e8ddd3",
                      transform: answers[currentQuestion.id] === "b" ? "scale(1.02)" : "scale(1)",
                    }}
                  >
                    <RadioGroupItem value="b" id={`option-b-${currentQuestion.id}`} className="mt-1 flex-shrink-0" />
                    <span
                      className="flex-1 text-base leading-relaxed font-medium"
                      style={{ color: "#5a4a42" }}
                    >
                      {currentQuestion.optionB}
                    </span>
                  </label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Botões de navegação com design aprimorado */}
          <div className="flex gap-4 pt-6 justify-center max-w-md w-full mx-auto">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              variant="outline"
              className="flex-1 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-md disabled:opacity-50"
              style={{
                borderColor: currentQuestionIndex === 0 ? "#d4c4b8" : "#8b9d6f",
                color: currentQuestionIndex === 0 ? "#d4c4b8" : "#8b9d6f",
                borderWidth: "2px",
              }}
            >
              ← Anterior
            </Button>

            {!isLastQuestion ? (
              <Button
                onClick={handleNextManual}
                disabled={!canProceed}
                className="flex-1 py-3 font-semibold rounded-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                style={{
                  backgroundColor: canProceed ? "#8b9d6f" : "#d4c4b8",
                  color: "#fefbf7",
                }}
              >
                Próxima →
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!canProceed}
                className="flex-1 py-3 font-semibold rounded-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                style={{
                  backgroundColor: canProceed ? "#c97a5c" : "#d4c4b8",
                  color: "#fefbf7",
                }}
              >
                {saveResultMutation?.isPending ? "Enviando..." : "Concluir"}
              </Button>
            )}
          </div>

          {/* Dica com estilo melhorado */}
          <div className="p-4 rounded-lg text-center" style={{ backgroundColor: "#f5f0eb" }}>
            <p className="text-xs" style={{ color: "#a89080" }}>
              💡 Não há respostas certas ou erradas. Escolha a opção que melhor descreve você.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
