/**
 * @todo refactor
 */

const gitHubUser = 'octocat'
const MOCK = true
const BACKEND_URL = MOCK
  ? '/assets/data/mock-repos.json'
  : `https://api.github.com/users/${gitHubUser}/repos`


/**
 * @todo refactor
 */
const GitHubRepositoriesService = function () {
  const _usernameBase64 = window.btoa("put_your_user_here")
  const _basicAuthenticationHeader = {
    headers: {
      'Authorization': `Basic ${_usernameBase64}`
    }
  }

  async function fetchAllRepositories() {
    const response = await axios.get(BACKEND_URL)
    return response.data
  }

  async function fetchRepositoryByUrl(url) {
    const response = await axios.get(url)
    return response.data
  }

  async function fetchRepositoryIssues(url) {
    const validUrl = `${url.replace('{/number}', '')}?state=all`
    const response = await axios.get(validUrl)
    return response.data
  }

  async function fetchRepositoryContributors(url) {
    const urlWithPageLimit = `${url}?per_page=20`
    const response = await axios.get(urlWithPageLimit)
    return response.data
  }

  async function fetchIssueComments(url) {
    const response = await axios.get(url)
    return response.data
  }

  return {
    fetchAllRepositories,
    fetchRepositoryIssues,
    fetchRepositoryByUrl,
    fetchRepositoryContributors,
    fetchIssueComments
  }
}

/**
 * Consts of HTML tags.
 */
const HtmlTag = {
  UL_TAG: '<ul></ul>',
  LI_TAG: '<li></li>',
  H2_TAG: '<h2></h2>',
  H3_TAG: '<h3></h3>',
  H4_TAG: '<h4></h4>',
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
  SELECT_TAG: '<select></select>',
  OPTION_TAG: '<option></option>',
  STRONG_TAG: '<strong></strong>',
  BUTTON_TAG: '<button></button>',
  HR_TAG: '<hr>',
  NAV_TAG: '<nav></nav>',
  OL_TAG: '<ol></ol>',
  IMG_TAG: '<img></img>',
}

/**
 * Builder to abstract the creation of HTML elements with jQuery.
 */
const HtmlBuilder = {
  h2(message) {
    return $(HtmlTag.H2_TAG).text(message)
  },
  h3(message) {
    return $(HtmlTag.H3_TAG).text(message)
  },
  h4(message) {
    return $(HtmlTag.H4_TAG).text(message)
  },
  div(message) {
    return $(HtmlTag.DIV_TAG).html(message)
  },
  a({ href, message }) {
    return $(HtmlTag.A_TAG)
      .html(message)
      .attr('href', href)
  },
  li(message) {
    return $(HtmlTag.LI_TAG).html(message)
  },
  ul(message) {
    return $(HtmlTag.UL_TAG).html(message)
  },
  p(message) {
    return $(HtmlTag.P_TAG).html(message)
  },
  table(message) {
    return $(HtmlTag.TABLE_TAG).html(message)
  },
  thead(message) {
    return $(HtmlTag.THEAD_TAG).html(message)
  },
  tbody(message) {
    return $(HtmlTag.TBODY_TAG).html(message)
  },
  tfooter(message) {
    return $(HtmlTag.TFOOTER_TAG).html(message)
  },
  tr(message) {
    return $(HtmlTag.TR_TAG).html(message)
  },
  th(message) {
    return $(HtmlTag.TH_TAG).html(message)
  },
  td(message) {
    return $(HtmlTag.TD_TAG).html(message)
  },
  strong(message) {
    return $(HtmlTag.STRONG_TAG).html(message)
  },
  select() {
    return $(HtmlTag.SELECT_TAG)
  },
  option({ message, value = '' }) {
    return $(HtmlTag.OPTION_TAG).attr('value', value).html(message)
  },
  button(message) {
    return $(HtmlTag.BUTTON_TAG).html(message)
  },
  hr() {
    return $(HtmlTag.HR_TAG)
  },
  nav() {
    return $(HtmlTag.NAV_TAG)
  },
  ol() {
    return $(HtmlTag.OL_TAG)
  },
  img({ src, alt }) {
    return $(HtmlTag.IMG_TAG).attr('src', src).attr('alt', alt)
  }
}

