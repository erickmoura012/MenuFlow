// Página administrativa (admin.html)

let restaurante = {};
let categorias = [];
let produtos = [];

// Guarda o id do produto que está sendo editado (null quando é um produto novo)
let produtoEmEdicao = null;

const titulosDasSecoes = {
  dashboard: 'Dashboard',
  produtos: 'Produtos',
  categorias: 'Categorias',
  configuracoes: 'Configurações'
};

const formProduto = document.getElementById('formProduto');
const campoImagem = document.getElementById('produtoImagem');
const previaImagem = document.getElementById('previaImagem');

async function iniciarAdmin() {
  iniciarBanco();
  await carregarDados();

  atualizarTela();
  preencherFormRestaurante();

  configurarEventos();
  configurarModais();
}

async function carregarDados() {
  restaurante = await buscarRestaurante();
  categorias = await listarCategorias();
  produtos = await listarProdutos();
}

// Redesenha todas as partes da tela com os dados atuais
function atualizarTela() {
  document.getElementById('nomeRestauranteTopo').textContent = restaurante.nome;

  mostrarDashboard();
  preencherSelectsCategoria();
  mostrarTabelaProdutos();
  mostrarCategoriasAdmin();
}

// Depois de qualquer alteração: busca os dados de novo e atualiza a tela
async function recarregar() {
  await carregarDados();
  atualizarTela();
}

function nomeDaCategoria(id) {
  const categoria = categorias.find(function (item) {
    return item.id === id;
  });
  return categoria ? categoria.nome : 'Sem categoria';
}

// ---------- Menu ----------

function trocarSecao(nomeSecao) {
  document.querySelectorAll('.secao').forEach(function (secao) {
    secao.classList.remove('ativa');
  });
  document.getElementById('secao-' + nomeSecao).classList.add('ativa');

  document.querySelectorAll('.menu-link').forEach(function (link) {
    link.classList.toggle('ativo', link.dataset.secao === nomeSecao);
  });

  document.getElementById('tituloSecao').textContent = titulosDasSecoes[nomeSecao];

  fecharMenu();
  window.scrollTo(0, 0);
}

function abrirMenu() {
  document.getElementById('menuLateral').classList.add('aberto');
  document.getElementById('fundoMenu').classList.add('aberto');
}

function fecharMenu() {
  document.getElementById('menuLateral').classList.remove('aberto');
  document.getElementById('fundoMenu').classList.remove('aberto');
}

// ---------- Dashboard ----------

function mostrarDashboard() {
  const disponiveis = produtos.filter(function (produto) {
    return produto.disponivel;
  });
  const indisponiveis = produtos.filter(function (produto) {
    return !produto.disponivel;
  });

  document.getElementById('totalProdutos').textContent = produtos.length;
  document.getElementById('totalCategorias').textContent = categorias.length;
  document.getElementById('totalDisponiveis').textContent = disponiveis.length;
  document.getElementById('totalIndisponiveis').textContent = indisponiveis.length;

  mostrarGraficoCategorias();
  mostrarListaIndisponiveis(indisponiveis);
}

function mostrarGraficoCategorias() {
  const grafico = document.getElementById('graficoCategorias');

  if (categorias.length === 0) {
    grafico.innerHTML = '<p class="texto-vazio">Nenhuma categoria cadastrada.</p>';
    return;
  }

  // Conta quantos produtos tem em cada categoria
  const contagem = categorias.map(function (categoria) {
    const quantidade = produtos.filter(function (produto) {
      return produto.categoriaId === categoria.id;
    }).length;

    return { nome: categoria.nome, quantidade: quantidade };
  });

  let maior = 1;
  contagem.forEach(function (item) {
    if (item.quantidade > maior) {
      maior = item.quantidade;
    }
  });

  let html = '';
  contagem.forEach(function (item) {
    const largura = (item.quantidade / maior) * 100;
    html += `
      <div class="barra-categoria">
        <div class="barra-categoria-texto">
          <span>${escaparHTML(item.nome)}</span>
          <strong>${item.quantidade}</strong>
        </div>
        <div class="barra-categoria-fundo">
          <div class="barra-categoria-preenchida" style="width: ${largura}%"></div>
        </div>
      </div>
    `;
  });

  grafico.innerHTML = html;
}

