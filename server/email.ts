import { notifyOwner } from "./_core/notification";
import nodemailer from "nodemailer";
import { ENV } from "./_core/env";

/**
 * Cria um transportador de e-mail usando Zoho Mail SMTP
 */
function createZohoTransporter() {
  console.log("[DEBUG] Verificando credenciais do Zoho Mail...");
  console.log("[DEBUG] SMTP_HOST:", ENV.smtpHost || "VAZIO");
  console.log("[DEBUG] SMTP_PORT:", ENV.smtpPort || "VAZIO");
  console.log("[DEBUG] SMTP_USER:", ENV.smtpUser ? "***" + ENV.smtpUser.slice(-10) : "VAZIO");
  console.log("[DEBUG] SMTP_PASSWORD:", ENV.smtpPassword ? "***" + ENV.smtpPassword.slice(-5) : "VAZIO");
  
  if (!ENV.smtpHost || !ENV.smtpPort || !ENV.smtpUser || !ENV.smtpPassword) {
    console.error("[ERROR] Credenciais do Zoho Mail não configuradas!");
    console.error("[ERROR] SMTP_HOST:", ENV.smtpHost ? "definido" : "NÃO DEFINIDO");
    console.error("[ERROR] SMTP_PORT:", ENV.smtpPort ? "definido" : "NÃO DEFINIDO");
    console.error("[ERROR] SMTP_USER:", ENV.smtpUser ? "definido" : "NÃO DEFINIDO");
    console.error("[ERROR] SMTP_PASSWORD:", ENV.smtpPassword ? "definido" : "NÃO DEFINIDO");
    throw new Error("Zoho Mail credentials not configured");
  }

  console.log("[DEBUG] Criando transportador Zoho Mail SMTP...");
  return nodemailer.createTransport({
    host: ENV.smtpHost,
    port: parseInt(ENV.smtpPort),
    secure: true,
    auth: {
      user: ENV.smtpUser,
      pass: ENV.smtpPassword,
    },
  });
}

/**
 * Envia o resultado do teste para o e-mail do administrador
 */
export async function sendResultToAdmin(
  fullName: string,
  psychologicalType: string,
  scores: {
    E: number;
    I: number;
    S: number;
    N: number;
    T: number;
    F: number;
    J: number;
    P: number;
  }
): Promise<boolean> {
  throw new Error("FUNÇÃO EXECUTADA");

  const typeNames: Record<string, string> = {
    // ...
    ISTJ: "O Logístico",
    ISFJ: "O Defensor",
    INFJ: "O Advogado",
    INTJ: "O Arquiteto",
    ISTP: "O Virtuoso",
    ISFP: "O Aventureiro",
    INFP: "O Mediador",
    INTP: "O Lógico",
    ESTP: "O Empresário",
    ESFP: "O Animador",
    ENFP: "O Campanha",
    ENTP: "O Inovador",
    ESTJ: "O Executivo",
    ESFJ: "O Cônsul",
    ENFJ: "O Protagonista",
    ENTJ: "O Comandante",
  };

  const typeName = typeNames[psychologicalType] || "Desconhecido";

  const scoresSummary = `
E: ${scores.E} | I: ${scores.I}
S: ${scores.S} | N: ${scores.N}
T: ${scores.T} | F: ${scores.F}
J: ${scores.J} | P: ${scores.P}
  `.trim();

  const htmlContent = `
    <h2>Novo Resultado do Teste de Tipo Psicológico</h2>
    <p><strong>Nome:</strong> ${fullName}</p>
    <p><strong>Tipo:</strong> ${psychologicalType} - ${typeName}</p>
    <h3>Scores:</h3>
    <pre>${scoresSummary}</pre>
    <p><strong>Data:</strong> ${new Date().toLocaleString("pt-BR")}</p>
  `;

  const textContent = `
Novo resultado do Teste de Tipo Psicológico:

Nome: ${fullName}
Tipo: ${psychologicalType} - ${typeName}

Scores:
${scoresSummary}

Data: ${new Date().toLocaleString("pt-BR")}
  `.trim();

  try {
    console.log("[DEBUG] ========== INICIANDO ENVIO DE E-MAIL ==========");
    console.log("[DEBUG] Nome do usuário:", fullName);
    console.log("[DEBUG] Tipo psicológico:", psychologicalType);
    console.log("[DEBUG] Timestamp:", new Date().toISOString());
    
    console.log("[DEBUG] Criando transportador Zoho Mail...");
    const transporter = createZohoTransporter();
    console.log("[DEBUG] Transportador criado com sucesso");
    
    const mailOptions = {
      from: ENV.smtpUser,
      to: ENV.smtpUser,
      subject: `Novo Resultado: ${psychologicalType} - ${fullName}`,
      text: textContent,
      html: htmlContent,
    };

    console.log("[DEBUG] Opções de e-mail configuradas:");
    console.log("[DEBUG]   From:", mailOptions.from ? "***" + mailOptions.from.slice(-10) : "VAZIO");
    console.log("[DEBUG]   To:", mailOptions.to ? "***" + mailOptions.to.slice(-10) : "VAZIO");
    console.log("[DEBUG]   Subject:", mailOptions.subject);
    
    console.log("[DEBUG] Enviando e-mail via Zoho Mail SMTP...");
    const result = await transporter.sendMail(mailOptions);
    console.log("[DEBUG] ✓ E-mail enviado com sucesso!");
    console.log("[DEBUG] Message ID:", result.messageId);
    console.log("[DEBUG] Response:", result.response);
    console.log("[DEBUG] ========== ENVIO CONCLUÍDO COM SUCESSO ==========");
    return true;
  } catch (error) {
    console.error("[ERROR] ========== ERRO AO ENVIAR E-MAIL ==========");
    console.error("[ERROR] Tipo de erro:", error instanceof Error ? error.constructor.name : typeof error);
    console.error("[ERROR] Mensagem:", error instanceof Error ? error.message : String(error));
    if (error instanceof Error && error.stack) {
      console.error("[ERROR] Stack trace:", error.stack);
    }
    console.error("[ERROR] ========== FIM DO ERRO ==========");
    
    console.log("[DEBUG] Tentando fallback com notifyOwner...");
    const notifyResult = await notifyOwner({
      title: `Novo Resultado: ${psychologicalType} - ${fullName}`,
      content: textContent,
    });
    
    console.log("[DEBUG] notifyOwner retornou:", notifyResult);
    return notifyResult;
  }
}

/**
 * Envia o resultado para o e-mail do usuário
 * Nota: Esta função seria implementada com um serviço de e-mail externo
 * Por enquanto, apenas registra a intenção
 */
export async function sendResultToUserEmail(
  userEmail: string,
  fullName: string,
  psychologicalType: string,
  scores: {
    E: number;
    I: number;
    S: number;
    N: number;
    T: number;
    F: number;
    J: number;
    P: number;
  }
): Promise<void> {
  // TODO: Implementar envio de e-mail para o usuário
  // Pode ser feito com um serviço como SendGrid, Mailgun, etc.
  console.log(`Enviando resultado para ${userEmail}`);
  
  // Por enquanto, apenas retorna sucesso
  return Promise.resolve();
}