const DataTableConsts = {
  DATATABLE_SELECT_FILTER_COLUMN: 'data-filter'
}

/**
 * Function to encapsulate the datatable creation logic
 * according to this project necessity.
 */
const DataTableFactory = function () {
  const _dataTableConf = {
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
      infoFiltered: " - filtrado de _MAX_ registros",
      infoEmpty: ""
    },
    initComplete: _addSelectFilterToDataTable
  }

  /**
   * Factory function.
   * 
   * @param element Table
   */
  function of(element) {
    return element.DataTable(_dataTableConf)
  }

  function _addSelectFilterToDataTable() {

    function addSelectFilter() {
      const column = this
      const header = $(column.header())

      if (header.attr(DataTableConsts.DATATABLE_SELECT_FILTER_COLUMN) == undefined) {
        return
      }

      function filterTableData() {
        const columnHeaderValue = $.fn.dataTable.util.escapeRegex($(this).val())
        const searchContent = columnHeaderValue ? '^' + columnHeaderValue + '$' : ''
        column.search(searchContent, true, false).draw()
      }

      const select = HtmlBuilder.select()
        .addClass('form-control mb-2')
        .append(HtmlBuilder.option({ message: 'Filtrar' }))
        .prependTo(header)
        .change(filterTableData)

      column.data().unique().sort().each(function (value) {
        select.append(HtmlBuilder.option({ value, message: value }))
      })
    }

    this.api().columns().every(addSelectFilter)
  }

  return { of }
}

/**
 * Move the screen to an element within the page.
 * 
 * Example: '#header'
 * 
 * @param element Element in page, can be a tag, id, class, etc.
 */
function moveToPageElemnt(element) {
  $('body, html').animate({ scrollTop: $(element).offset().top }, 600);
}

/**
 * @todo refactor
 */
