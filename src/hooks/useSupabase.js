import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

// Generic hook for fetching Supabase data
export const useSupabaseQuery = (table, options = {}) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      let query = supabase.from(table).select(options.select || '*')

      if (options.filter && Object.keys(options.filter).length > 0) {
        Object.entries(options.filter).forEach(([key, value]) => {
          query = query.eq(key, value)
        })
      }

      if (options.order) {
        query = query.order(options.order.column, { ascending: options.order.ascending ?? true })
      }

      if (options.limit) {
        query = query.limit(options.limit)
      }

      const { data: result, error: err } = await query

      if (err) throw err
      setData(result || [])
    } catch (err) {
      console.error(`Error fetching ${table}:`, err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [table, JSON.stringify(options)])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { data, loading, error, refetch: fetch }
}

// Portfolio hooks
export const usePortfolio = () => {
  return useSupabaseQuery('portfolio_projects', {
    order: { column: 'sort_order', ascending: true },
  })
}

// Testimonials hooks
export const useTestimonials = (adminMode = false) => {
  return useSupabaseQuery('testimonials', {
    filter: adminMode ? undefined : { featured: true },
    order: { column: 'sort_order', ascending: true },
  })
}

// Homepage content hook
export const useHomepageContent = () => {
  const [content, setContent] = useState({})
  const [loading, setLoading] = useState(true)

  const fetchContent = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await supabase.from('homepage_content').select('*')
      if (data) {
        const map = {}
        data.forEach(item => { map[item.key] = item.value })
        setContent(map)
      }
    } catch (err) {
      console.error('Error fetching homepage content:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchContent() }, [fetchContent])

  return { content, loading, refetch: fetchContent }
}

// Social links hook
export const useSocialLinks = () => {
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLinks = async () => {
      const { data } = await supabase.from('social_links').select('*').eq('visible', true)
      setLinks(data || [])
      setLoading(false)
    }
    fetchLinks()
  }, [])

  return { links, loading }
}

// Contact submissions hook
export const useContactSubmissions = () => {
  return useSupabaseQuery('contact_submissions', {
    order: { column: 'created_at', ascending: false },
  })
}

// Submit contact form
export const submitContact = async (formData) => {
  const { data, error } = await supabase
    .from('contact_submissions')
    .insert([formData])
    .select()
  return { data, error }
}
