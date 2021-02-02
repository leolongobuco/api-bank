import { v4 as uuidGenerator } from 'uuid';

class Transacao {
  constructor(operacao, valor, tipo) {
    this.id = uuidGenerator();
    this.operacao = operacao;
    this.valor = valor;
    this.tipo = tipo;
  }
}

export default Transacao;
