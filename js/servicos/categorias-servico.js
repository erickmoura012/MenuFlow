// Serviço de categorias
// Mesma ideia do serviço de produtos: hoje LocalStorage, depois API.

// GET /categorias
async function listarCategorias() {
  // Futuro:
  // const resposta = await fetch(URL_API + '/categorias');
  // return await resposta.json();

  return lerDoStorage(CHAVE_CATEGORIAS) || [];
}

// POST /categorias
async function criarCategoria(nome) {
  const nomeLimpo = nome.trim();

  if (nomeLimpo === '') {
    throw new Error('Digite o nome da categoria.');
  }

  const categorias = await listarCategorias();

  const jaExiste = categorias.some(function (categoria) {
    return categoria.nome.toLowerCase() === nomeLimpo.toLowerCase();
  });

  if (jaExiste) {
    throw new Error('Já existe uma categoria com esse nome.');
  }

  const novaCategoria = {
    id: gerarProximoId(categorias),
    nome: nomeLimpo
  };

  categorias.push(novaCategoria);
  salvarNoStorage(CHAVE_CATEGORIAS, categorias);

  return novaCategoria;
}

// PUT /categorias/:id
async function renomearCategoria(id, novoNome) {
  const nomeLimpo = novoNome.trim();

  if (nomeLimpo === '') {
    throw new Error('O nome não pode ficar vazio.');
  }

  const categorias = await listarCategorias();

  const jaExiste = categorias.some(function (categoria) {
    return categoria.id !== id && categoria.nome.toLowerCase() === nomeLimpo.toLowerCase();
  });

  if (jaExiste) {
    throw new Error('Já existe uma categoria com esse nome.');
  }

  const categoria = categorias.find(function (item) {
    return item.id === id;
  });

  if (!categoria) {
    throw new Error('Categoria não encontrada.');
  }

  categoria.nome = nomeLimpo;
  salvarNoStorage(CHAVE_CATEGORIAS, categorias);

  return categoria;
}

// DELETE /categorias/:id
async function excluirCategoria(id) {
  // Não deixa excluir categoria que ainda tem produtos
  // (no PostgreSQL isso seria garantido pela chave estrangeira)
  const produtos = await listarProdutos();

  const temProdutos = produtos.some(function (produto) {
    return produto.categoriaId === id;
  });

  if (temProdutos) {
    throw new Error('Essa categoria ainda tem produtos. Mova ou exclua os produtos antes.');
  }

  const categorias = await listarCategorias();
  const categoriasRestantes = categorias.filter(function (item) {
    return item.id !== id;
  });

  salvarNoStorage(CHAVE_CATEGORIAS, categoriasRestantes);
}
