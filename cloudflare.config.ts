import { defineConfig } from 'cf/config'

/**
 * Cloudflare Workers の設定。
 * React Router の SPA ビルド出力（build/client）を Workers Static Assets として配信する。
 */
export default defineConfig({
  worker: {
    name: 'ya-nr-sim',
    compatibilityDate: '2026-11-16',
    assets: {
      notFoundHandling: 'single-page-application',
    },
    workersDev: true,
    previewUrls: true,
  },
})