function mostrarListaIndisponiveis(indisponiveis) {
  const lista = document.getElementById('listaIndisponiveis');

  if (indisponiveis.length === 0) {
    lista.innerHTML = `
      <p class="texto-vazio">
        <i class="fa-solid fa-circle-check"></i> Todos os produtos estão disponíveis.
      </p>
    `;
    return;
  }

  let html = '<ul class="lista-indisponiveis">';
  indisponiveis.forEach(function (produto) {
    html += `
      <li>
        <img src="${escaparHTML(imagemDoProduto(produto))}" alt=""
             onerror="this.onerror = null; this.src = '${IMAGEM_PADRAO}'">
        <div>
          <strong>${escaparHTML(produto.nome)}</strong>
          <span>${escaparHTML(nomeDaCategoria(produto.categoriaId))}</span>
        </div>
        <button class="botao botao-secundario botao-pequeno" onclick="mudarDisponibilidade(${produto.id}, true)">
          Ativar
        </button>
      </li>
    `;
  });
  html += '</ul>';

  lista.innerHTML = html;
}

// ---------- Produtos ----------

function preencherSelectsCategoria() {
  const filtro = document.getElementById('filtroCategoria');
  const selectProduto = document.getElementById('produtoCategoria');
  const filtroAtual = filtro.value;

  let opcoesFiltro = '<option value="0">Todas as categorias</option>';
  let opcoesProduto = '<option value="">Selecione</option>';

  categorias.forEach(function (categoria) {
    const opcao = `<option value="${categoria.id}">${escaparHTML(categoria.nome)}</option>`;
    opcoesFiltro += opcao;
    opcoesProduto += opcao;
  });

  filtro.innerHTML = opcoesFiltro;
  selectProduto.innerHTML = opcoesProduto;

  // Mantém o filtro que estava escolhido (se a categoria ainda existir)
  if (filtro.querySelector('option[value="' + filtroAtual + '"]')) {
    filtro.value = filtroAtual;
  }
}

function mostrarTabelaProdutos() {
  const busca = normalizarTexto(document.getElementById('buscaProdutos').value.trim());
  const categoriaFiltro = Number(document.getElementById('filtroCategoria').value);

  const filtrados = produtos.filter(function (produto) {
    if (categoriaFiltro !== 0 && produto.categoriaId !== categoriaFiltro) {
      return false;
    }
    if (busca !== '' && !normalizarTexto(produto.nome).includes(busca)) {
      return false;
    }
    return true;
  });

  const corpoTabela = document.getElementById('corpoTabelaProdutos');
  const avisoVazio = document.getElementById('produtosVazio');

  if (filtrados.length === 0) {
    corpoTabela.innerHTML = '';
    avisoVazio.classList.remove('escondido');
    return;
  }

  avisoVazio.classList.add('escondido');

  let html = '';
  filtrados.forEach(function (produto) {
    html += `
      <tr class="${produto.disponivel ? '' : 'linha-indisponivel'}">
        <td data-titulo="Produto">
          <div class="tabela-produto">
            <img src="${escaparHTML(imagemDoProduto(produto))}" alt=""
                 onerror="this.onerror = null; this.src = '${IMAGEM_PADRAO}'">
            <div>
              <strong>${escaparHTML(produto.nome)}</strong>
              <span>${escaparHTML(produto.descricao)}</span>
            </div>
          </div>
        </td>
        <td data-titulo="Categoria">
          <span class="etiqueta">${escaparHTML(nomeDaCategoria(produto.categoriaId))}</span>
        </td>
        <td data-titulo="Preço">
          <div class="campo-preco">
            <span>R$</span>
            <input type="number" min="0" step="0.01" value="${Number(produto.preco).toFixed(2)}"
                   onchange="mudarPreco(${produto.id}, this)" aria-label="Preço de ${escaparHTML(produto.nome)}">
          </div>
        </td>
        <td data-titulo="Disponível">
          <label class="interruptor">
            <input type="checkbox" ${produto.disponivel ? 'checked' : ''}
                   onchange="mudarDisponibilidade(${produto.id}, this.checked)">
            <span class="interruptor-bolinha"></span>
          </label>
        </td>
        <td data-titulo="Ações" class="coluna-acoes">
          <button class="botao-icone" onclick="editarProduto(${produto.id})" title="Editar">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="botao-icone botao-icone-perigo" onclick="apagarProduto(${produto.id})" title="Excluir">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </td>
      </tr>
    `;
  });

  corpoTabela.innerHTML = html;
}

