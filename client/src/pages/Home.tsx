import { useState } from "react";
import { calculatePsychologicalType } from "../../../questionnaire-data";
import QuestionnaireStart from "./QuestionnaireStart";
import QuestionnaireForm from "./QuestionnaireForm";
import QuestionnaireResult from "./QuestionnaireResult";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type PageState = "start" | "form" | "result";

export default function Home() {
  const [pageState, setPageState] = useState<PageState>("start");
  const [fullName, setFullName] = useState("");
  const [psychologicalType, setPsychologicalType] = useState("");
  const [scores, setScores] = useState<any>(null);
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState<any>(null);
  const saveResultMutation = trpc.questionnaire.saveResult.useMutation();
  const getLogsQuery = trpc.system.getLogs.useQuery(undefined, { enabled: false });

  const handleStartQuestionnaire = (name: string) => {
    setFullName(name);
    setPageState("form");
  };

  const handleCompleteQuestionnaire = async (answers: Record<number, "a" | "b">) => {
    // Proteção contra clique duplo/múltiplo
    if (saveResultMutation.isPending) {
      console.warn("Submissão já em andamento. Ignorando clique duplo.");
      return;
    }

    const { type, scores: calculatedScores } = calculatePsychologicalType(answers);
    setPsychologicalType(type);
    setScores(calculatedScores);

    // Salvar resultado no banco de dados
    try {
      await saveResultMutation.mutateAsync({
        fullName,
        psychologicalType: type,
        answers,
        scores: calculatedScores,
      });
    } catch (error) {
      console.error("Erro ao salvar resultado:", error);
      alert(String(error));
      return;
    }

    setPageState("result");
  };

  const handleRestart = () => {
    setPageState("start");
    setFullName("");
    setPsychologicalType("");
    setScores(null);
  };

  const handleViewLogs = async () => {
    try {
      const result = await getLogsQuery.refetch();
      setLogs(result.data);
      setShowLogs(true);
    } catch (error) {
      console.error("Erro ao buscar logs:", error);
    }
  };

  return (
    <div>
      {pageState === "start" && (
        <QuestionnaireStart onStart={handleStartQuestionnaire} />
      )}
      {pageState === "form" && (
        <QuestionnaireForm fullName={fullName} onComplete={handleCompleteQuestionnaire} saveResultMutation={saveResultMutation} />
      )}
      {pageState === "result" && scores && (
        <QuestionnaireResult
          fullName={fullName}
          psychologicalType={psychologicalType}
          scores={scores}
          onRestart={handleRestart}
        />
      )}
      
      {/* Debug button - visible em desenvolvimento e produção */}
      <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 9999 }}>
        <Button onClick={handleViewLogs} variant="outline" size="sm">
          Ver Logs
        </Button>
      </div>

      {/* Logs dialog */}
      <Dialog open={showLogs} onOpenChange={setShowLogs}>
        <DialogContent className="max-w-2xl max-h-96 overflow-auto">
          <DialogHeader>
            <DialogTitle>Logs de Erro do Servidor</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 text-sm font-mono">
            {logs?.logs && logs.logs.length > 0 ? (
              logs.logs.map((log: any, idx: number) => (
                <div key={idx} className="border-b pb-2">
                  <div className="text-xs text-gray-500">{log.timestamp}</div>
                  <div className="text-red-600 font-bold">[{log.level}]</div>
                  <div className="text-gray-800 whitespace-pre-wrap break-words">{log.message}</div>
                  {log.stack && (
                    <div className="text-xs text-gray-600 mt-1 whitespace-pre-wrap break-words">
                      {log.stack}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-gray-500">Nenhum log de erro encontrado</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
