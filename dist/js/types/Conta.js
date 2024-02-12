import { TipoTransacao } from './TipoTransacao.js';
let saldo = JSON.parse(localStorage.getItem("saldo")) || 0;
const transacoes = JSON.parse(localStorage.getItem("transacoes"), (key, value) => {
    if (key === "data") {
        return new Date(value);
    }
    return value;
}) || [];
function debitar(valor) {
    if (valor <= 0) {
        throw new Error("O valor a ser debitado deve ser maior do que zero!");
    }
    if (valor > saldo) {
        throw new Error("Saldo insuficiente");
    }
    saldo -= valor;
    localStorage.setItem("saldo", saldo.toString());
}
function depositar(valor) {
    if (valor <= 0) {
        throw new Error("O valor a ser depositado deve ser menor do que zero!");
    }
    saldo += valor;
    localStorage.setItem("saldo", saldo.toString());
}
const Conta = {
    getSaldo() {
        return saldo;
    },
    getDataAcesso() {
        return new Date();
    },
    getGruposTransacoes() {
        const gruposTransacoes = [];
        const listaTransacoe = structuredClone(transacoes);
        const transacoesOrdenadas = listaTransacoe.sort((t1, t2) => t2.data.getTime() - t1.data.getTime());
        let labelAtualGrupoTransacao = "";
        for (let transacao of transacoesOrdenadas) {
            let labelGrupoTransacao = transacao.data.toLocaleDateString("pt-br", { month: "long", year: "numeric" });
            if (labelAtualGrupoTransacao != labelGrupoTransacao) {
                labelAtualGrupoTransacao = labelGrupoTransacao;
                gruposTransacoes.push({
                    label: labelGrupoTransacao,
                    transacoes: []
                });
            }
            gruposTransacoes.at(-1).transacoes.push(transacao);
        }
        return gruposTransacoes;
    },
    registrarTransacao(novaTransacao) {
        if (novaTransacao.tipoTransacao == TipoTransacao.DEPOSITO) {
            depositar(novaTransacao.valor);
        }
        else if (novaTransacao.tipoTransacao == TipoTransacao.TRANSFERENCIA || novaTransacao.tipoTransacao == TipoTransacao.PAGAMENTO_BOLETO) {
            debitar(novaTransacao.valor);
            novaTransacao.valor *= -1;
        }
        else {
            throw new Error("Tipo de transação inválida");
        }
        transacoes.push(novaTransacao);
        localStorage.setItem("transacoes", JSON.stringify(transacoes));
    },
    agruparTransacoes() {
        const resumo = {
            totalDepositos: 0,
            totalTransferencias: 0,
            totalPagamentoBoleto: 0
        };
        for (let i = 0; i <= transacoes.length; i++) {
            if (transacoes[i].tipoTransacao === "Depósito") {
                resumo.totalDepositos += 1;
            }
            else if (transacoes[i].tipoTransacao === "Transferência") {
                resumo.totalTransferencias += 1;
            }
            else if (transacoes[i].tipoTransacao === "Pagamento de Boleto") {
                resumo.totalPagamentoBoleto += 1;
            }
            console.log(`Total de operações 'Depósito': ${resumo.totalDepositos}
                         Total de operações 'Transferência': ${resumo.totalTransferencias}
                         Total de operaçãoes 'Pagamento de Boleto': ${resumo.totalPagamentoBoleto}`);
        }
    }
};
export default Conta;
