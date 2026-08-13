import { describe, it, expect } from "vitest";
import { calculatePsychologicalType, questions } from "./questionnaire-data";

describe("Questionnaire Data - Gabarito Correto", () => {
  it("deve ter exatamente 70 questões", () => {
    expect(questions).toHaveLength(70);
  });

  it("deve ter 10 questões para E/I", () => {
    const allA: Record<number, "a" | "b"> = {};
    questions.forEach((q) => {
      allA[q.id] = "a";
    });

    const result = calculatePsychologicalType(allA);
    expect(result.scores.E + result.scores.I).toBe(10);
  });

  it("deve ter 20 questões para S/N", () => {
    const allA: Record<number, "a" | "b"> = {};
    questions.forEach((q) => {
      allA[q.id] = "a";
    });

    const result = calculatePsychologicalType(allA);
    expect(result.scores.S + result.scores.N).toBe(20);
  });

  it("deve ter 20 questões para T/F", () => {
    const allA: Record<number, "a" | "b"> = {};
    questions.forEach((q) => {
      allA[q.id] = "a";
    });

    const result = calculatePsychologicalType(allA);
    expect(result.scores.T + result.scores.F).toBe(20);
  });

  it("deve ter 20 questões para J/P", () => {
    const allA: Record<number, "a" | "b"> = {};
    questions.forEach((q) => {
      allA[q.id] = "a";
    });

    const result = calculatePsychologicalType(allA);
    expect(result.scores.J + result.scores.P).toBe(20);
  });

  it("deve calcular corretamente o tipo INTJ", () => {
    const answers: Record<number, "a" | "b"> = {};
    
    // Simular respostas para INTJ (I, N, T, J)
    questions.forEach((q) => {
      if (q.preferenceA === "I" || q.preferenceA === "N" || q.preferenceA === "T" || q.preferenceA === "J") {
        answers[q.id] = "a";
      } else {
        answers[q.id] = "b";
      }
    });

    const result = calculatePsychologicalType(answers);
    expect(result.type).toBe("INTJ");
    expect(result.scores.I).toBeGreaterThan(result.scores.E);
    expect(result.scores.N).toBeGreaterThan(result.scores.S);
    expect(result.scores.T).toBeGreaterThan(result.scores.F);
    expect(result.scores.J).toBeGreaterThan(result.scores.P);
  });

  it("deve retornar um dos 16 tipos validos", () => {
    const validTypes = [
      "ISTJ", "ISFJ", "INFJ", "INTJ",
      "ISTP", "ISFP", "INFP", "INTP",
      "ESTP", "ESFP", "ENFP", "ENTP",
      "ESTJ", "ESFJ", "ENFJ", "ENTJ"
    ];

    const answers: Record<number, "a" | "b"> = {};
    questions.forEach((q, index) => {
      answers[q.id] = index % 2 === 0 ? "a" : "b";
    });

    const result = calculatePsychologicalType(answers);
    expect(validTypes).toContain(result.type);
  });
});
