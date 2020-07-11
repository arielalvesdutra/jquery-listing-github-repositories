const HtmlTag = {
  UL_TAG: '<ul></ul>',
  LI_TAG: '<li></li>',
  H2_TAG: '<h2></h2>',
  A_TAG: '<a></a>',
  DIV_TAG: '<div></div>',
  P_TAG: '<p></p>',
  TABLE_TAG: '<table></table>',
  THEAD_TAG: '<thead></thead>',
  TBODY_TAG: '<tbody></table>',
  TR_TAG: '<tr></tr>',
  TH_TAG: '<th></th>',
  TD_TAG: '<td></td>',
  TFOOTER_TAG: '<tfoot></tfoot>',
  STRONG_TAG: '<strong></strong>'
}

/**
 * @todo refactor
 */
const MOCK = true
const BACKEND_URL = MOCK
  ? '/assets/data/mock-repos.json'
  : 'https://api.github.com/users/octocat/repos'


/**
 * @todo remove later
 */
const usernameWithBase64Encryption = window.btoa("arielalvesdutra")
const authenticationHeader = {
  headers: {
    'Authorization': `Basic ${usernameWithBase64Encryption}`
  }
}

/**
 * @todo refactor
 */
const GitHubRepositoriesService = {
  _usernameBase64: window.btoa("arielalvesdutra"),
  _basicAuthenticationHeader: {
    headers: {
      'Authorization': `Basic ${this._usernameBase64}`
    }
  },
  async fetchAllRepositories() {
    const response = await axios.get(BACKEND_URL, authenticationHeader)
    return response.data
  },
  async fetchRepositoryByUrl(url) {
    const response = await axios.get(url, authenticationHeader)
    return response.data
  },
  async fetchRepositoryIssues(url) {
    const validUrl = `${url.replace('{/number}', '')}?state=all`
    const response = await axios.get(validUrl, authenticationHeader)
    return response.data
  },
  async fetchRepositoryContributors(url) {
    const response = await axios.get(`${url}?per_page=20`, authenticationHeader)
    return response.data
  },
  async fetchIssueComments(url) {
    const response = await axios.get(url, authenticationHeader)
    return response.data
  }
}

const HtmlBuilder = {
  h2(message) {
    return $(HtmlTag.H2_TAG).text(message)
  },
  div(message) {
    return $(HtmlTag.DIV_TAG).html(message)
  },
  a({ href, message }) {
    return $(HtmlTag.A_TAG)
      .text(message)
      .attr('href', href)
  },
  li(message) {
    return $(HtmlTag.LI_TAG).text(message)
  },
  ul(message) {
    return $(HtmlTag.UL_TAG).text(message)
  },
  p(message) {
    return $(HtmlTag.P_TAG).text(message)
  },
  table(message) {
    return $(HtmlTag.TABLE_TAG).text(message)
  },
  thead(message) {
    return $(HtmlTag.THEAD_TAG).text(message)
  },
  tbody(message) {
    return $(HtmlTag.TBODY_TAG).text(message)
  },
  tfooter(message) {
    return $(HtmlTag.TFOOTER_TAG).text(message)
  },
  tr(message) {
    return $(HtmlTag.TR_TAG).text(message)
  },
  th(message) {
    return $(HtmlTag.TH_TAG).text(message)
  },
  td(message) {
    return $(HtmlTag.TD_TAG).html(message)
  },
  strong(message) {
    return $(HtmlTag.STRONG_TAG).html(message)
  },
}

/**
 * @todo refactor
 */
