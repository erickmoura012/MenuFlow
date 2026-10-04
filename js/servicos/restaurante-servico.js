// Serviço com os dados do restaurante (nome, WhatsApp, endereço...)

// GET /restaurante
async function buscarRestaurante() {
  // Futuro:
  // const resposta = await fetch(URL_API + '/restaurante');
  // return await resposta.json();

  return lerDoStorage(CHAVE_RESTAURANTE) || restauranteInicial;
}

// PUT /restaurante
async function salvarRestaurante(dados) {
  const restaurante = {
    nome: dados.nome,
    slogan: dados.slogan,
    whatsapp: somenteNumeros(dados.whatsapp),
    endereco: dados.endereco,
    horario: dados.horario,
    tempoEntrega: dados.tempoEntrega,
    taxaEntrega: Number(dados.taxaEntrega) || 0,
    imagemCapa: dados.imagemCapa
  };

  salvarNoStorage(CHAVE_RESTAURANTE, restaurante);

  return restaurante;
}