function novoProduto() {
  if (categorias.length === 0) {
    mostrarAviso('Crie uma categoria antes de cadastrar produtos.', 'erro');
    trocarSecao('categorias');
    return;
  }

  produtoEmEdicao = null;
  formProduto.reset();
  document.getElementById('tituloModalProduto').textContent = 'Novo produto';
  document.getElementById('produtoDisponivel').checked = true;
  atualizarPrevia();
  abrirModal('modalProduto');
  document.getElementById('produtoNome').focus();
}

function editarProduto(id) {
  const produto = produtos.find(function (item) {
    return item.id === id;
  });

  if (!produto) {
    return;
  }

  produtoEmEdicao = id;
  formProduto.reset();

  document.getElementById('tituloModalProduto').textContent = 'Editar produto';
  document.getElementById('produtoNome').value = produto.nome;
  document.getElementById('produtoDescricao').value = produto.descricao;
  document.getElementById('produtoPreco').value = Number(produto.preco).toFixed(2);
  document.getElementById('produtoCategoria').value = produto.categoriaId;
  document.getElementById('produtoDisponivel').checked = produto.disponivel;
  campoImagem.value = produto.imagem;

  atualizarPrevia();
  abrirModal('modalProduto');
}

async function salvarProduto(evento) {
  evento.preventDefault();

  const dados = {
    nome: document.getElementById('produtoNome').value.trim(),
    descricao: document.getElementById('produtoDescricao').value.trim(),
    preco: document.getElementById('produtoPreco').value,
    categoriaId: Number(document.getElementById('produtoCategoria').value),
    imagem: campoImagem.value.trim(),
    disponivel: document.getElementById('produtoDisponivel').checked
  };

  if (dados.nome === '') {
    mostrarAviso('Digite o nome do produto.', 'erro');
    return;
  }

  if (dados.preco === '' || Number(dados.preco) < 0) {
    mostrarAviso('Digite um preço válido.', 'erro');
    return;
  }

  if (!dados.categoriaId) {
    mostrarAviso('Escolha uma categoria.', 'erro');
    return;
  }

  dados.preco = Number(dados.preco);

  try {
    if (produtoEmEdicao === null) {
      await criarProduto(dados);
      mostrarAviso('Produto cadastrado!');
    } else {
      await atualizarProduto(produtoEmEdicao, dados);
      mostrarAviso('Produto atualizado!');
    }

    fecharModal('modalProduto');
    await recarregar();
  } catch (erro) {
    mostrarAviso(erro.message, 'erro');
  }
}

async function apagarProduto(id) {
  const produto = produtos.find(function (item) {
    return item.id === id;
  });

  if (!produto) {
    return;
  }

  const confirmou = confirm('Tem certeza que deseja excluir "' + produto.nome + '"?');
  if (!confirmou) {
    return;
  }

  try {
    await excluirProduto(id);
    mostrarAviso('Produto excluído.');
    await recarregar();
  } catch (erro) {
    mostrarAviso(erro.message, 'erro');
  }
}

