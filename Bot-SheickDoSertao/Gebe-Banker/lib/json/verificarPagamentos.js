const axios = require('axios');
const fs = require('fs');
const { registrarAluguel } = require('./aluguel.js');

const PAGAMENTOS_ARQ = './Gebe-Banker/lib/json/pagamentos_pendentes.json';
const TOKEN_MERCADO_PAGO = ""; // Troque pelo seu token MP

function lerJSON(caminho) {
    try { return JSON.parse(fs.readFileSync(caminho)); } catch { return []; }
}
function salvarJSON(caminho, dados) {
    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));
}

async function verificarPagamentos(gebe) {
    let pagamentos = lerJSON(PAGAMENTOS_ARQ);

    for (let i = pagamentos.length - 1; i >= 0; i--) {
        const pagamento = pagamentos[i];
        if (pagamento.status !== 'aprovado') {
            try {
                const res = await axios.get(`https://api.mercadopago.com/v1/payments/${pagamento.paymentId}`, {
                    headers: { Authorization: `Bearer ${TOKEN_MERCADO_PAGO}` }
                });

                if (res.data.status === 'approved') {
                    pagamento.status = 'aprovado';
                    registrarAluguel(pagamento.id_gp, pagamento.nome, pagamento.duracao);

                    // Envia mensagem de confirmação no grupo
                    await gebe.sendMessage(pagamento.id_gp, { 
                        text: `✅ Aluguel ativado/renovado com sucesso!\n⏳ Duração: ${pagamento.duracao}` 
                    });

                    // Remove pagamento aprovado da lista
                    pagamentos.splice(i, 1);
                }
            } catch (err) {
                console.error(`Erro ao verificar pagamento ${pagamento.paymentId}:`, err.message);
            }
        }
    }

    salvarJSON(PAGAMENTOS_ARQ, pagamentos);
}

// Loop
function iniciarLoop(gebe, intervalo = 30000) {
    setInterval(() => verificarPagamentos(gebe), intervalo);
}

module.exports = { iniciarLoop };