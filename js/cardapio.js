// Página do cliente (index.html)

let restaurante = {};
let categorias = [];
let produtos = [];

let categoriaSelecionada = 0; // 0 = todas as categorias
let textoBusca = '';

// Pegando os elementos da página
const campoBusca = document.getElementById('campoBusca');
const listaCategorias = document.getElementById('listaCategorias');
const listaProdutos = document.getElementById('listaProdutos');
const semResultados = document.getElementById('semResultados');

const carrinhoLateral = document.getElementById('carrinho');
const fundoCarrinho = document.getElementById('fundoCarrinho');
const itensCarrinho = document.getElementById('itensCarrinho');
const rodapeCarrinho = document.getElementById('rodapeCarrinho');
const campoObservacoes = document.getElementById('observacoes');

const formPedido = document.getElementById('formPedido');
const selectPagamento = document.getElementById('pagamento');

async function iniciarCardapio() {
  iniciarBanco();
  await carregarDados();

  mostrarDadosRestaurante();
  mostrarCategorias();
  mostrarProdutos();
  mostrarCarrinho();

  configurarEventos();
  configurarModais();
}

async function carregarDados() {
  restaurante = await buscarRestaurante();
  categorias = await listarCategorias();
  produtos = await listarProdutos();

  sincronizarCarrinho(produtos);
}

// ---------- Restaurante / hero ----------

function mostrarDadosRestaurante() {
  document.title = restaurante.nome + ' | Cardápio';

  document.getElementById('nomeCabecalho').textContent = restaurante.nome;
  document.getElementById('nomeRestaurante').textContent = restaurante.nome;
  document.getElementById('sloganRestaurante').textContent = restaurante.slogan;
  document.getElementById('horarioRestaurante').textContent = restaurante.horario;
  document.getElementById('enderecoRestaurante').textContent = restaurante.endereco;
  document.getElementById('nomeRodape').textContent = restaurante.nome;
  document.getElementById('enderecoRodape').textContent = restaurante.endereco + ' · ' + restaurante.horario;

  let textoEntrega = restaurante.tempoEntrega;
  if (restaurante.taxaEntrega > 0) {
    textoEntrega += ' · Entrega ' + formatarPreco(restaurante.taxaEntrega);
  } else {
    textoEntrega += ' · Entrega grátis';
  }
  document.getElementById('tempoEntrega').textContent = textoEntrega;

  if (restaurante.imagemCapa) {
    const imagem = restaurante.imagemCapa.replaceAll('"', '');
    document.getElementById('hero').style.backgroundImage =
      'linear-gradient(90deg, rgba(17, 24, 39, 0.92) 0%, rgba(17, 24, 39, 0.55) 100%), url("' + imagem + '")';
  }
}

// ---------- Categorias ----------

// Só mostra as categorias que têm pelo menos um produto
function categoriasComProdutos() {
  return categorias.filter(function (categoria) {
    return produtos.some(function (produto) {
      return produto.categoriaId === categoria.id;
    });
  });
}

function mostrarCategorias() {
  const lista = categoriasComProdutos();

  // Se a categoria escolhida sumiu (foi excluída no admin), volta para "Todos"
  const aindaExiste = lista.some(function (categoria) {
    return categoria.id === categoriaSelecionada;
  });
  if (!aindaExiste) {
    categoriaSelecionada = 0;
  }

  let html = `
    <button class="chip ${categoriaSelecionada === 0 ? 'ativo' : ''}" onclick="selecionarCategoria(0)">
      Todos
    </button>
  `;

  lista.forEach(function (categoria) {
    html += `
      <button class="chip ${categoriaSelecionada === categoria.id ? 'ativo' : ''}" onclick="selecionarCategoria(${categoria.id})">
        ${escaparHTML(categoria.nome)}
      </button>
    `;
  });

  listaCategorias.innerHTML = html;
}

function selecionarCategoria(id) {
  categoriaSelecionada = id;
  mostrarCategorias();
  mostrarProdutos();

  // Leva a tela até o começo do cardápio
  document.getElementById('cardapio').scrollIntoView({ behavior: 'smooth' });
}

// ---------- Produtos ----------

function produtoPassaNoFiltro(produto) {
  if (categoriaSelecionada !== 0 && produto.categoriaId !== categoriaSelecionada) {
    return false;
  }

  if (textoBusca !== '') {
    const textoDoProduto = normalizarTexto(produto.nome + ' ' + produto.descricao);
    if (!textoDoProduto.includes(textoBusca)) {
      return false;
    }
  }

  return true;
}

function mostrarProdutos() {
  let html = '';
  let totalEncontrado = 0;

  // Mostra os produtos separados por categoria
  categorias.forEach(function (categoria) {
    const produtosDaCategoria = produtos.filter(function (produto) {
      return produto.categoriaId === categoria.id && produtoPassaNoFiltro(produto);
    });

    if (produtosDaCategoria.length === 0) {
      return;
    }

    totalEncontrado += produtosDaCategoria.length;

    html += `
      <section class="secao-categoria">
        <h2 class="titulo-categoria">${escaparHTML(categoria.nome)}</h2>
        <div class="grade-produtos">
          ${produtosDaCategoria.map(criarCardProduto).join('')}
        </div>
      </section>
    `;
  });

  listaProdutos.innerHTML = html;

  if (totalEncontrado === 0) {
    semResultados.classList.add('visivel');
  } else {
    semResultados.classList.remove('visivel');
  }
}

