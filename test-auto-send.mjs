#!/usr/bin/env node

/**
 * Script de teste para verificar o envio automático de resultado para o administrador
 * Simula uma submissão completa do formulário
 */

const API_URL = 'http://localhost:3000/api/trpc/questionnaire.saveResult';

// Dados de teste
const testData = {
  fullName: 'Teste Automático',
  psychologicalType: 'INTJ',
  answers: {
    '1': 'a',
    '2': 'b',
    '3': 'a',
    '4': 'b',
    '5': 'a',
    '6': 'b',
    '7': 'a',
    '8': 'b',
    '9': 'a',
    '10': 'b',
    '11': 'a',
    '12': 'b',
    '13': 'a',
    '14': 'b',
    '15': 'a',
    '16': 'b',
    '17': 'a',
    '18': 'b',
    '19': 'a',
    '20': 'b',
    '21': 'a',
    '22': 'b',
    '23': 'a',
    '24': 'b',
    '25': 'a',
    '26': 'b',
    '27': 'a',
    '28': 'b',
    '29': 'a',
    '30': 'b',
    '31': 'a',
    '32': 'b',
    '33': 'a',
    '34': 'b',
    '35': 'a',
    '36': 'b',
    '37': 'a',
    '38': 'b',
    '39': 'a',
    '40': 'b',
    '41': 'a',
    '42': 'b',
    '43': 'a',
    '44': 'b',
    '45': 'a',
    '46': 'b',
    '47': 'a',
    '48': 'b',
    '49': 'a',
    '50': 'b',
    '51': 'a',
    '52': 'b',
    '53': 'a',
    '54': 'b',
    '55': 'a',
    '56': 'b',
    '57': 'a',
    '58': 'b',
    '59': 'a',
    '60': 'b',
    '61': 'a',
    '62': 'b',
    '63': 'a',
    '64': 'b',
    '65': 'a',
    '66': 'b',
    '67': 'a',
    '68': 'b',
    '69': 'a',
    '70': 'b',
  },
  scores: {
    E: 8,
    I: 2,
    S: 5,
    N: 15,
    T: 18,
    F: 2,
    J: 15,
    P: 5,
  },
};

async function testAutoSend() {
  console.log('🧪 Iniciando teste de envio automático...\n');
  console.log('📤 Enviando dados de teste para:', API_URL);
  console.log('👤 Nome:', testData.fullName);
  console.log('🎯 Tipo:', testData.psychologicalType);
  console.log('');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        json: testData,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Teste enviado com sucesso!');
      console.log('📧 Resultado enviado para: 9362.pw@gmail.com');
      console.log('');
      console.log('Resposta do servidor:', JSON.stringify(result, null, 2));
      console.log('');
      console.log('⏳ Aguarde alguns segundos para receber o e-mail...');
    } else {
      console.log('❌ Erro ao enviar teste');
      console.log('Resposta:', JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
  }
}

testAutoSend();