const GitHubRepositoriesHtmlBuilder = function () {
  const _dataTableFactory = DataTableFactory()
  const _gitHubService = GitHubRepositoriesService()

  /**
   * Build a 'default' DIV element with a title and value.
   */
  function _genericInfo({ title, value }) {
    return HtmlBuilder.div().addClass('mt-2')
      .append(HtmlBuilder.div(HtmlBuilder.strong(title)))
      .append(HtmlBuilder.div(value))
  }
  /**
   * Create a HTML element of repository to a list of repositories;
   */
  function createRepository({ repository, onOpenRepositoryDetailCallback }) {

    const { name, description } = repository

    return HtmlBuilder.li("")
      .addClass('github-repositories__item list-group-item')
      .append(HtmlBuilder.div(HtmlBuilder.strong(name)))
      .append(HtmlBuilder.div(`${description ? description : '(Sem descrição)'}`))
      .append(HtmlBuilder.button('Detalhes')
        .addClass('btn btn-primary mt-2')
        .click(onOpenRepositoryDetailCallback))
  }

  /**
   * Create a HTML element with detail of a repository.
   * 
   * Receive the HTML elements of issues and contributors.
   * Receive a callback to return to previus div.
   */
  function createRepositoryDetail({ repository, issuesHTML, contributorsHTML, backToRepositoriesCallback }) {
    const { name, description, created_at } = repository
    const validDescription = description
      ? description
      : '(sem descrição)'

    function createNavTabHTML() {
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

      return navTabsHTML
    }

    function createTabContentHTML() {
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

      return tabContentHTML
    }

    function createBackToRepositoriesLinkHTML() {
      return HtmlBuilder.button("Voltar para lista de repositorios")
        .addClass('btn btn-secondary')
        .click(backToRepositoriesCallback)
    }

    const repositoryDetailHTML = HtmlBuilder.div("")
      .addClass("github-repositories__repository-detail")
      .append(HtmlBuilder.h2("Detalhes do repositório"))
      .append(HtmlBuilder.div("").addClass('repository-detail__general border')
        .append(HtmlBuilder.h3("Geral"))
        .append(_genericInfo({ title: "Nome", value: name }))
        .append(_genericInfo({ title: "Descrição", value: validDescription }))
        .append(_genericInfo({ title: "Criado em", value: created_at })))
      .append(createNavTabHTML())
      .append(createTabContentHTML())
      .append(createBackToRepositoriesLinkHTML())

    return repositoryDetailHTML
  }

  /**
   * Create a HTML element of the contributors of a repository.
   */
  function createRepositoryContributors({ contributors }) {

    function filterContributorsByAboveContributions(
      parameterContributors,
      parameterContributions) {

      const filteredContributors = []
      for (contributor of parameterContributors) {
        if (contributor.contributions > parameterContributions) {
          filteredContributors.push(contributor)
        }
      }
      return filteredContributors
    }

    function createContributorsTable(parameterContributors, minimumContributions) {
      const contributorsTableHTML = HtmlBuilder.table("")
        .addClass('table table-striped border repository-detail__contributors__contributors-table')
        .attr('id', `contributors-table-${minimumContributions}`)

      const theadHTML = HtmlBuilder.thead("")
        .append(HtmlBuilder.tr()
          .append(HtmlBuilder.th("Nome"))
          .append(HtmlBuilder.th("Contribuições")))

      const tbodyHTML = HtmlBuilder.tbody("")

      for (contributor of parameterContributors) {
        const { login, contributions } = contributor

        const trHTML = HtmlBuilder.tr("")
          .append(HtmlBuilder.td(login))
          .append(HtmlBuilder.td(contributions))

        tbodyHTML.append(trHTML)
      }

      return contributorsTableHTML.append(theadHTML).append(tbodyHTML)
    }

    const contributorsAbove100Contributions = filterContributorsByAboveContributions(contributors, 100)
    const contributorsAbove200Contributions = filterContributorsByAboveContributions(contributors, 200)
    const contributorsAbove500Contributions = filterContributorsByAboveContributions(contributors, 500)

    const contributorsAbove100TableHTML = createContributorsTable(contributorsAbove100Contributions, 100)
    const contributorsAbove200TableHTML = createContributorsTable(contributorsAbove200Contributions, 200)
    const contributorsAbove500TableHTML = createContributorsTable(contributorsAbove500Contributions, 500)

    const contributorsHTML = HtmlBuilder.div("")
      .addClass('repository-detail__contributors mb-3 border p-3')
      .append(HtmlBuilder.h3("Contribuidores"))
      .append(HtmlBuilder.h4(`Contribuidores com mais de 100 contribuições`).addClass('mt-4'))
      .append(contributorsAbove100TableHTML)
      .append(HtmlBuilder.h4(`Contribuidores com mais de 200 contribuições`).addClass('mt-4'))
      .append(contributorsAbove200TableHTML)
      .append(HtmlBuilder.h4(`Contribuidores com mais de 500 contribuições`).addClass('mt-4'))
      .append(contributorsAbove500TableHTML)

    _dataTableFactory.of(contributorsAbove100TableHTML)
    _dataTableFactory.of(contributorsAbove200TableHTML)
    _dataTableFactory.of(contributorsAbove500TableHTML)

    return contributorsHTML
  }

  /**
   * Create a HTML element of the issues of a repository.
   */
  async function createRepositoryIssues({ issues }) {
    const issuesHTML = HtmlBuilder.div()
      .addClass('repository-detail__issues mb-3 border p-3')
    let issueDetailHTML = createIssueDetail({ issue: undefined })

    if (!issues || issues.length <= 0) {
      return issuesHTML.append(HtmlBuilder.div("Não há issues"))
    }

    async function fetchAndFillIssueDetail({ issue }) {
      const { comments_url } = issue
      const issueComments = await _gitHubService.fetchIssueComments(comments_url)
      issueDetailHTML.html(createIssueDetail({ issue, issueComments }))
      moveToPageElemnt("#issue-detail")
    }

    const issuesTableHTML = HtmlBuilder.table("")
      .addClass('table table-striped border')
      .attr('id', 'issues-table')
    const theadHTML = HtmlBuilder.thead("")
      .append(HtmlBuilder.tr()
        .append(HtmlBuilder.th("Nome"))
        .append(HtmlBuilder.th("Status").attr(DataTableConsts.DATATABLE_SELECT_FILTER_COLUMN, DataTableConsts.DATATABLE_SELECT_FILTER_COLUMN))
        .append(HtmlBuilder.th("Detalhes")))
    const tbodyHTML = HtmlBuilder.tbody("")

    for (issue of issues) {
      const issueWithoutCache = issue
      const { title, state } = issueWithoutCache

      function onOpenIssueDetail() { fetchAndFillIssueDetail({ issue: issueWithoutCache }) }

      const trHTML = HtmlBuilder.tr("")
        .append(HtmlBuilder.td(`${title}`))
        .append(HtmlBuilder.td(`${state}`))
        .append(HtmlBuilder.td(HtmlBuilder.button("Mais")
          .addClass('btn btn-primary')
          .click(onOpenIssueDetail)))

      tbodyHTML.append(trHTML)
    }

    issuesTableHTML.append(theadHTML).append(tbodyHTML)
    issuesHTML
      .append(HtmlBuilder.h3("Issues"))
      .append(issuesTableHTML)
      .append(HtmlBuilder.hr())
      .append(issueDetailHTML)

    _dataTableFactory.of(issuesTableHTML)

    return issuesHTML
  }

  /**
   * Create a HTML element with the details of a issue.
   */
  function createIssueDetail({ issue, issueComments }) {
    const issueDetailHTML = HtmlBuilder.div("")
      .attr('id', 'issue-detail')
      .addClass('issue-detail')

    if (issue == undefined) {
      return issueDetailHTML
    }

    const { title, created_at, body, state, user } = issue
    const { login } = user
    const commentsHTML = createIssueComments({ issueComments })
    const description = body ? body : '(não há descrição)'

    issueDetailHTML
      .addClass('mt-2 mb-2 p-2')
      .append(HtmlBuilder.h4("Detalhes da issue"))
      .append(_genericInfo({ title: "Título", value: title }))
      .append(_genericInfo({ title: "Criador", value: login }))
      .append(_genericInfo({ title: "Criado em", value: created_at }))
      .append(_genericInfo({ title: "Status", value: state }))
      .append(_genericInfo({ title: "Descrição", value: description }))
      .append(commentsHTML)

    return issueDetailHTML
  }

  /**
   * Create a HTML element with the comments of a issue.
   */
  function createIssueComments({ issueComments }) {
    const issueCommentsHTML = HtmlBuilder.div(HtmlBuilder.strong("Comentários da issue"))
      .attr('id', 'issue-comments')
      .addClass('mt-2')

    if (issueComments == undefined || issueComments.length <= 0) {
      return issueCommentsHTML
        .append(HtmlBuilder.div("Não há comentários.").addClass("mt-2"))
    }

    const issueCommentsList = HtmlBuilder.ul("").addClass('issues-comments__list list-group mt-2')

    for (comment of issueComments) {
      const { created_at, body, user } = comment
      const { login } = user
      const issueCommentHTML = HtmlBuilder.li("")
        .addClass('list-group-item')
        .append(HtmlBuilder.div(HtmlBuilder.strong(login)))
        .append(HtmlBuilder.div(created_at).addClass('text-secondary'))
        .append(HtmlBuilder.div(body))

      issueCommentsList.append(issueCommentHTML)
    }

    issueCommentsHTML.append(issueCommentsList)

    return issueCommentsHTML
  }

  return {
    createRepositoryDetail,
    createIssueDetail,
    createRepositoryIssues,
    createRepositoryContributors,
    createRepository,
    createIssueComments
  }
}

