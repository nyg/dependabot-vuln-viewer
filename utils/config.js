export const packageLink = (ecosystem, name) => {
   switch (ecosystem) {
      case 'COMPOSER': return `https://packagist.org/packages/${name}`
      case 'GO': return `https://pkg.go.dev/${name}`
      case 'MAVEN': return `https://mvnrepository.com/artifact/${name.replace(':', '/')}`
      case 'NPM': return `https://www.npmjs.com/package/${name}`
      case 'NUGET': return `https://www.nuget.org/packages/${name}`
      case 'PIP': return `https://pypi.org/project/${name}`
      case 'RUBYGEMS': return `https://rubygems.org/gems/${name}`
      case 'RUST': return `https://crates.io/crates/${name}`
   }
}


export const severityColor = {
   LOW: { text: 'text-yellow-400', border: 'border-yellow-400' },
   MODERATE: { text: 'text-orange-400', border: 'border-orange-400' },
   HIGH: { text: 'text-red-600', border: 'border-red-600' },
   CRITICAL: { text: 'text-red-800', border: 'border-red-800' }
}

export const severityImportance = {
   LOW: 1, MODERATE: 2, HIGH: 3, CRITICAL: 4
}


export const vulnerableRepos = repo =>
   repo.alerts.totalCount > 0

export const sumVulnCount = (sum, repo) =>
   sum + repo.alerts.totalCount


export const cveFirstThenGhsa = ({ type }, { anotherType }) =>
   type.localeCompare(anotherType)

export const authHeader = token =>
   ({ 'Authorization': `Bearer ${token}` })
