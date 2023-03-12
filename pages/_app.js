import { useEffect, useState } from 'react'
import Layout from '../layout'
import Cookies from 'js-cookie'
import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  const isAuthorized = Cookies.get('token_simpeg')
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  if (!isAuthorized) {
    return <Component {...pageProps} />
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