function criarCardProduto(produto) {
  let botao = '';

  if (produto.disponivel) {
    botao = `
      <button class="botao-adicionar" onclick="adicionarAoCarrinho(${produto.id})" aria-label="Adicionar ${escaparHTML(produto.nome)}">
        <i class="fa-solid fa-plus"></i>
      </button>
    `;
  } else {
    botao = `<span class="etiqueta-indisponivel">Indisponível</span>`;
  }

  return `
    <article class="card-produto ${produto.disponivel ? '' : 'indisponivel'}">
      <div class="card-produto-imagem">
        <img src="${escaparHTML(imagemDoProduto(produto))}" alt="${escaparHTML(produto.nome)}" loading="lazy"
             onerror="this.onerror = null; this.src = '${IMAGEM_PADRAO}'">
      </div>
      <div class="card-produto-info">
        <h3>${escaparHTML(produto.nome)}</h3>
        <p>${escaparHTML(produto.descricao)}</p>
        <div class="card-produto-rodape">
          <span class="preco">${formatarPreco(produto.preco)}</span>
          ${botao}
        </div>
      </div>
    </article>
  `;
}

// ---------- Carrinho ----------

function adicionarAoCarrinho(id) {
  const produto = produtos.find(function (item) {
    return item.id === id;
  });

  if (!produto || !produto.disponivel) {
    mostrarAviso('Esse produto não está disponível no momento.', 'erro');
    return;
  }

  adicionarItem(produto);
  mostrarCarrinho();
  mostrarAviso('Adicionado ao carrinho: ' + produto.nome);

  // Animação no contador do carrinho
  const contador = document.getElementById('contadorCarrinho');
  contador.classList.remove('pulando');
  void contador.offsetWidth; // truque para a animação rodar de novo
  contador.classList.add('pulando');
}

function clicarMais(id) {
  aumentarQuantidade(id);
  mostrarCarrinho();
}

function clicarMenos(id) {
  diminuirQuantidade(id);
  mostrarCarrinho();
}

function clicarRemover(id) {
  removerItem(id);
  mostrarCarrinho();
}

function mostrarCarrinho() {
  const quantidade = contarItens();
  const subtotal = calcularSubtotal();

  document.getElementById('contadorCarrinho').textContent = quantidade;
  document.getElementById('subtotalCarrinho').textContent = formatarPreco(subtotal);
  document.getElementById('barraQuantidade').textContent = quantidade;
  document.getElementById('barraTotal').textContent = formatarPreco(subtotal);

  const barraCarrinho = document.getElementById('barraCarrinho');
  if (quantidade > 0) {
    barraCarrinho.classList.add('visivel');
  } else {
    barraCarrinho.classList.remove('visivel');
  }

  if (carrinho.length === 0) {
    itensCarrinho.innerHTML = `
      <div class="carrinho-vazio">
        <i class="fa-solid fa-basket-shopping"></i>
        <h3>Seu carrinho está vazio</h3>
        <p>Escolha os produtos no cardápio e eles aparecem aqui.</p>
      </div>
    `;
    rodapeCarrinho.classList.add('escondido');
    return;
  }

  rodapeCarrinho.classList.remove('escondido');

  let html = '';

  carrinho.forEach(function (item) {
    html += `
      <div class="item-carrinho">
        <img src="${escaparHTML(item.imagem)}" alt="${escaparHTML(item.nome)}"
             onerror="this.onerror = null; this.src = '${IMAGEM_PADRAO}'">
        <div class="item-carrinho-info">
          <h4>${escaparHTML(item.nome)}</h4>
          <span class="preco">${formatarPreco(item.preco * item.quantidade)}</span>
          <div class="item-carrinho-acoes">
            <div class="quantidade">
              <button onclick="clicarMenos(${item.produtoId})" aria-label="Diminuir quantidade">
                <i class="fa-solid fa-minus"></i>
              </button>
              <span>${item.quantidade}</span>
              <button onclick="clicarMais(${item.produtoId})" aria-label="Aumentar quantidade">
                <i class="fa-solid fa-plus"></i>
              </button>
            </div>
            <button class="botao-remover" onclick="clicarRemover(${item.produtoId})">
              <i class="fa-regular fa-trash-can"></i> Remover
            </button>
          </div>
        </div>
      </div>
    `;
  });

  itensCarrinho.innerHTML = html;
}

function abrirCarrinho() {
  carrinhoLateral.classList.add('aberto');
  fundoCarrinho.classList.add('aberto');
  document.body.classList.add('sem-rolagem');
}

function fecharCarrinho() {
  carrinhoLateral.classList.remove('aberto');
  fundoCarrinho.classList.remove('aberto');
  document.body.classList.remove('sem-rolagem');
}