const GitHubRepositoriesHtmlBuilder = {
  async createRepositoryElement({ repository, openRepositoryDetail, backToRepositories }) {

    function onOpenRepositoryDetail() { openRepositoryDetail(repository) }

    return HtmlBuilder.li("")
      .addClass('github-repositories__item list-group-item')
      .append(HtmlBuilder.h2(repository.name))
      .append(HtmlBuilder.a({ message: 'Detalhes', href: '#' }).click(onOpenRepositoryDetail))
  },
  createRepositoryContributors({ contributors }) {
    const contributorsTableHTML = HtmlBuilder.table("")
      .addClass('table table-striped')
      .attr('id', 'contributors-table')
    const theadHTML = HtmlBuilder.thead("")
      .append(HtmlBuilder.tr()
        .append(HtmlBuilder.th("Nome"))
        .append(HtmlBuilder.th("Contribuições")))
    const tbodyHTML = HtmlBuilder.tbody("")

    for (contributor of contributors) {
      const { login, contributions } = contributor

      const trHTML = HtmlBuilder.tr("")
        .append(HtmlBuilder.td(login))
        .append(HtmlBuilder.td(contributions))

      tbodyHTML.append(trHTML)
    }

    contributorsTableHTML.append(theadHTML).append(tbodyHTML)

    return HtmlBuilder.div("<strong>Lista de contribuintes desse repositório</strong>")
      .addClass('mt-3 mb-3')
      .append(contributorsTableHTML)
  },
  async createRepositoryIssues({ issues }) {
    const issuesHTML = HtmlBuilder.div(`<strong>Lista de issues</strong>`).addClass('mt-3 mb-3')
    let issueDetailHTML = GitHubRepositoriesHtmlBuilder.createIssueDetail({ issue: undefined })
    if (!issues || issues.length <= 0) {
      return issuesHTML.append(HtmlBuilder.div("Não há issues"))
    }

    async function fetchAndFillIssueDetail({ issue }) {
      const { comments_url } = issue
      const issueComments = await GitHubRepositoriesService.fetchIssueComments(comments_url)
      issueDetailHTML.html(GitHubRepositoriesHtmlBuilder.createIssueDetail({ issue, issueComments }))
    }

    const issuesTableHTML = HtmlBuilder.table("")
      .addClass('table table-striped')
      .attr('id', 'issues-table')
    const theadHTML = HtmlBuilder.thead("")
      .append(HtmlBuilder.tr()
        .append(HtmlBuilder.th("Nome"))
        .append(HtmlBuilder.th("Status").attr('data-filter', 'data-filter'))
        .append(HtmlBuilder.th("Detalhes")))
    const tbodyHTML = HtmlBuilder.tbody("")

    for (issue of issues) {
      const issueWithoutCache = issue
      const { title, state } = issueWithoutCache

      const trHTML = HtmlBuilder.tr("")
        .append(HtmlBuilder.td(`${title}`))
        .append(HtmlBuilder.td(`${state}`))
        .append(HtmlBuilder.td(HtmlBuilder.a({ href: '#issue-detail', message: "Mais" })
              .click(function() { fetchAndFillIssueDetail({ issue: issueWithoutCache}) })))

      tbodyHTML.append(trHTML)
    }

    issuesTableHTML.append(theadHTML).append(tbodyHTML)

    issuesHTML
      .append(issuesTableHTML)
      .append(issueDetailHTML)

    return issuesHTML
  },
  createIssueDetail({ issue, issueComments }) {
    const issueDetailHTML = HtmlBuilder.div("").attr('id', 'issue-detail')

    if (issue == undefined) {
      return issueDetailHTML
    }

    const { title, created_at, body, state, user } = issue
    const { login } = user
    const commentsHTML = GitHubRepositoriesHtmlBuilder.createIssueComments({ issueComments })

    issueDetailHTML
      .append(HtmlBuilder.div(HtmlBuilder.strong("Detalhes da issue")).addClass('mt-2 mb-2'))
      .append(HtmlBuilder.p(`Criador: ${login}`))
      .append(HtmlBuilder.p(`Título: ${title}`))
      .append(HtmlBuilder.p(`Criada em: ${created_at}`))
      .append(HtmlBuilder.p(`Status: ${state}`))
      .append(HtmlBuilder.p(`Descrição: ${body}`))
      .append(commentsHTML)

    return issueDetailHTML
  },
  createRepositoryDetail({ repository, issuesHTML, contributorsHTML }) {
    const { name, description } = repository

    const navItemIssuesHTML = HtmlBuilder.li("")
      .addClass('nav-item')
      .append(HtmlBuilder.a({ href: "#issues", message: "Issues" })
        .addClass('nav-link')
        .attr('data-toggle', 'tab')
        .attr('aria-selected', 'false')
        .attr('role', 'tab'))
    const navItemContributorsHTML = HtmlBuilder.li("")
      .addClass('nav-item')
      .append(HtmlBuilder.a({ href: "#contributors", message: "Contributors" })
        .addClass('nav-link')
        .attr('aria-selected', 'false')
        .attr('data-toggle', 'tab')
        .attr('role', 'tab'))
    const navTabsHTML = HtmlBuilder.ul("")
      .addClass('nav nav-tabs')
      .attr('id', 'issues-and-contributors')
      .attr('role', 'tablist')
      .append(navItemContributorsHTML)
      .append(navItemIssuesHTML)

    const tabPaneIssuesHTML = HtmlBuilder.div("")
      .addClass('tab-pane fade')
      .attr('id', 'issues')
      .attr('role', 'tabpanel')
      .append(issuesHTML)
    const tabPaneContributorsHTML = HtmlBuilder.div("")
      .addClass('tab-pane fade')
      .attr('id', 'contributors')
      .attr('role', 'tabpanel')
      .append(contributorsHTML)
    const tabContentHTML = HtmlBuilder.div("")
      .addClass('tab-content')
      .append(tabPaneIssuesHTML)
      .append(tabPaneContributorsHTML)

    const repositoryHTML = HtmlBuilder.div("")
      .append(HtmlBuilder.h2("Detalhes do repositorio"))
      .append(HtmlBuilder.div(`<b>Nome</b>: ${name}`))
      .append(HtmlBuilder.div(`<b>Descrição</b>: ${description}`))
      .append(navTabsHTML)
      .append(tabContentHTML)

    return repositoryHTML
  },
  createIssueComments({ issueComments }) {
    const issueCommentsHTML = HtmlBuilder.div("Comentários da issue").attr('id', 'issue-comments')
    const issueCommentsList = HtmlBuilder.ul("").addClass('issues-comments__list')


    for (comment of issueComments) {
      const { created_at, body, user } = comment
      const { login } = user
      const issueCommentHTML = HtmlBuilder.li("")
        .append(HtmlBuilder.div(`Autor: ${login}`))
        .append(HtmlBuilder.div(`Conteúdo: ${body}`))
        .append(HtmlBuilder.div(`Criado em: ${created_at}`))

      issueCommentsList.append(issueCommentHTML)
    }

    issueCommentsHTML.append(issueCommentsList)

    return issueCommentsHTML
  }
}

