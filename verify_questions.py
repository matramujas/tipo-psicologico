#!/usr/bin/env python3
"""
Script para verificar os erros nas somatórias das questões
"""

# Dados extraídos do arquivo questionnaire-data.ts
questions_data = [
    # Questão 1
    {"id": 1, "a": "E", "b": "I"},
    # Questão 2
    {"id": 2, "a": "S", "b": "N"},
    # Questão 3
    {"id": 3, "a": "N", "b": "S"},
    # Questão 4
    {"id": 4, "a": "T", "b": "F"},
    # Questão 5
    {"id": 5, "a": "T", "b": "F"},
    # Questão 6
    {"id": 6, "a": "J", "b": "P"},
    # Questão 7
    {"id": 7, "a": "J", "b": "P"},
    # Questão 8
    {"id": 8, "a": "E", "b": "I"},
    # Questão 9
    {"id": 9, "a": "S", "b": "N"},
    # Questão 10
    {"id": 10, "a": "S", "b": "N"},
    # Questão 11
    {"id": 11, "a": "T", "b": "F"},
    # Questão 12
    {"id": 12, "a": "T", "b": "F"},
    # Questão 13
    {"id": 13, "a": "J", "b": "P"},
    # Questão 14
    {"id": 14, "a": "P", "b": "J"},
    # Questão 15
    {"id": 15, "a": "E", "b": "I"},
    # Questão 16
    {"id": 16, "a": "S", "b": "N"},
    # Questão 17
    {"id": 17, "a": "S", "b": "N"},
    # Questão 18
    {"id": 18, "a": "T", "b": "F"},
    # Questão 19
    {"id": 19, "a": "T", "b": "F"},
    # Questão 20
    {"id": 20, "a": "J", "b": "P"},
    # Questão 21
    {"id": 21, "a": "T", "b": "F"},
    # Questão 22
    {"id": 22, "a": "E", "b": "I"},
    # Questão 23
    {"id": 23, "a": "S", "b": "N"},
    # Questão 24
    {"id": 24, "a": "S", "b": "N"},
    # Questão 25
    {"id": 25, "a": "T", "b": "F"},
    # Questão 26
    {"id": 26, "a": "F", "b": "T"},
    # Questão 27
    {"id": 27, "a": "J", "b": "P"},
    # Questão 28
    {"id": 28, "a": "J", "b": "P"},
    # Questão 29
    {"id": 29, "a": "E", "b": "I"},
    # Questão 30
    {"id": 30, "a": "S", "b": "N"},
    # Questão 31
    {"id": 31, "a": "T", "b": "F"},
    # Questão 32
    {"id": 32, "a": "J", "b": "P"},
    # Questão 33
    {"id": 33, "a": "T", "b": "F"},
    # Questão 34
    {"id": 34, "a": "J", "b": "P"},
    # Questão 35
    {"id": 35, "a": "J", "b": "P"},
    # Questão 36
    {"id": 36, "a": "E", "b": "I"},
    # Questão 37
    {"id": 37, "a": "S", "b": "N"},
    # Questão 38
    {"id": 38, "a": "T", "b": "F"},
    # Questão 39
    {"id": 39, "a": "T", "b": "F"},
    # Questão 40
    {"id": 40, "a": "T", "b": "F"},
    # Questão 41
    {"id": 41, "a": "J", "b": "P"},
    # Questão 42
    {"id": 42, "a": "J", "b": "P"},
    # Questão 43
    {"id": 43, "a": "E", "b": "I"},
    # Questão 44
    {"id": 44, "a": "S", "b": "N"},
    # Questão 45
    {"id": 45, "a": "S", "b": "N"},
    # Questão 46
    {"id": 46, "a": "T", "b": "F"},
    # Questão 47
    {"id": 47, "a": "T", "b": "F"},
    # Questão 48
    {"id": 48, "a": "J", "b": "P"},
    # Questão 49
    {"id": 49, "a": "J", "b": "P"},
    # Questão 50
    {"id": 50, "a": "E", "b": "I"},
    # Questão 51
    {"id": 51, "a": "S", "b": "N"},
    # Questão 52
    {"id": 52, "a": "S", "b": "N"},
    # Questão 53
    {"id": 53, "a": "T", "b": "F"},
    # Questão 54
    {"id": 54, "a": "T", "b": "F"},
    # Questão 55
    {"id": 55, "a": "J", "b": "P"},
    # Questão 56
    {"id": 56, "a": "J", "b": "P"},
    # Questão 57
    {"id": 57, "a": "E", "b": "I"},
    # Questão 58
    {"id": 58, "a": "S", "b": "N"},
    # Questão 59
    {"id": 59, "a": "S", "b": "N"},
    # Questão 60
    {"id": 60, "a": "F", "b": "T"},
    # Questão 61
    {"id": 61, "a": "T", "b": "F"},
    # Questão 62
    {"id": 62, "a": "J", "b": "P"},
    # Questão 63
    {"id": 63, "a": "S", "b": "N"},
    # Questão 64
    {"id": 64, "a": "E", "b": "I"},
    # Questão 65
    {"id": 65, "a": "S", "b": "N"},
    # Questão 66
    {"id": 66, "a": "F", "b": "T"},
    # Questão 67
    {"id": 67, "a": "T", "b": "F"},
    # Questão 68
    {"id": 68, "a": "F", "b": "T"},
    # Questão 69
    {"id": 69, "a": "J", "b": "P"},
    # Questão 70
    {"id": 70, "a": "J", "b": "P"},
]

# Contar preferências
counts = {
    "E": 0, "I": 0,
    "S": 0, "N": 0,
    "T": 0, "F": 0,
    "J": 0, "P": 0
}

for q in questions_data:
    counts[q["a"]] += 1
    counts[q["b"]] += 1

print("Contagem de preferências (cada questão tem 2 opções):")
print(f"E: {counts['E']}, I: {counts['I']} (Total E+I: {counts['E'] + counts['I']})")
print(f"S: {counts['S']}, N: {counts['N']} (Total S+N: {counts['S'] + counts['N']})")
print(f"T: {counts['T']}, F: {counts['F']} (Total T+F: {counts['T'] + counts['F']})")
print(f"J: {counts['J']}, P: {counts['P']} (Total J+P: {counts['J'] + counts['P']})")

print("\nErros encontrados:")
if counts['S'] + counts['N'] != 20:
    print(f"❌ S+N = {counts['S'] + counts['N']} (deveria ser 20)")
else:
    print(f"✓ S+N = {counts['S'] + counts['N']}")

if counts['T'] + counts['F'] != 20:
    print(f"❌ T+F = {counts['T'] + counts['F']} (deveria ser 20)")
else:
    print(f"✓ T+F = {counts['T'] + counts['F']}")

if counts['J'] + counts['P'] != 20:
    print(f"❌ J+P = {counts['J'] + counts['P']} (deveria ser 20)")
else:
    print(f"✓ J+P = {counts['J'] + counts['P']}")

# Encontrar questões problemáticas
print("\n\nQuestões com erro (preferências não balanceadas):")
for i, q in enumerate(questions_data, 1):
    if q["a"] == q["b"]:
        print(f"Questão {i}: ERRO - mesma preferência em ambas opções ({q['a']})")
