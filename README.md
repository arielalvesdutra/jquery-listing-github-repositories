# Descrição

Projeto desenvolvido com jQuery, Axios e Bootstrap 4 para listar repositórios do GitHub.

## Uso

Abrir o arquivo `index.html` no navegador pelo caminho do arquivo ou executar um servidor web na mesma pasta arquivo.

Por padrão, o projeto está utilizando dados `mock`. Para usar dados reais de um usuário do GitHub, é necessário acessar o arquivo `assets/js/containers/github-repositories.js` e alterar a constante `MOCK` para false.

**Atenção**: é possível que ocorra um erro de limites de requisições atingido para a API do GitHub. Ainda não há tratamento e exibição na tela sobre o erro e a verificação pode ser realizada analisando as requisições feitas ao GitHub. No momento, é possível aplicar duas soluções:

- Solução 1: usar dados mock
- Solução 2: modificar o `GithubRepositoriesService` para utilizar um usuário autenticado nas requisições, no arquivo `assets/js/containers/github-repositories.js`.
  - Preencher o valor `_usernameBase64` com um usuário do GitHub
  - Preencher todas as requisições do `axios` com o `_basicAuthenticationHeader`

## Observações

- Não utilizei `<script type="module"></script>` por não saber se é permitido. Não usei boa parte das funcionalidades do ES6 pelo mesmo motivo.
  - Não usei `map`, `reduce`, `filter`, `arrow functions` e `class`
  - A exceção foi o uso de `const` e `let` por ser mais fácil de reverter para `var`
- Falta maior organização do uso de classes CSS
