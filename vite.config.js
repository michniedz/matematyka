import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Na GitHub Pages projekt jest serwowany z podkatalogu o nazwie repozytorium,
// np. https://michniedz.github.io/matematyka/. Lokalnie używamy ścieżki /.
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const isUserSite = repositoryName?.endsWith('.github.io')
const base = repositoryName && !isUserSite ? `/${repositoryName}/` : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
})
