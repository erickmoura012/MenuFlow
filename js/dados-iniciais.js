// Dados de exemplo que são carregados na primeira vez que o sistema é aberto.
// Depois disso tudo fica salvo no LocalStorage e pode ser alterado pelo painel admin.

const restauranteInicial = {
  nome: 'Casa Brasa',
  slogan: 'Hambúrgueres artesanais e pizzas feitas no forno a lenha',
  whatsapp: '5511999999999',
  endereco: 'Rua das Palmeiras, 123 - Centro',
  horario: 'Ter a Dom, das 18h às 23h30',
  tempoEntrega: '40 a 60 min',
  taxaEntrega: 6,
  imagemCapa: 'assets/img/capa.jpg'
};

const categoriasIniciais = [
  { id: 1, nome: 'Hambúrgueres' },
  { id: 2, nome: 'Pizzas' },
  { id: 3, nome: 'Porções' },
  { id: 4, nome: 'Bebidas' },
  { id: 5, nome: 'Sobremesas' }
];

const produtosIniciais = [
  {
    id: 1,
    nome: 'X-Burger Clássico',
    descricao: 'Pão brioche, hambúrguer de 150g, queijo cheddar, alface, tomate e molho da casa.',
    preco: 24.9,
    imagem: 'assets/img/produtos/x-burger.jpg',
    categoriaId: 1,
    disponivel: true
  },
  {
    id: 2,
    nome: 'Smash Duplo',
    descricao: 'Dois smash burgers de 90g, cheddar derretido, cebola caramelizada e picles.',
    preco: 29.9,
    imagem: 'assets/img/produtos/smash-duplo.jpg',
    categoriaId: 1,
    disponivel: true
  },
  {
    id: 3,
    nome: 'Monster Bacon',
    descricao: 'Três hambúrgueres, muito bacon crocante, cheddar, cebola roxa e barbecue.',
    preco: 39.9,
    imagem: 'assets/img/produtos/monster-bacon.jpg',
    categoriaId: 1,
    disponivel: true
  },
  {
    id: 4,
    nome: 'Burger da Casa',
    descricao: 'Hambúrguer de 180g, queijo prato, rúcula, tomate seco e maionese de ervas.',
    preco: 32.9,
    imagem: 'assets/img/produtos/burger-da-casa.jpg',
    categoriaId: 1,
    disponivel: true
  },
  {
    id: 5,
    nome: 'Combo Clássico',
    descricao: 'X-Burger Clássico acompanhado de uma porção individual de batata frita.',
    preco: 36.9,
    imagem: 'assets/img/produtos/combo-classico.jpg',
    categoriaId: 1,
    disponivel: true
  },
  {
    id: 6,
    nome: 'Pizza Margherita',
    descricao: 'Molho de tomate, muçarela de búfala, manjericão fresco e azeite. 8 fatias.',
    preco: 49.9,
    imagem: 'assets/img/produtos/pizza-margherita.jpg',
    categoriaId: 2,
    disponivel: true
  },
  {
    id: 7,
    nome: 'Pizza Calabresa',
    descricao: 'Calabresa fatiada, cebola, azeitonas pretas e muçarela. 8 fatias.',
    preco: 52.9,
    imagem: 'assets/img/produtos/pizza-calabresa.jpg',
    categoriaId: 2,
    disponivel: true
  },
  {
    id: 8,
    nome: 'Pizza Frango com Catupiry',
    descricao: 'Frango desfiado temperado, catupiry original e cebola roxa. 8 fatias.',
    preco: 54.9,
    imagem: 'assets/img/produtos/pizza-frango.jpg',
    categoriaId: 2,
    disponivel: true
  },
  {
    id: 9,
    nome: 'Pizza Quatro Queijos',
    descricao: 'Muçarela, provolone, parmesão e gorgonzola com um toque de alecrim. 8 fatias.',
    preco: 56.9,
    imagem: 'assets/img/produtos/pizza-quatro-queijos.jpg',
    categoriaId: 2,
    disponivel: true
  },
  {
    id: 10,
    nome: 'Batata Frita',
    descricao: 'Porção de batata frita crocante com sal. Serve 2 pessoas.',
    preco: 18.9,
    imagem: 'assets/img/produtos/batata-frita.jpg',
    categoriaId: 3,
    disponivel: true
  },
  {
    id: 11,
    nome: 'Batata com Parmesão',
    descricao: 'Batata frita com parmesão ralado, salsinha e alho. Serve 2 pessoas.',
    preco: 22.9,
    imagem: 'assets/img/produtos/batata-parmesao.jpg',
    categoriaId: 3,
    disponivel: true
  },
  {
    id: 12,
    nome: 'Frango Crocante',
    descricao: 'Coxinhas da asa empanadas e bem crocantes, com molho de mostarda e mel.',
    preco: 34.9,
    imagem: 'assets/img/produtos/frango-crocante.jpg',
    categoriaId: 3,
    disponivel: true
  },
  {
    id: 13,
    nome: 'Picanha na Chapa',
    descricao: 'Picanha fatiada na chapa com batata frita e farofa. Serve 2 pessoas.',
    preco: 79.9,
    imagem: 'assets/img/produtos/picanha-com-fritas.jpg',
    categoriaId: 3,
    disponivel: false
  },
  {
    id: 14,
    nome: 'Refrigerante Lata',
    descricao: 'Lata de 350ml. Consulte os sabores disponíveis.',
    preco: 6,
    imagem: 'assets/img/produtos/refrigerante-lata.jpg',
    categoriaId: 4,
    disponivel: true
  },
  {
    id: 15,
    nome: 'Água Tônica',
    descricao: 'Lata de 350ml bem gelada.',
    preco: 7,
    imagem: 'assets/img/produtos/agua-tonica.jpg',
    categoriaId: 4,
    disponivel: true
  },
  {
    id: 16,
    nome: 'Suco Natural',
    descricao: 'Copo de 500ml. Sabores: laranja, limão, maracujá ou abacaxi com hortelã.',
    preco: 9.9,
    imagem: '',
    categoriaId: 4,
    disponivel: true
  },
  {
    id: 17,
    nome: 'Bolo de Chocolate',
    descricao: 'Fatia generosa de bolo de chocolate com cobertura de ganache.',
    preco: 14.9,
    imagem: 'assets/img/produtos/bolo-chocolate.jpg',
    categoriaId: 5,
    disponivel: true
  },
  {
    id: 18,
    nome: 'Taça de Oreo',
    descricao: 'Creme de baunilha, biscoito Oreo triturado, chantilly e calda de chocolate.',
    preco: 18.9,
    imagem: 'assets/img/produtos/taca-oreo.jpg',
    categoriaId: 5,
    disponivel: true
  },
  {
    id: 19,
    nome: 'Donuts',
    descricao: 'Dois donuts com cobertura de chocolate e confeitos coloridos.',
    preco: 12.9,
    imagem: 'assets/img/produtos/donuts.jpg',
    categoriaId: 5,
    disponivel: false
  }
];