// Chamado quando muda o preço direto na tabela
async function mudarPreco(id, campo) {
  try {
    await alterarPreco(id, campo.value);
    mostrarAviso('Preço atualizado para ' + formatarPreco(campo.value));
    await recarregar();
  } catch (erro) {
    mostrarAviso(erro.message, 'erro');
    await recarregar(); // volta o valor antigo no campo
  }
}

async function mudarDisponibilidade(id, disponivel) {
  try {
    await alterarDisponibilidade(id, disponivel);
    mostrarAviso(disponivel ? 'Produto disponível no cardápio.' : 'Produto marcado como indisponível.');
    await recarregar();
  } catch (erro) {
    mostrarAviso(erro.message, 'erro');
  }
}

// Mostra a foto do produto dentro do formulário
function atualizarPrevia() {
  const endereco = campoImagem.value.trim();
  previaImagem.src = endereco !== '' ? endereco : IMAGEM_PADRAO;
}

// Transforma a imagem escolhida do computador em texto (base64) para salvar no LocalStorage
function lerArquivoDeImagem() {
  const arquivo = document.getElementById('produtoArquivo').files[0];

  if (!arquivo) {
    return;
  }

  if (!arquivo.type.startsWith('image/')) {
    mostrarAviso('Escolha um arquivo de imagem.', 'erro');
    return;
  }

  if (arquivo.size > 500 * 1024) {
    mostrarAviso('A imagem é muito grande. Use uma de até 500KB.', 'erro');
    document.getElementById('produtoArquivo').value = '';
    return;
  }

  const leitor = new FileReader();
  leitor.onload = function () {
    campoImagem.value = leitor.result;
    atualizarPrevia();
  };
  leitor.readAsDataURL(arquivo);
}

// ---------- Categorias ----------

function mostrarCategoriasAdmin() {
  const lista = document.getElementById('listaCategoriasAdmin');

  if (categorias.length === 0) {
    lista.innerHTML = '<li class="texto-vazio">Nenhuma categoria cadastrada ainda.</li>';
    return;
  }

  let html = '';
  categorias.forEach(function (categoria) {
    const quantidade = produtos.filter(function (produto) {
      return produto.categoriaId === categoria.id;
    }).length;

    const textoQuantidade = quantidade === 1 ? '1 produto' : quantidade + ' produtos';

    html += `
      <li>
        <div class="categoria-icone"><i class="fa-solid fa-tag"></i></div>
        <div class="categoria-info">
          <strong>${escaparHTML(categoria.nome)}</strong>
          <span>${textoQuantidade}</span>
        </div>
        <button class="botao-icone" onclick="editarCategoria(${categoria.id})" title="Renomear">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="botao-icone botao-icone-perigo" onclick="apagarCategoria(${categoria.id})" title="Excluir">
          <i class="fa-regular fa-trash-can"></i>
        </button>
      </li>
    `;
  });

  lista.innerHTML = html;
}

async function criarNovaCategoria(evento) {
  evento.preventDefault();

  const campo = document.getElementById('nomeCategoria');

  try {
    const categoria = await criarCategoria(campo.value);
    campo.value = '';
    mostrarAviso('Categoria "' + categoria.nome + '" criada!');
    await recarregar();
  } catch (erro) {
    mostrarAviso(erro.message, 'erro');
  }
}

async function editarCategoria(id) {
  const nomeAtual = nomeDaCategoria(id);
  const novoNome = prompt('Novo nome da categoria:', nomeAtual);

  // Clicou em cancelar ou não mudou nada
  if (novoNome === null || novoNome.trim() === nomeAtual) {
    return;
  }

  try {
    await renomearCategoria(id, novoNome);
    mostrarAviso('Categoria renomeada!');
    await recarregar();
  } catch (erro) {
    mostrarAviso(erro.message, 'erro');
  }
}

