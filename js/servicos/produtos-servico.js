// Serviço de produtos
//
// Hoje os dados ficam no LocalStorage.
// Em cada função deixei comentado qual rota da API ela vai chamar no futuro.
// As funções já são async para que, quando trocar pelo fetch, as telas não precisem mudar.

// GET /produtos
async function listarProdutos() {
  // Futuro:
  // const resposta = await fetch(URL_API + '/produtos');
  // return await resposta.json();

  return lerDoStorage(CHAVE_PRODUTOS) || [];
}

// GET /produtos/:id
async function buscarProduto(id) {
  const produtos = await listarProdutos();
  const produto = produtos.find(function (item) {
    return item.id === id;
  });

  return produto || null;
}

// POST /produtos
async function criarProduto(dados) {
  // Futuro:
  // const resposta = await fetch(URL_API + '/produtos', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(dados)
  // });
  // return await resposta.json();

  const produtos = await listarProdutos();

  const novoProduto = {
    id: gerarProximoId(produtos),
    nome: dados.nome,
    descricao: dados.descricao,
    preco: Number(dados.preco),
    imagem: dados.imagem,
    categoriaId: Number(dados.categoriaId),
    disponivel: dados.disponivel
  };

  produtos.push(novoProduto);
  salvarNoStorage(CHAVE_PRODUTOS, produtos);

  return novoProduto;
}

// PUT /produtos/:id
async function atualizarProduto(id, dados) {
  const produtos = await listarProdutos();
  const posicao = produtos.findIndex(function (item) {
    return item.id === id;
  });

  if (posicao === -1) {
    throw new Error('Produto não encontrado.');
  }

  // Junta os dados antigos com os novos (o que não veio continua igual)
  produtos[posicao] = { ...produtos[posicao], ...dados, id: id };

  salvarNoStorage(CHAVE_PRODUTOS, produtos);

  return produtos[posicao];
}

// DELETE /produtos/:id
async function excluirProduto(id) {
  const produtos = await listarProdutos();
  const produtosRestantes = produtos.filter(function (item) {
    return item.id !== id;
  });

  salvarNoStorage(CHAVE_PRODUTOS, produtosRestantes);
}

// PATCH /produtos/:id/preco
async function alterarPreco(id, novoPreco) {
  const preco = Number(novoPreco);

  if (isNaN(preco) || preco < 0) {
    throw new Error('Preço inválido.');
  }

  return await atualizarProduto(id, { preco: preco });
}

// PATCH /produtos/:id/disponibilidade
async function alterarDisponibilidade(id, disponivel) {
  return await atualizarProduto(id, { disponivel: disponivel });
}
