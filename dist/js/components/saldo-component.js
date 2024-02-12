import { formatarData, formatarMoeda } from "../utils/formaters.js";
import { FormatoData } from "../types/FormatoData.js";
import Conta from "../types/Conta.js";
const elementoSaldo = document.querySelector('.valor');
const elementoDiaData = document.querySelector('#dia_data');
elementoDiaData.textContent = formatarData(Conta.getDataAcesso(), FormatoData.DIA_SEMANA_MES_ANO);
renderizarSaldo();
function renderizarSaldo() {
    if (elementoSaldo != null) {
        elementoSaldo.textContent = formatarMoeda(Conta.getSaldo());
    }
}
const saldoComponent = {
    atualizar() {
        renderizarSaldo();
    }
};
export default saldoComponent;
