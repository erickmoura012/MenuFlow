# MenuFlow

Plataforma de cardápio digital para restaurantes, pizzarias e hamburguerias.

O cliente acessa o cardápio, monta o pedido no carrinho e envia tudo pronto pelo WhatsApp do restaurante.
O dono do restaurante tem um painel para cadastrar produtos, mudar preços, marcar o que acabou e criar categorias.

## Funcionalidades

### Área do cliente (`index.html`)

- Capa (hero) com nome, horário, tempo de entrega e endereço do restaurante
- Produtos separados por categoria, com foto, nome, descrição e preço
- Busca de produtos (funciona com ou sem acento)
- Filtro por categoria
- Carrinho com alteração de quantidade e remoção de itens
- Valor total do pedido e taxa de entrega
- Campo de observações do pedido
- Escolha entre entrega ou retirada e forma de pagamento (com troco)
- Ao finalizar, monta a mensagem do pedido organizada e abre o WhatsApp do restaurante
- Produtos indisponíveis aparecem apagados e não podem ser adicionados

### Área administrativa (`admin.html`)

- Dashboard com total de produtos, categorias, disponíveis e indisponíveis
- Gráfico de produtos por categoria e lista dos produtos indisponíveis
- Adicionar, editar e excluir produtos
- Alterar o preço direto na tabela
- Ligar/desligar a disponibilidade de cada produto
- Criar, renomear e excluir categorias
- Configurações do restaurante (nome, WhatsApp, endereço, horário, taxa de entrega...)
- Botão para restaurar os dados de exemplo

## Tecnologias

- HTML
- CSS
- JavaScript
- LocalStorage (para salvar os dados no navegador)
- [Font Awesome](https://fontawesome.com/) para os ícones e a fonte Poppins do Google Fonts

## Como rodar

Não precisa instalar nada. Basta baixar o projeto e abrir o arquivo `index.html` no navegador.

```bash
git clone https://github.com/erickmoura012/MenuFlow.git
```

Se preferir, dá para usar a extensão **Live Server** do VS Code.

Para acessar o painel, abra o `admin.html` ou clique em **Área do restaurante** no rodapé do cardápio.

> Na primeira vez que o sistema abre ele carrega um cardápio de exemplo. Para receber os pedidos no seu WhatsApp,
> vá em **Configurações** no painel e troque o número.

## Estrutura de pastas

```
MenuFlow/
├── index.html              -> cardápio do cliente
├── admin.html              -> painel do restaurante
├── assets/
│   └── img/                -> capa, ícone e fotos dos produtos
├── css/
│   ├── global.css          -> cores, botões, formulários e modais (usado nas duas páginas)
│   ├── cardapio.css        -> estilos da página do cliente
│   └── admin.css           -> estilos do painel
└── js/
    ├── config.js           -> nomes das chaves do LocalStorage e endereço da futura API
    ├── dados-iniciais.js   -> cardápio de exemplo
    ├── utils.js            -> funções de ajuda (formatar preço, avisos, modais...)
    ├── carrinho.js         -> regras do carrinho
    ├── whatsapp.js         -> monta a mensagem do pedido
    ├── cardapio.js         -> tela do cliente
    ├── admin.js            -> tela do painel
    └── servicos/
        ├── banco-local.js           -> leitura e gravação no LocalStorage
        ├── produtos-servico.js      -> listar, criar, editar e excluir produtos
        ├── categorias-servico.js    -> listar, criar, renomear e excluir categorias
        └── restaurante-servico.js   -> dados do restaurante
```

## Como os dados funcionam (e o plano para a API)

As telas (`cardapio.js` e `admin.js`) **nunca** acessam o LocalStorage direto.
Elas sempre chamam as funções da pasta `js/servicos/`, por exemplo:

```js
const produtos = await listarProdutos();
await alterarPreco(3, 39.9);
```

Hoje essas funções salvam no LocalStorage. A ideia é que no futuro elas passem a chamar uma API REST
feita com **Node.js + Express + PostgreSQL**, e as telas continuem iguais.
Por isso as funções já são `async` e cada uma tem um comentário com a rota que vai usar:

| Função                     | Rota futura                         |
| -------------------------- | ----------------------------------- |
| `listarProdutos()`         | `GET /produtos`                     |
| `buscarProduto(id)`        | `GET /produtos/:id`                 |
| `criarProduto(dados)`      | `POST /produtos`                    |
| `atualizarProduto(id, d)`  | `PUT /produtos/:id`                 |
| `excluirProduto(id)`       | `DELETE /produtos/:id`              |
| `alterarPreco(id, preco)`  | `PATCH /produtos/:id/preco`         |
| `alterarDisponibilidade()` | `PATCH /produtos/:id/disponibilidade` |
| `listarCategorias()`       | `GET /categorias`                   |
| `criarCategoria(nome)`     | `POST /categorias`                  |
| `renomearCategoria()`      | `PUT /categorias/:id`               |
| `excluirCategoria(id)`     | `DELETE /categorias/:id`            |
| `buscarRestaurante()`      | `GET /restaurante`                  |
| `salvarRestaurante(dados)` | `PUT /restaurante`                  |

O formato dos dados já foi pensado como tabelas do banco:

- **categorias**: `id`, `nome`
- **produtos**: `id`, `nome`, `descricao`, `preco`, `imagem`, `categoriaId`, `disponivel`
- **restaurante**: `nome`, `slogan`, `whatsapp`, `endereco`, `horario`, `tempoEntrega`, `taxaEntrega`, `imagemCapa`

O carrinho continua no LocalStorage mesmo com a API, porque ele é do cliente e só vira pedido quando é enviado.

## Próximos passos

- [ ] Backend com Node.js, Express e PostgreSQL
- [ ] Login para o painel administrativo
- [ ] Upload de imagens no servidor
- [ ] Histórico de pedidos
- [ ] Adicionais nos produtos (borda recheada, bacon extra...)

## Imagens

As fotos de exemplo dos produtos são do [Unsplash](https://unsplash.com).

---

Feito por Erick Moura