/**
 * Main function of the project.
 * 
 * 
 * @param {*} _gitHubService 
 */
const GitHubRepositories = function (_gitHubService = GitHubRepositoriesService()) {
  const _gitHubHtmlBuilder = GitHubRepositoriesHtmlBuilder()
  const _repositoriesContent = $('#github-repositories__content')
  const _breadcrumbList = $("#github-repositories__breadcrumb__list")
  let _repositoriesData = []

  /**
   * Constructor function.
   */
  async function init() {
    _fillContentWithLoadingSpinner()
    _repositoriesData = await _gitHubService.fetchAllRepositories()
    _fillRepositoriesList(_repositoriesData)
  }

  /**
   * Fill content element with a list of repositories of a user.
   */
  async function _fillRepositoriesList(repositories) {
    _fillContentWithLoadingSpinner()
    const repositoriesHTML = HtmlBuilder.ul("")
      .addClass('github-repositories__list list-group')

    for (repositoryIterated of repositories) {
      const repository = repositoryIterated
      function onOpenRepositoryDetailCallback() { _fillRepositoryDetail(repository) }

      const repositoryHTML = _gitHubHtmlBuilder.createRepository({
        repository, onOpenRepositoryDetailCallback,
      })

      repositoriesHTML.append(repositoryHTML)
    }

    const message = MOCK == true
      ? 'Segue abaixo a lista de repositórios com dados de <strong>mock</strong> (falsos).'
      : `Segue abaixo a lista de repositórios do usuário <strong>${gitHubUser}</strong>.`

    _breadcrumbList.empty()
      .append(HtmlBuilder.li("Repositórios").addClass("breadcrumb-item active"))
    _repositoriesContent
      .empty()
      .append(HtmlBuilder.h2("Lista de repositórios"))
      .append(HtmlBuilder.p(message))
      .append(repositoriesHTML)
  }

  /**
   * Fill content element with the detail of a repository.
   */
  async function _fillRepositoryDetail(repository) {
    _fillContentWithLoadingSpinner()
    function backToRepositoriesCallback() { _fillRepositoriesList(_repositoriesData) }
    const { issues_url, contributors_url } = repository

    const contributors = await _gitHubService.fetchRepositoryContributors(contributors_url)
    const issues = await _gitHubService.fetchRepositoryIssues(issues_url)

    const contributorsHTML = _gitHubHtmlBuilder.createRepositoryContributors({ contributors })
    const issuesHTML = await _gitHubHtmlBuilder.createRepositoryIssues({ issues })
    const detailHTML = _gitHubHtmlBuilder.createRepositoryDetail({ repository, issuesHTML, contributorsHTML, backToRepositoriesCallback })

    _breadcrumbList.empty()
      .append(HtmlBuilder.li(HtmlBuilder.a({ message: 'Repositórios', href: '#' })
        .click(backToRepositoriesCallback))
        .addClass("breadcrumb-item"))
      .append(HtmlBuilder.li("Detalhe").addClass("breadcrumb-item active"))
    _repositoriesContent.empty()
      .append(detailHTML)

    $('#issues-and-contributors a:first').tab('show')
  }

  /**
   * Replace all content with a spinner.
   */
  function _fillContentWithLoadingSpinner() {
    _repositoriesContent.empty()
      .append(HtmlBuilder.div("")
        .addClass("loading")
        .append(HtmlBuilder.img({ src: "/assets/img/loader.gif", alt: "Carregando..." })))
  }

  return { init }
}

const gitHubRepositories = GitHubRepositories()
gitHubRepositories.init()
