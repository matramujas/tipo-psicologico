import { describe, it, expect } from "vitest";
import { ENV } from "./_core/env";

describe("Environment Variables Debug", () => {
  it("should have Gmail credentials loaded from environment", () => {
    console.log("[DEBUG] ENV.gmailUser:", ENV.gmailUser);
    console.log("[DEBUG] ENV.gmailAppPassword:", ENV.gmailAppPassword);
    console.log("[DEBUG] process.env.GMAIL_USER:", process.env.GMAIL_USER);
    console.log("[DEBUG] process.env.GMAIL_APP_PASSWORD:", process.env.GMAIL_APP_PASSWORD);

    // Verificar se as variáveis estão definidas
    expect(ENV.gmailUser).toBeDefined();
    expect(ENV.gmailAppPassword).toBeDefined();
    expect(ENV.gmailUser).toBeTruthy();
    expect(ENV.gmailAppPassword).toBeTruthy();
  });

  it("should have Gmail user as valid email", () => {
    expect(ENV.gmailUser).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it("should have Gmail app password with correct format", () => {
    // Gmail app passwords devem ter pelo menos 8 caracteres
    expect(ENV.gmailAppPassword.length).toBeGreaterThanOrEqual(8);
  });

  it("should have Gmail user set to marco@matramujas.com.br", () => {
    expect(ENV.gmailUser).toBe("marco@matramujas.com.br");
  });

  it("should have Gmail app password set to h3ku1U8NHLqe", () => {
    expect(ENV.gmailAppPassword).toBe("h3ku1U8NHLqe");
  });
});
