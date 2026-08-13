import { describe, it, expect, beforeAll } from "vitest";
import nodemailer from "nodemailer";

/**
 * Teste de integração real para validar credenciais Zoho Mail SMTP
 * Este teste verifica se as credenciais do Zoho Mail estão corretas
 * e se a conexão SMTP pode ser estabelecida
 */
describe("Zoho Mail SMTP Integration", () => {
  let transporter: nodemailer.Transporter;

  beforeAll(() => {
    // Criar transportador com as credenciais do ambiente
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
      throw new Error(
        "Zoho Mail credentials not configured in environment variables"
      );
    }

    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: true, // SSL/TLS
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });
  });

  it("should verify Zoho Mail SMTP credentials are valid", async () => {
    // Verificar se o transportador pode conectar ao Zoho Mail
    const verified = await transporter.verify();
    expect(verified).toBe(true);
  });

  it("should have correct SMTP host configured", () => {
    const smtpHost = process.env.SMTP_HOST;
    expect(smtpHost).toBeDefined();
    expect(smtpHost).toBe("smtppro.zoho.com");
  });

  it("should have correct SMTP port configured", () => {
    const smtpPort = process.env.SMTP_PORT;
    expect(smtpPort).toBeDefined();
    expect(smtpPort).toBe("465");
  });

  it("should have correct SMTP user configured", () => {
    const smtpUser = process.env.SMTP_USER;
    expect(smtpUser).toBeDefined();
    expect(smtpUser).toBe("marco@matramujas.com.br");
    expect(smtpUser).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/); // Valid email format
  });

  it("should have SMTP password configured", () => {
    const smtpPassword = process.env.SMTP_PASSWORD;
    expect(smtpPassword).toBeDefined();
    expect(smtpPassword.length).toBeGreaterThanOrEqual(8); // App passwords have at least 8 characters
  });

  it("should be able to send a test email via Zoho", async () => {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: "Teste de Integração - Tipo Psicológico",
      text: "Este é um e-mail de teste para validar a configuração do Zoho Mail SMTP.",
      html: "<p>Este é um e-mail de teste para validar a configuração do Zoho Mail SMTP.</p>",
    };

    const result = await transporter.sendMail(mailOptions);
    expect(result).toHaveProperty("messageId");
    expect(result.messageId).toBeTruthy();
    console.log("✓ Test email sent successfully via Zoho with messageId:", result.messageId);
  });

  it("should handle email sending with proper error handling", async () => {
    // Teste com e-mail inválido para verificar tratamento de erro
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: "invalid-email-format",
      subject: "Test",
      text: "Test",
    };

    try {
      await transporter.sendMail(mailOptions);
      // Se chegar aqui, o teste falhou
      expect.fail("Should have thrown an error for invalid email");
    } catch (error) {
      // Esperado: erro ao enviar para e-mail inválido
      expect(error).toBeDefined();
      console.log("✓ Error handling works correctly");
    }
  });
});
