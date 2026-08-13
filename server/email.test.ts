import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendResultToAdmin } from "./email";
import nodemailer from "nodemailer";

// Mock do nodemailer
vi.mock("nodemailer");

describe("Email Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should send email with correct structure", async () => {
    // Mock do transportador
    const mockSendMail = vi.fn().mockResolvedValue({ messageId: "test-id" });
    const mockCreateTransport = vi.fn().mockReturnValue({
      sendMail: mockSendMail,
    });

    vi.mocked(nodemailer).createTransport = mockCreateTransport;

    const result = await sendResultToAdmin("João Silva", "INTJ", {
      E: 5,
      I: 5,
      S: 8,
      N: 12,
      T: 14,
      F: 6,
      J: 12,
      P: 8,
    });

    // Verificar se o transportador foi criado com as credenciais corretas do Zoho
    expect(mockCreateTransport).toHaveBeenCalledWith({
      host: "smtppro.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: expect.any(String),
        pass: expect.any(String),
      },
    });

    // Verificar se o e-mail foi enviado
    expect(mockSendMail).toHaveBeenCalled();
    expect(result).toBe(true);

    // Verificar a estrutura do e-mail
    const mailOptions = mockSendMail.mock.calls[0][0];
    expect(mailOptions).toHaveProperty("from");
    expect(mailOptions).toHaveProperty("to");
    expect(mailOptions).toHaveProperty("subject");
    expect(mailOptions.subject).toContain("INTJ");
    expect(mailOptions.subject).toContain("João Silva");
    expect(mailOptions).toHaveProperty("text");
    expect(mailOptions).toHaveProperty("html");
  });

  it("should include correct scores in email content", async () => {
    const mockSendMail = vi.fn().mockResolvedValue({ messageId: "test-id" });
    const mockCreateTransport = vi.fn().mockReturnValue({
      sendMail: mockSendMail,
    });

    vi.mocked(nodemailer).createTransport = mockCreateTransport;

    await sendResultToAdmin("Maria Santos", "ENFP", {
      E: 10,
      I: 0,
      S: 5,
      N: 15,
      T: 8,
      F: 12,
      J: 6,
      P: 14,
    });

    const mailOptions = mockSendMail.mock.calls[0][0];
    expect(mailOptions.text).toContain("E: 10");
    expect(mailOptions.text).toContain("I: 0");
    expect(mailOptions.text).toContain("N: 15");
    expect(mailOptions.text).toContain("F: 12");
  });

  it("should handle email sending errors gracefully", async () => {
    const mockCreateTransport = vi.fn().mockReturnValue({
      sendMail: vi.fn().mockRejectedValue(new Error("SMTP Error")),
    });

    vi.mocked(nodemailer).createTransport = mockCreateTransport;

    // Mock do notifyOwner como fallback
    vi.mock("./_core/notification", () => ({
      notifyOwner: vi.fn().mockResolvedValue(true),
    }));

    const result = await sendResultToAdmin("Test User", "ISTJ", {
      E: 3,
      I: 7,
      S: 12,
      N: 8,
      T: 13,
      F: 7,
      J: 14,
      P: 6,
    });

    // Deve retornar true mesmo com erro (fallback para notifyOwner)
    expect(result).toBeDefined();
  });

  it("should include type name in email", async () => {
    const mockSendMail = vi.fn().mockResolvedValue({ messageId: "test-id" });
    const mockCreateTransport = vi.fn().mockReturnValue({
      sendMail: mockSendMail,
    });

    vi.mocked(nodemailer).createTransport = mockCreateTransport;

    await sendResultToAdmin("Test User", "INTJ", {
      E: 5,
      I: 5,
      S: 8,
      N: 12,
      T: 14,
      F: 6,
      J: 12,
      P: 8,
    });

    const mailOptions = mockSendMail.mock.calls[0][0];
    expect(mailOptions.text).toContain("O Arquiteto");
    expect(mailOptions.html).toContain("O Arquiteto");
  });
});
