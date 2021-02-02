import { v4 as uuidGenerator } from 'uuid';

class User {
  constructor(nome, cpf, email, idade) {
    this.id = uuidGenerator();
    this.nome = nome;
    this.cpf = cpf;
    this.email = email;
    this.idade = idade;
    this.transacao = [];
  }
}

export default User;
