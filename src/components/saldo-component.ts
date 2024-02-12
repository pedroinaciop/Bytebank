import { formatarData, formatarMoeda } from "../utils/formaters.js";
import { FormatoData } from "../types/FormatoData.js";
import Conta from "../types/Conta.js";

const elementoSaldo = document.querySelector('.valor') as HTMLElement;
const elementoDiaData = document.querySelector('#dia_data') as HTMLTimeElement;

elementoDiaData.textContent = formatarData(Conta.getDataAcesso(), FormatoData.DIA_SEMANA_MES_ANO);

renderizarSaldo();
function renderizarSaldo(): void {
    if(elementoSaldo != null) {
        elementoSaldo.textContent = formatarMoeda(Conta.getSaldo());
    }
}

const saldoComponent = {
    atualizar() {
        renderizarSaldo()
    }
}

export default saldoComponent;