async function apagarCategoria(id) {
  const confirmou = confirm('Deseja excluir a categoria "' + nomeDaCategoria(id) + '"?');
  if (!confirmou) {
    return;
  }

  try {
    await excluirCategoria(id);
    mostrarAviso('Categoria excluída.');
    await recarregar();
  } catch (erro) {
    mostrarAviso(erro.message, 'erro');
  }
}

// ---------- Configurações ----------

function preencherFormRestaurante() {
  document.getElementById('configNome').value = restaurante.nome;
  document.getElementById('configWhatsapp').value = restaurante.whatsapp;
  document.getElementById('configSlogan').value = restaurante.slogan;
  document.getElementById('configEndereco').value = restaurante.endereco;
  document.getElementById('configHorario').value = restaurante.horario;
  document.getElementById('configTempo').value = restaurante.tempoEntrega;
  document.getElementById('configTaxa').value = restaurante.taxaEntrega;
  document.getElementById('configCapa').value = restaurante.imagemCapa;
}

async function salvarConfiguracoes(evento) {
  evento.preventDefault();

  const dados = {
    nome: document.getElementById('configNome').value.trim(),
    whatsapp: document.getElementById('configWhatsapp').value.trim(),
    slogan: document.getElementById('configSlogan').value.trim(),
    endereco: document.getElementById('configEndereco').value.trim(),
    horario: document.getElementById('configHorario').value.trim(),
    tempoEntrega: document.getElementById('configTempo').value.trim(),
    taxaEntrega: document.getElementById('configTaxa').value,
    imagemCapa: document.getElementById('configCapa').value.trim()
  };

  if (dados.nome === '') {
    mostrarAviso('O nome do restaurante é obrigatório.', 'erro');
    return;
  }

  // Número de WhatsApp do Brasil com 55 + DDD tem 12 ou 13 dígitos
  if (somenteNumeros(dados.whatsapp).length < 12) {
    mostrarAviso('Digite o WhatsApp com 55 + DDD + número.', 'erro');
    return;
  }

  try {
    await salvarRestaurante(dados);
    await recarregar();
    preencherFormRestaurante();
    mostrarAviso('Dados do restaurante salvos!');
  } catch (erro) {
    mostrarAviso(erro.message, 'erro');
  }
}

async function restaurar() {
  const confirmou = confirm('Isso vai apagar tudo o que você cadastrou. Deseja continuar?');
  if (!confirmou) {
    return;
  }

  restaurarDadosDeExemplo();
  await recarregar();
  preencherFormRestaurante();
  mostrarAviso('Dados de exemplo restaurados.');
}

// ---------- Eventos ----------

function configurarEventos() {
  document.querySelectorAll('.menu-link').forEach(function (link) {
    link.addEventListener('click', function () {
      trocarSecao(link.dataset.secao);
    });
  });

  document.getElementById('botaoMenu').addEventListener('click', abrirMenu);
  document.getElementById('fundoMenu').addEventListener('click', fecharMenu);

  document.getElementById('botaoNovoProduto').addEventListener('click', novoProduto);
  document.getElementById('buscaProdutos').addEventListener('input', mostrarTabelaProdutos);
  document.getElementById('filtroCategoria').addEventListener('change', mostrarTabelaProdutos);

  formProduto.addEventListener('submit', salvarProduto);
  campoImagem.addEventListener('input', atualizarPrevia);
  document.getElementById('produtoArquivo').addEventListener('change', lerArquivoDeImagem);
  previaImagem.addEventListener('error', function () {
    if (!previaImagem.src.endsWith(IMAGEM_PADRAO)) {
      previaImagem.src = IMAGEM_PADRAO;
    }
  });

  document.getElementById('formCategoria').addEventListener('submit', criarNovaCategoria);
  document.getElementById('formRestaurante').addEventListener('submit', salvarConfiguracoes);
  document.getElementById('botaoRestaurar').addEventListener('click', restaurar);

  document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape') {
      fecharModal('modalProduto');
      fecharMenu();
    }
  });
}

iniciarAdmin();
