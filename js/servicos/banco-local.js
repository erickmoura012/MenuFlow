// Funções que leem e gravam no LocalStorage.
//
// IMPORTANTE: as telas (cardapio.js e admin.js) nunca mexem no LocalStorage direto.
// Elas sempre chamam os arquivos de serviço (produtos-servico.js, categorias-servico.js...).
// Assim, quando o backend ficar pronto, basta trocar o que está dentro dos serviços
// por chamadas fetch para a API e as telas continuam funcionando do mesmo jeito.

function lerDoStorage(chave) {
  const texto = localStorage.getItem(chave);

  if (texto === null) {
    return null;
  }

  try {
    return JSON.parse(texto);
  } catch (erro) {
    console.error('Erro ao ler ' + chave + ' do LocalStorage', erro);
    return null;
  }
}

function salvarNoStorage(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch (erro) {
    // Normalmente acontece quando o LocalStorage enche (limite de mais ou menos 5MB)
    console.error('Erro ao salvar ' + chave + ' no LocalStorage', erro);
    throw new Error('Não foi possível salvar. O espaço do navegador pode estar cheio (tente usar imagens menores).');
  }
}

// Na primeira vez que o sistema é aberto, salva os dados de exemplo
function iniciarBanco() {
  if (lerDoStorage(CHAVE_RESTAURANTE) === null) {
    salvarNoStorage(CHAVE_RESTAURANTE, restauranteInicial);
  }

  if (lerDoStorage(CHAVE_CATEGORIAS) === null) {
    salvarNoStorage(CHAVE_CATEGORIAS, categoriasIniciais);
  }

  if (lerDoStorage(CHAVE_PRODUTOS) === null) {
    salvarNoStorage(CHAVE_PRODUTOS, produtosIniciais);
  }
}

// Apaga tudo e volta para os dados de exemplo
function restaurarDadosDeExemplo() {
  localStorage.removeItem(CHAVE_RESTAURANTE);
  localStorage.removeItem(CHAVE_CATEGORIAS);
  localStorage.removeItem(CHAVE_PRODUTOS);
  localStorage.removeItem(CHAVE_CARRINHO);
  iniciarBanco();
}

// Gera o próximo id pegando o maior id da lista e somando 1
// (parecido com o SERIAL do PostgreSQL)
function gerarProximoId(lista) {
  let maiorId = 0;

  lista.forEach(function (item) {
    if (item.id > maiorId) {
      maiorId = item.id;
    }
  });

  return maiorId + 1;
}
