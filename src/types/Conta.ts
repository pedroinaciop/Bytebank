import { ResumoTransacoes } from './ResumoTransacoes.js';
import { Transacao } from './Transacao.js';
import { TipoTransacao } from './TipoTransacao.js';
import { GrupoTransacao } from './GrupoTransacao.js';


let saldo: number = JSON.parse(localStorage.getItem("saldo")) || 0;
const transacoes: Transacao[] = JSON.parse(localStorage.getItem("transacoes"), (key: string, value: string) => {
    if (key === "data") {
        return new Date(value);
    }

        return value;
}) || [];

function debitar(valor: number): void  {
    if (valor <= 0) {
        throw new Error ("O valor a ser debitado deve ser maior do que zero!")
    }

    if (valor > saldo) {
        throw new Error ("Saldo insuficiente")
    } 

    saldo -= valor;
    localStorage.setItem("saldo", saldo.toString())
}

function depositar(valor: number): void  {
    if (valor <= 0) {
        throw new Error ("O valor a ser depositado deve ser menor do que zero!");
    }
    saldo += valor;
    localStorage.setItem("saldo", saldo.toString())
}

const Conta = {
    getSaldo() {
        return saldo;
    },

    getDataAcesso() :Date {
        return new Date()
    },

    getGruposTransacoes(): GrupoTransacao[] {
        const gruposTransacoes: GrupoTransacao[] = []
        const listaTransacoe: Transacao[] = structuredClone(transacoes);
        const transacoesOrdenadas: Transacao[] = listaTransacoe.sort((t1,t2) => t2.data.getTime() - t1.data.getTime());
        let labelAtualGrupoTransacao: string = "";

        for (let transacao of transacoesOrdenadas) {
            let labelGrupoTransacao: string = transacao.data.toLocaleDateString("pt-br", {month: "long", year: "numeric"});
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

    registrarTransacao(novaTransacao: Transacao) {
        if (novaTransacao.tipoTransacao == TipoTransacao.DEPOSITO) {
            depositar(novaTransacao.valor)
        } 
        
        else if (novaTransacao.tipoTransacao == TipoTransacao.TRANSFERENCIA || novaTransacao.tipoTransacao == TipoTransacao.PAGAMENTO_BOLETO) {
            debitar(novaTransacao.valor)
            novaTransacao.valor *= -1;
        } 
        
        else {
            throw new Error("Tipo de transação inválida");
        }

        transacoes.push(novaTransacao);
        localStorage.setItem("transacoes", JSON.stringify(transacoes));
    },

    agruparTransacoes() {
        const resumo: ResumoTransacoes = {
            totalDepositos: 0,
            totalTransferencias: 0,
            totalPagamentoBoleto: 0
        }
        
        for (let i=0;i<=transacoes.length;i++) {
            if (transacoes[i].tipoTransacao === "Depósito") {
                resumo.totalDepositos += 1;
            } else if (transacoes[i].tipoTransacao === "Transferência") {
                resumo.totalTransferencias += 1;
            }  else if (transacoes[i].tipoTransacao === "Pagamento de Boleto") {
                resumo.totalPagamentoBoleto += 1;
            }
            console.log(`Total de operações 'Depósito': ${resumo.totalDepositos}
                         Total de operações 'Transferência': ${resumo.totalTransferencias}
                         Total de operaçãoes 'Pagamento de Boleto': ${resumo.totalPagamentoBoleto}`);
        }
    }
}

export default Conta;