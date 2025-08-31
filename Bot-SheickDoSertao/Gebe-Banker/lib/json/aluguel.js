const axios = require('axios');
const fs = require('fs');

const TOKEN_MERCADO_PAGO = ""; // Seu token MP

// 📌 Função para gerar pagamento PIX
async function gerarPagamentoAluguel(from, groupName, duracao, enviar) {
    try {
        if (!duracao) return enviar(`❌ Formato inválido.\nExemplo: 5h ou 3d ou 7 (semanal), 15 (mensal), 50 (anual)`);

        duracao = duracao.trim().toLowerCase();
        let valor = 0;

        // Planos fixos
        if(duracao === '8') valor = 7;       // semanal
        else if(duracao === '30') valor = 15; // mensal
        else if(duracao === '360') valor = 50; // anual
        // Planos variáveis
        else if(duracao.endsWith('h')) valor = parseInt(duracao.replace('h','')) * 0.5;
        else if(duracao.endsWith('d')) valor = parseInt(duracao.replace('d','')) * 1;
        else return enviar("❌ Formato inválido.");

        const idempotencyKey = `aluguel-${from}-${Date.now()}`;

        const resMP = await axios.post("https://api.mercadopago.com/v1/payments", {
            transaction_amount: valor,
            payment_method_id: "pix",
            description: `Aluguel do bot - Grupo: ${groupName} - ${duracao}`,
            payer: { email: "cliente@exemplo.com" },
            external_reference: JSON.stringify({ id_gp: from, nome: groupName, duracao })
        }, {
            headers: {
                Authorization: `Bearer ${TOKEN_MERCADO_PAGO}`,
                'Content-Type': 'application/json',
                'X-Idempotency-Key': idempotencyKey
            }
        });

        const pagamento = resMP.data;
        const qrBase64 = pagamento?.point_of_interaction?.transaction_data?.qr_code_base64;
        const copiaCola = pagamento?.point_of_interaction?.transaction_data?.qr_code;

        if(!qrBase64 || !copiaCola) return enviar("❌ Não foi possível gerar o PIX.");

        enviar(`📌 Pagamento PIX gerado!
💰 Valor: R$${valor}
⏳ Duração: ${duracao}
🔗 Copia e cola: ${copiaCola}`);

        let pagamentosPendentes = [];
        try { pagamentosPendentes = JSON.parse(fs.readFileSync("./Gebe-Banker/lib/json/pagamentos_pendentes.json")); } catch(e) {}
        pagamentosPendentes.push({ id_gp: from, nome: groupName, duracao, paymentId: pagamento.id, status: 'pendente' });
        fs.writeFileSync("./Gebe-Banker/lib/json/pagamentos_pendentes.json", JSON.stringify(pagamentosPendentes, null, 2));

    } catch(err) {
        console.error("Erro Mercado Pago:", err.response?.data || err.message);
        enviar("❌ Ocorreu um erro ao gerar o PIX.");
    }
}

// 📌 Função para registrar/renovar aluguel
function registrarAluguel(id_gp, nome, duracao) {
    const agora = Math.floor(Date.now() / 1000);
    const tempo = duracao.endsWith("h") 
        ? parseInt(duracao.replace("h","")) * 3600 
        : duracao.endsWith("d") 
            ? parseInt(duracao.replace("d","")) * 86400 
            : duracao === '7' 
                ? 7*86400 
                : duracao === '15' 
                    ? 30*86400 
                    : duracao === '50' 
                        ? 365*86400 
                        : 0;

    let rg_aluguel = [];
    try { rg_aluguel = JSON.parse(fs.readFileSync("./Gebe-Banker/lib/json/rg_aluguel.json")); } catch(e) {}

    const index = rg_aluguel.findIndex(i => i.id_gp === id_gp);
    if(index === -1) rg_aluguel.push({ id_gp, nome_: nome, vencimento: agora + tempo });
    else rg_aluguel[index].vencimento = agora + tempo;

    fs.writeFileSync("./Gebe-Banker/lib/json/rg_aluguel.json", JSON.stringify(rg_aluguel, null, 2));
}

// 📌 Função para verificar pagamentos
async function verificarPagamento(from, enviar) {
    try {
        let pagamentosPendentes = [];
        try { pagamentosPendentes = JSON.parse(fs.readFileSync("./Gebe-Banker/lib/json/pagamentos_pendentes.json")); } catch(e) {}

        if(!pagamentosPendentes.length) return enviar("⚠️ Nenhum pagamento pendente encontrado.");

        let atualizados = [];
        let pagos = [];

        for(const pg of pagamentosPendentes) {
            try {
                const res = await axios.get(`https://api.mercadopago.com/v1/payments/${pg.paymentId}`, {
                    headers: { Authorization: `Bearer ${TOKEN_MERCADO_PAGO}` }
                });

                const status = res.data.status;

                if(status === "approved") {
                    registrarAluguel(pg.id_gp, pg.nome, pg.duracao);
                    pagos.push(pg);
                } else atualizados.push(pg);
            } catch(e) {
                console.error("Erro ao verificar pagamento:", e.response?.data || e.message);
                atualizados.push(pg);
            }
        }

        fs.writeFileSync("./Gebe-Banker/lib/json/pagamentos_pendentes.json", JSON.stringify(atualizados, null, 2));

        if(pagos.length) {
            let txt = "✅ Pagamentos aprovados:\n";
            for(const p of pagos) txt += `- Grupo: ${p.nome}\n  Duração: ${p.duracao}\n\n`;
            enviar(txt);
        } else enviar("⚠️ Nenhum pagamento aprovado ainda. Tente novamente mais tarde.");

    } catch(err) {
        console.error("Erro geral verificação:", err.message);
        enviar("❌ Erro ao verificar pagamentos.");
    }
}

module.exports = { gerarPagamentoAluguel, registrarAluguel, verificarPagamento };