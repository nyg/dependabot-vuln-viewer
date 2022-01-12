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

export const sumVulnCount = (sum, repo) => {
  return sum + repo.alerts.totalCount
}

export const highestSeverityFirst = ({ props: { vuln } }, { props: { vuln: anotherVuln } }) =>
  severityImportance[anotherVuln.severity] - severityImportance[vuln.severity]

export const cveFirstThenGhsa = ({ type }, { anotherType }) =>
  type.localeCompare(anotherType)
