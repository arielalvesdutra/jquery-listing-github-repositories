/**
 * "collaborators_url": "https://api.github.com/repos/octocat/git-consortium/collaborators{/collaborator}"
 * comments: comments_url": "https://api.github.com/repos/octocat/git-consortium/comments{/number}",
 * issues comments: "https://api.github.com/repos/octocat/git-consortium/issues/comments{/number}",
 * 
 * "issues_url": "https://api.github.com/repos/octocat/boysenberry-repo-1/issues{/number}",
 * * "issues_url": "https://api.github.com/repos/arielalvesdutra/hcrpr-frontend/issues",
 */

const userRepositoriesUrl = '' // return a list of repositories
// repository.

const repositoriesMock = [
  {
    name: "boysenberry-repo-1",
    html_url: "https://github.com/octocat/boysenberry-repo-1",
  }
]

const ulTAG = '<ul></ul>'
const liTAG = '<li></li>'
const divTAG = '<div></div>'

const issuesMock = [
  {
    body: "Corrigir o novo erro gerado na versão 1.2.3",
    created_at: "2019-11-25T10:38:13Z",
    updated_at: "2019-11-27T18:50:56Z",
    state: "open",
    title: "Titulo da issue",
    html_url: "https://github.com/arielalvesdutra/hcrpr-frontend/issues/2",
    comments_url: "https://api.github.com/repos/arielalvesdutra/hcrpr-frontend/issues/2/comments",
  }
]

const issueCommentsMock = [
  {
    html_url: "https://github.com/arielalvesdutra/hcrpr-frontend/issues/39#issuecomment-656298108",
    created_at: "2020-07-09T19:02:37Z",
    updated_at: "2020-07-09T19:02:37Z",
    author_association: "OWNER",
    body: "Teste"
  }
]

const collaboratorsMock = [
// perPage=20&page=1
]

const contributorsMock = [
  {
    login: "jmarlena",
    id: 6732600,
    node_id: "MDQ6VXNlcjY3MzI2MDA=",
    avatar_url: "https://avatars3.githubusercontent.com/u/6732600?v=4",
    gravatar_id: "",
    url: "https://api.github.com/users/jmarlena",
    html_url: "https://github.com/jmarlena",
    contributions: 4
  }
]

const GitHubRepositoryService = {
  async fetchAllRepositories() {
    const url = `/assets/data/mock-repos-github-return.json`
    const response = await axios.get(url)
    return response.data
  }
}

const HtmlBuilder = {
  buildRepositoryElement(repository) {
    
    const issues = issuesMock
    const contributors = contributorsMock

    return $('<li></li>', {
      html: `<h2>${repository.name}</h2>
      <a target="_blank" href="${repository.html_url}">Link</a>`
    })
    .append(HtmlBuilder.buildRepositoryIssues(issues))
    .append(HtmlBuilder.buildRepositoryContributors(contributors))
  },
  buildRepositoryContributors(contributors){

    let htmlContributorsList = $(ulTAG)

    for (contributor of contributors) {
      let htmlContributorItem = $(liTAG, {
        html: `<div>login: ${contributor.login}</div>
        <div>Contribuições: ${contributor.contributions} </div>
        `
      })

      htmlContributorsList.append(htmlContributorItem)
    }

    return $(divTAG, {
      html: `<strong>Lista de contribuideres desse projeto</strong>`
    }).append(htmlContributorsList)
  },
  buildRepositoryIssues(issues) {
    let htmlIssuesList = $('<ul><ul>')

    for (issue of issues) {

      const htmlIssueComments = HtmlBuilder.buildIssueComments(issueCommentsMock)

      let htmlIssueItem = $('<li></li>', {
        html: `<div>Titilo: ${issue.title}</div>
        <div>Descrição: ${issue.body}</div>`
      }).append(htmlIssueComments)

      htmlIssuesList.append(htmlIssueItem)
    }

    const htmlIssues = $('<div></div>', {
      html: `<strong>Lista de issues</strong>`
    }).append(htmlIssuesList)

    return htmlIssues
  },
  buildIssueComments(comments) {
    let htmlIssueCommentsList = $(ulTAG)

    for (comment of comments) {

      let htmlIssueCommentItem = $(liTAG, {
        html: `<div>Comentário: ${issue.body}</div>`
            + `<div>Criado em: ${issue.created_at}</div>`
      })

      htmlIssueCommentsList.append(htmlIssueCommentItem)
    }

    const htmlIssueComments = $(divTAG, {
      html: `<strong>Lista de comentários da issue</strong>`
    }).append(htmlIssueCommentsList)

    return htmlIssueComments

  }
}

const GitHubRepositories = {
  _repositories_list: $('.github-repositories__list'),
  _repositories_data: [],
  async init() {
    GitHubRepositories._repositories_data = await GitHubRepositoryService.fetchAllRepositories()
    GitHubRepositories._fillRepositoriesOnPage(GitHubRepositories._repositories_data)

    console.log('repo', GitHubRepositories._repositories_data)
  },
  
  _fillRepositoriesOnPage(repositories) {
    // GitHubRepositories._clearRepositoriesList()
    
    const reposMock = repositoriesMock

    for (repository of reposMock) {
      GitHubRepositories._repositories_list
        .append(HtmlBuilder.buildRepositoryElement(repository))
    }
  },
  _clearRepositoriesList() {
    GitHubRepositories._repositories_list.empty()
  }

}

GitHubRepositories.init()
