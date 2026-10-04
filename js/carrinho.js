// Lógica do carrinho de compras
//
// O carrinho fica salvo no LocalStorage do cliente (mesmo quando tiver a API),
// assim ele não perde os itens se atualizar a página.
// Cada item guarda: produtoId, nome, preco, imagem e quantidade.

let carrinho = lerDoStorage(CHAVE_CARRINHO) || [];

function salvarCarrinho() {
  salvarNoStorage(CHAVE_CARRINHO, carrinho);
}

function adicionarItem(produto) {
  const itemExistente = carrinho.find(function (item) {
    return item.produtoId === produto.id;
  });

  if (itemExistente) {
    itemExistente.quantidade++;
  } else {
    carrinho.push({
      produtoId: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      imagem: imagemDoProduto(produto),
      quantidade: 1
    });
  }

  salvarCarrinho();
}

function aumentarQuantidade(produtoId) {
  const item = carrinho.find(function (item) {
    return item.produtoId === produtoId;
  });

  if (item) {
    item.quantidade++;
    salvarCarrinho();
  }
}

function diminuirQuantidade(produtoId) {
  const item = carrinho.find(function (item) {
    return item.produtoId === produtoId;
  });

  if (!item) {
    return;
  }

  item.quantidade--;

  // Se chegou a zero, tira do carrinho
  if (item.quantidade <= 0) {
    removerItem(produtoId);
    return;
  }

  salvarCarrinho();
}

function removerItem(produtoId) {
  carrinho = carrinho.filter(function (item) {
    return item.produtoId !== produtoId;
  });
  salvarCarrinho();
}

function limparCarrinho() {
  carrinho = [];
  salvarCarrinho();
}

function calcularSubtotal() {
  let total = 0;

  carrinho.forEach(function (item) {
    total = total + item.preco * item.quantidade;
  });

  return total;
}

function contarItens() {
  let quantidade = 0;

  carrinho.forEach(function (item) {
    quantidade = quantidade + item.quantidade;
  });

  return quantidade;
}

// Quando o admin muda alguma coisa (preço, disponibilidade ou exclui o produto),
// o carrinho do cliente precisa acompanhar.
function sincronizarCarrinho(listaProdutos) {
  const carrinhoAtualizado = [];

  carrinho.forEach(function (item) {
    const produto = listaProdutos.find(function (p) {
      return p.id === item.produtoId;
    });

    // Produto foi excluído ou ficou indisponível: sai do carrinho
    if (!produto || !produto.disponivel) {
      return;
    }

    item.nome = produto.nome;
    item.preco = produto.preco;
    item.imagem = imagemDoProduto(produto);
    carrinhoAtualizado.push(item);
  });

  carrinho = carrinhoAtualizado;
  salvarCarrinho();
}
