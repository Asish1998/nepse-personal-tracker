import { useState } from 'react'
import { AppProvider } from '../context/AppContext'
import Navbar    from '../components/layout/Navbar'
import Layout    from '../components/layout/Layout'
import Portfolio from '../components/portfolio/Portfolio'
import AlertsManager from '../components/alerts/AlertsManager'

// keep other stubs for now
function Journal()   { return <div style={{color:'var(--muted)'}}>Trade Journal — next</div> }
function Watchlist() { return <div style={{color:'var(--muted)'}}>Watchlist — next</div> }
function FeeRef()    { return <div style={{color:'var(--muted)'}}>Fee Reference — next</div> }

const sections = { portfolio: Portfolio, journal: Journal, alerts: AlertsManager, watchlist: Watchlist, feeref: FeeRef }


export default function Dashboard() {
  const [active, setActive] = useState('portfolio')
  const Section = sections[active]

  return (
    <AppProvider>
      <Navbar active={active} onChange={setActive} />
      <Layout>
        <Section />
      </Layout>
    </AppProvider>
  )
}