/**
 * @todo refactor
 */
function addSelectFilterToDataTable() {
  this.api().columns().every(function (ar, bar, car) {
    const column = this;
    const header = $(column.header())

    if (header.attr('data-filter') == undefined) {
      return
    }

    var select = $('<select class="form-control mb-2"><option value="">Filtrar</option></select>')
      .prependTo($(column.header()))
      .on('change', function () {
        var val = $.fn.dataTable.util.escapeRegex($(this).val());
        column
          .search(val ? '^' + val + '$' : '', true, false)
          .draw();
      });

    column.data().unique().sort().each(function (d, j) {
      select.append('<option value="' + d + '">' + d + '</option>')
    });
  })
}


/**
 * @todo refactor
 */
const GitHubRepositories = {
  _repositories_content: $('#github-repositories__content'),
  _repositories_list: $('.github-repositories__list'),
  _repositories_data: [],
  async init() {
    GitHubRepositories._repositories_data = await GitHubRepositoriesService.fetchAllRepositories()
    GitHubRepositories._fillRepositoriesList(GitHubRepositories._repositories_data)
  },
  async _fillRepositoryDetail(repository) {
    GitHubRepositories._clearRepositoriesContent()

    const repositoryIssues = await GitHubRepositoriesService.fetchRepositoryIssues(repository.issues_url)
    const repositoryContributors = await GitHubRepositoriesService.fetchRepositoryContributors(repository.contributors_url)

    const contributorsHTML = GitHubRepositoriesHtmlBuilder.createRepositoryContributors({ contributors: repositoryContributors })
    const issuesHTML = await GitHubRepositoriesHtmlBuilder.createRepositoryIssues({ issues: repositoryIssues })
    const detailHTML = GitHubRepositoriesHtmlBuilder.createRepositoryDetail({ repository, issuesHTML, contributorsHTML })

    // @todo refactor
    GitHubRepositories._repositories_content.text("")
      .append(detailHTML)
      .append(HtmlBuilder.a({ message: "Voltar para lista de repositorios", href: '#' })
        .click(function () { GitHubRepositories._fillRepositoriesList(GitHubRepositories._repositories_data) }))

    // @todo refactor
    const dataTableConf = {
      pageLength: 10,
      searchPanes: {
        dataLength: false,
      },
      dom: 'tpio',
      language: {
        paginate: {
          previous: 'Anterior',
          next: 'Próximo'
        },
        zeroRecords: "Nenhum registro encontrado",
        info: "Exibindo página _PAGE_ de _PAGES_",
        infoFiltered: " - filtrado de _MAX_ registros"
      },
      initComplete: addSelectFilterToDataTable
    }

    // @todo refactor
    $('#contributors-table').DataTable(dataTableConf)
    $('#issues-table').DataTable(dataTableConf)
    // @todo refactor
    $('#issues-and-contributors a:first').tab('show')
  },
  async _fillRepositoriesList(repositories) {
    GitHubRepositories._clearRepositoriesContent()
    const repositoriesListHTML = HtmlBuilder.ul("").addClass('list-group')

    for (repository of repositories) {

      const htmlRepository = await GitHubRepositoriesHtmlBuilder.createRepositoryElement({
        repository,
        openRepositoryDetail: GitHubRepositories._fillRepositoryDetail,
        backToRepositories: GitHubRepositories._fillRepositoriesList
      })

      repositoriesListHTML.append(htmlRepository)
    }

    GitHubRepositories._repositories_content
      .append(HtmlBuilder.h2("Lista de repositorios"))
      .append(HtmlBuilder.p("Segue abaixo a lista repositórios."))
      .append(repositoriesListHTML)
  },
  _clearRepositoriesContent() {
    GitHubRepositories._repositories_content.empty()
  }
}

GitHubRepositories.init()