// ---------- Finalizar pedido ----------

function tipoEntregaEscolhido() {
  return document.querySelector('input[name="tipoEntrega"]:checked').value;
}

function calcularTaxaEntrega() {
  if (tipoEntregaEscolhido() === 'entrega') {
    return Number(restaurante.taxaEntrega) || 0;
  }
  return 0;
}

function abrirFinalizacao() {
  if (carrinho.length === 0) {
    mostrarAviso('Adicione algum produto antes de finalizar.', 'erro');
    return;
  }

  fecharCarrinho();
  atualizarResumo();
  abrirModal('modalPedido');
}

// Atualiza os campos e os valores conforme o cliente vai preenchendo
function atualizarResumo() {
  const subtotal = calcularSubtotal();
  const taxa = calcularTaxaEntrega();
  const ehEntrega = tipoEntregaEscolhido() === 'entrega';

  document.getElementById('camposEndereco').classList.toggle('escondido', !ehEntrega);
  document.getElementById('linhaTaxa').classList.toggle('escondido', !ehEntrega);
  document.getElementById('campoTroco').classList.toggle('escondido', selectPagamento.value !== 'Dinheiro');

  document.getElementById('resumoSubtotal').textContent = formatarPreco(subtotal);
  document.getElementById('resumoTaxa').textContent = taxa > 0 ? formatarPreco(taxa) : 'Grátis';
  document.getElementById('resumoTotal').textContent = formatarPreco(subtotal + taxa);
}

function enviarPedido(evento) {
  evento.preventDefault();

  const nome = document.getElementById('nomeCliente').value.trim();
  const endereco = document.getElementById('endereco').value.trim();
  const bairro = document.getElementById('bairro').value.trim();
  const complemento = document.getElementById('complemento').value.trim();
  const pagamento = selectPagamento.value;
  const troco = Number(document.getElementById('troco').value) || 0;
  const tipoEntrega = tipoEntregaEscolhido();

  const subtotal = calcularSubtotal();
  const taxa = calcularTaxaEntrega();
  const total = subtotal + taxa;

  // Validações
  if (nome === '') {
    mostrarAviso('Digite o seu nome.', 'erro');
    document.getElementById('nomeCliente').focus();
    return;
  }

  if (tipoEntrega === 'entrega' && (endereco === '' || bairro === '')) {
    mostrarAviso('Preencha o endereço e o bairro para a entrega.', 'erro');
    return;
  }

  if (pagamento === '') {
    mostrarAviso('Escolha a forma de pagamento.', 'erro');
    return;
  }

  if (pagamento === 'Dinheiro' && troco > 0 && troco < total) {
    mostrarAviso('O valor do troco precisa ser maior que o total do pedido.', 'erro');
    return;
  }

  const pedido = {
    restaurante: restaurante.nome,
    cliente: nome,
    itens: carrinho,
    observacoes: campoObservacoes.value.trim(),
    tipoEntrega: tipoEntrega,
    endereco: endereco,
    bairro: bairro,
    complemento: complemento,
    pagamento: pagamento,
    troco: troco,
    subtotal: subtotal,
    taxaEntrega: taxa,
    total: total
  };

  const mensagem = montarMensagemPedido(pedido);
  enviarParaWhatsApp(restaurante.whatsapp, mensagem);

  // Depois de enviar, limpa tudo
  limparCarrinho();
  campoObservacoes.value = '';
  formPedido.reset();
  mostrarCarrinho();
  fecharModal('modalPedido');
  mostrarAviso('Pedido enviado! Confira a conversa no WhatsApp.');
}

// ---------- Eventos ----------

function configurarEventos() {
  campoBusca.addEventListener('input', function () {
    textoBusca = normalizarTexto(campoBusca.value.trim());
    mostrarProdutos();
  });

  document.getElementById('botaoAbrirCarrinho').addEventListener('click', abrirCarrinho);
  document.getElementById('barraCarrinho').addEventListener('click', abrirCarrinho);
  document.getElementById('botaoFecharCarrinho').addEventListener('click', fecharCarrinho);
  fundoCarrinho.addEventListener('click', fecharCarrinho);

  document.getElementById('botaoFinalizar').addEventListener('click', abrirFinalizacao);

  document.querySelectorAll('input[name="tipoEntrega"]').forEach(function (opcao) {
    opcao.addEventListener('change', atualizarResumo);
  });
  selectPagamento.addEventListener('change', atualizarResumo);

  formPedido.addEventListener('submit', enviarPedido);

  // Tecla ESC fecha o carrinho e o modal
  document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape') {
      fecharCarrinho();
      fecharModal('modalPedido');
    }
  });

  // Se o admin alterar alguma coisa em outra aba, o cardápio atualiza sozinho
  window.addEventListener('storage', async function () {
    carrinho = lerDoStorage(CHAVE_CARRINHO) || [];
    await carregarDados();
    mostrarDadosRestaurante();
    mostrarCategorias();
    mostrarProdutos();
    mostrarCarrinho();
  });
}

iniciarCardapio();
