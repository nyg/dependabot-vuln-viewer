const SETTINGS_KEY = 'search_settings'

const FIELDS = ['query', 'githubApiUrl', 'githubApiToken', 'repoCount', 'vulnCount']

export const saveSettings = (values) => {
   if (typeof window === 'undefined') {
      return
   }
   const settings = {}
   for (const field of FIELDS) {
      if (values[field] !== undefined) {
         settings[field] = values[field]
      }
   }
   localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export const loadSettings = () => {
   if (typeof window === 'undefined') {
      return null
   }
   try {
      const stored = localStorage.getItem(SETTINGS_KEY)
      return stored ? JSON.parse(stored) : null
   } catch {
      return null
   }
}
