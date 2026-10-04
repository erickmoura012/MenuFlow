// Monta o texto do pedido e abre o WhatsApp do restaurante
//
// No WhatsApp, o texto entre * fica em negrito.

function montarMensagemPedido(pedido) {
  const agora = new Date();
  const data = agora.toLocaleDateString('pt-BR');
  const hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  let mensagem = '';

  mensagem += '*NOVO PEDIDO - ' + pedido.restaurante.toUpperCase() + '*\n';
  mensagem += data + ' às ' + hora + '\n';
  mensagem += '\n';

  mensagem += '*Cliente:* ' + pedido.cliente + '\n';
  mensagem += '\n';

  mensagem += '*ITENS DO PEDIDO*\n';
  pedido.itens.forEach(function (item) {
    const totalItem = item.preco * item.quantidade;
    mensagem += item.quantidade + 'x ' + item.nome + ' - ' + formatarPreco(totalItem) + '\n';
  });
  mensagem += '\n';

  if (pedido.observacoes !== '') {
    mensagem += '*Observações:* ' + pedido.observacoes + '\n';
    mensagem += '\n';
  }

  mensagem += '*Subtotal:* ' + formatarPreco(pedido.subtotal) + '\n';
  if (pedido.tipoEntrega === 'entrega') {
    mensagem += '*Taxa de entrega:* ' + formatarPreco(pedido.taxaEntrega) + '\n';
  }
  mensagem += '*TOTAL: ' + formatarPreco(pedido.total) + '*\n';
  mensagem += '\n';

  if (pedido.tipoEntrega === 'entrega') {
    mensagem += '*Entrega no endereço:*\n';
    mensagem += pedido.endereco + ' - ' + pedido.bairro + '\n';
    if (pedido.complemento !== '') {
      mensagem += 'Complemento: ' + pedido.complemento + '\n';
    }
  } else {
    mensagem += '*Retirada no local*\n';
  }
  mensagem += '\n';

  mensagem += '*Pagamento:* ' + pedido.pagamento;
  if (pedido.pagamento === 'Dinheiro' && pedido.troco > 0) {
    mensagem += ' (troco para ' + formatarPreco(pedido.troco) + ')';
  }

  return mensagem;
}

function enviarParaWhatsApp(numero, mensagem) {
  const link = 'https://wa.me/' + somenteNumeros(numero) + '?text=' + encodeURIComponent(mensagem);
  window.open(link, '_blank');
}
