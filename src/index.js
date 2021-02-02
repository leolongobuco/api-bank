/* eslint-disable object-shorthand */
/* eslint-disable radix */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-shadow */
/* eslint-disable no-else-return */
import express from 'express';
import routes from './routes';
import User from './app/user';
import Transacao from './app/transacao';

const app = express();
app.use(express.json());
app.use(routes);

const usuarios = [];

app.post('/user', (request, response) => {
  const { nome, cpf, email, idade } = request.body;

  const buscaCpf = usuarios.find(user => user.cpf === cpf);

  if (!nome || !cpf || !email || !idade) {
    return response
      .status(404)
      .json({ error_message: 'Data não encontrado, verifique body params' });
  } else if (buscaCpf) {
    return response.status(404).json({ error_message: 'CPF duplicado' });
  } else {
    const usuario = new User(nome, cpf, email, idade);
    usuarios.push(usuario);
    return response.json(usuario);
  }
});

app.get('/user/:id', (request, response) => {
  const { id } = request.params;

  const usuario = usuarios.find(user => user.id === id);

  if (!usuario) {
    return response
      .status(404)
      .json({ error_message: 'Usuário não encontrado' });
  }

  const objectUser = {
    id: usuario.id,
    nome: usuario.nome,
    cpf: usuario.cpf,
    email: usuario.email,
    idade: usuario.idade,
  };
  return response.json(objectUser);
});

app.get('/user', (request, response) => {
  if (usuarios.length <= 0) {
    return response
      .status(404)
      .json({ error_message: 'Nenhum usuário registrado' });
  }

  const novosUsuarios = usuarios.map(user => {
    const novoUsuario = {
      id: user.id,
      nome: user.nome,
      cpf: user.cpf,
      email: user.email,
      idade: user.idade,
    };

    return novoUsuario;
  });

  return response.json(novosUsuarios);
});

app.put('user/:id', (request, response) => {
  const { id } = request.params;
  const { nome, cpf, email, idade } = request.body;

  if (!nome || !cpf || !email || !idade) {
    return response
      .status(404)
      .json({ error_message: 'Data não encontrado, verifique body params' });
  }
  const indexUsuario = usuarios.findIndex(user => user.id === id);

  if (indexUsuario < 0) {
    return response
      .status(404)
      .json({ error_message: 'Usuário não econtrado' });
  } else {
    usuarios[indexUsuario].nome = nome;
    usuarios[indexUsuario].cpf = cpf;
    usuarios[indexUsuario].email = email;
    usuarios[indexUsuario].idade = idade;

    return response.json(usuarios[indexUsuario]);
  }
});

app.delete('/user/:id', (request, response) => {
  const { id } = request.params;

  const indexUsuario = usuarios.findIndex(user => user.id === id);

  if (indexUsuario < 0) {
    return response
      .status(404)
      .json({ error_message: 'Usuário não encontrado' });
  }

  usuarios.splice(indexUsuario, 1);
  return response.status(200).send();
});

app.post('/user/:id/transactions', (request, response) => {
  const { id } = request.params;
  const { operacao, valor, tipo } = request.body;

  if (!operacao || !valor || !tipo) {
    return response.status(404).json({
      error_message: 'Data não encontrado, verifique os dados enviados',
    });
  } else if (tipo !== 'income' && tipo !== 'outcome') {
    return response
      .status(404)
      .json({ error_message: 'Esse tipo de operação não é valida' });
  }

  const usuario = usuarios.find(user => user.id === id);

  if (!usuario) {
    return response
      .status(404)
      .json({ error_message: 'Usuário não encontrado' });
  }

  const transacao = new Transacao(operacao, valor, tipo);
  usuario.transacao.push(transacao);

  return response.json(usuario);
});

app.get('/users/:id/transactions/:idTransacao', (request, response) => {
  const { id, idTransacao } = request.params;

  const usuario = usuarios.find(user => user.id === id);
  const transacao = usuario.transactions.findIndex(
    transaction => transaction.id === idTransacao
  );

  if (!usuario) {
    return response
      .status(404)
      .json({ error_message: 'Usuário não encontrado' });
  }

  if (transacao < 0) {
    return response
      .status(404)
      .json({ error_message: 'Transação não encontrada' });
  }

  return response.json(usuario.transacao[transacao]);
});

app.get('/user/:id/transactions', (request, response) => {
  const { id } = request.params;

  const usuario = usuarios.find(user => user.id === id);

  if (!usuario) {
    return response
      .status(404)
      .json({ error_message: 'Usuário não encontrado' });
  }

  if (usuario.transacao.length <= 0) {
    return response
      .status(404)
      .json({ error_message: 'Esse usuário não possui nenhuma transação' });
  }

  let income = 0;
  let outcome = 0;

  const total = usuario.transacao.reduce((total, next) => {
    next.type === 'income'
      ? (income += parseInt(next.valor))
      : (outcome += parseInt(next.valor));
    return income - outcome;
  }, 0);

  const objectTransacao = {
    income: income,
    outcome: outcome,
    total: total,
  };

  return response.json({
    transacao: usuario.transacao,
    objectTransacao: objectTransacao,
  });
});

app.put('/user/:id/transactions/idTransacao', (request, response) => {
  const { id, idTransacao } = request.params;
  const { operacao, valor, tipo } = request.body;

  const usuario = usuarios.find(user => user.id === id);

  if (!usuario) {
    return response
      .status(404)
      .json({ error_message: 'Usuário não encontrado' });
  }

  if (!operacao || !valor || !tipo) {
    return response.status(404).json({
      error_message: 'Data não encontrado, verifique os dados enviados',
    });
  } else if (tipo !== 'income' && tipo !== 'outcome') {
    return response
      .status(404)
      .json({ error_message: 'Esse tipo de operação não é valida' });
  }

  const indexTransacao = usuario.transacao.findIndex(
    transacao => transacao.id === idTransacao
  );

  if (indexTransacao < 0) {
    return response
      .status(404)
      .json({ error_message: 'Transacao não encontrada' });
  } else {
    usuario.transacao[indexTransacao].operacao = operacao;
    usuario.transacao[indexTransacao].valor = valor;
    usuario.transacao[indexTransacao].tipo = tipo;

    return response.json(usuario.transacao[indexTransacao]);
  }
});

app.delete('/users/:id/transactions/idTransacao', (request, response) => {
  const { id, idTransacao } = request.params;

  const usuario = usuarios.find(user => user.id === id);

  if (!usuario) {
    return response
      .status(404)
      .json({ error_message: 'Usuário não encontrado' });
  }

  const transacao = usuario.transacao.findIndex(
    transacao => transacao.id === idTransacao
  );

  if (transacao < 0) {
    return response
      .status(404)
      .json({ error_message: 'Transação não encontrada' });
  } else {
    usuario.transacao.splice(transacao, 1);

    return response.json({ transacao: usuarios.transacao });
  }
});
app.listen(3333);
