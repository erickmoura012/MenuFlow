// Funções pequenas que são usadas nas duas páginas

// 24.9 vira "R$ 24,90"
function formatarPreco(valor) {
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

// Tira acentos e deixa tudo minúsculo, para a busca funcionar com "hamburguer" ou "Hambúrguer"
function normalizarTexto(texto) {
  return String(texto)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

function somenteNumeros(texto) {
  return String(texto).replace(/\D/g, '');
}

// Evita que algum texto cadastrado no admin seja lido como HTML na página
function escaparHTML(texto) {
  return String(texto)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

// Se o produto não tiver foto, usa a imagem padrão
function imagemDoProduto(produto) {
  if (produto.imagem && produto.imagem.trim() !== '') {
    return produto.imagem;
  }
  return IMAGEM_PADRAO;
}

// Mostra uma mensagem rápida no canto da tela
// tipo pode ser 'sucesso' ou 'erro'
function mostrarAviso(mensagem, tipo = 'sucesso') {
  const areaAvisos = document.getElementById('avisos');

  const aviso = document.createElement('div');
  aviso.className = 'aviso aviso-' + tipo;

  const icone = tipo === 'erro' ? 'fa-circle-exclamation' : 'fa-circle-check';
  aviso.innerHTML = `<i class="fa-solid ${icone}"></i> <span>${escaparHTML(mensagem)}</span>`;

  areaAvisos.appendChild(aviso);

  // Deixa no máximo 3 avisos na tela para não cobrir a página
  if (areaAvisos.children.length > 3) {
    areaAvisos.firstElementChild.remove();
  }

  setTimeout(function () {
    aviso.classList.add('saindo');
    setTimeout(function () {
      aviso.remove();
    }, 300);
  }, 3000);
}

function abrirModal(id) {
  document.getElementById(id).classList.add('aberto');
  document.body.classList.add('sem-rolagem');
}

function fecharModal(id) {
  document.getElementById(id).classList.remove('aberto');
  document.body.classList.remove('sem-rolagem');
}

// Faz os botões com data-fechar="idDoModal" e o clique fora da caixa fecharem os modais
function configurarModais() {
  document.querySelectorAll('[data-fechar]').forEach(function (botao) {
    botao.addEventListener('click', function () {
      fecharModal(botao.dataset.fechar);
    });
  });

  document.querySelectorAll('.modal').forEach(function (modal) {
    modal.addEventListener('click', function (evento) {
      if (evento.target === modal) {
        fecharModal(modal.id);
      }
    });
  });
}
