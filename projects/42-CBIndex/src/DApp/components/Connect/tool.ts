export function getProjectId() {
  const projectId = '879d4398ffd77f07cb62f8c987e12f1e'
  if (!projectId) {
    throw new Error('NEXT_PUBLIC_PROJECT_ID is not defined')
  }

  return projectId
}

type Theme = 'dark' | 'light'
export function getTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'dark'
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return (localStorage.getItem('THEME') as Theme) ?? 'dark'
}
