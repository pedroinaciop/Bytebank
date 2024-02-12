import { formatarData, formatarMoeda } from '../utils/formaters.js';
import { FormatoData } from '../types/FormatoData.js';
import Conta from "../types/Conta.js";
const elementoRegistroTransacoesExtrato = document.querySelector(".extrato .registro-transacoes");
rendenrizarExtrato();
function rendenrizarExtrato() {
    const gruposTransacoes = Conta.getGruposTransacoes();
    elementoRegistroTransacoesExtrato.innerHTML = "";
    let htmlRegistroTransacoes = '';
    for (let grupoTransacao of gruposTransacoes) {
        let htmlTransacaoItem = "";
        for (let transacao of grupoTransacao.transacoes) {
            htmlTransacaoItem += `
                    <div class="transacao-item">
                        <div class="transacao-info">
                            <span class="tipo">${transacao.tipoTransacao}</span>
                            <strong class="valor">${formatarMoeda(transacao.valor)}</strong>
                        </div>
                        <time class="data">${formatarData(transacao.data, FormatoData.DIA_MES)}</time>
                    </div>
                `;
        }
        htmlRegistroTransacoes += `
                <div class="transacoes-group">
                    <strong class="mes-group">${grupoTransacao.label}</strong>
                        ${htmlTransacaoItem}
                </div>
            `;
    }
    if (htmlRegistroTransacoes === "") {
        htmlRegistroTransacoes = "<div>Não há transações registradas.</div>";
    }
    elementoRegistroTransacoesExtrato.innerHTML = htmlRegistroTransacoes;
}
const ExtratoComponent = {
    atualizar() {
        rendenrizarExtrato();
    }
};
export default ExtratoComponent;
