import { useEffect } from 'react'

/**
 * Dynamically set the document <title> and meta description per page.
 * Falls back gracefully if no values supplied.
 */
export default function usePageMeta({ title, description } = {}) {
  useEffect(() => {
    if (title) {
      document.title = title
    }
    if (description) {
      let meta = document.querySelector('meta[name="description"]')
      if (meta) meta.setAttribute('content', description)
    }

    // Reset on unmount
    return () => {
      document.title = 'RazzShares | Web3 Content Creator & Community Moderator'
    }
  }, [title, description])
}
