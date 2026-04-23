import { useState } from 'react'
import { AppProvider } from '../context/AppContext'
import Navbar    from '../components/layout/Navbar'
import Layout    from '../components/layout/Layout'
import Portfolio from '../components/portfolio/Portfolio'
import AlertsManager from '../components/alerts/AlertsManager'
import JournalManager from '../components/journal/JournalManager'
import WatchlistManager from '../components/watchlist/WatchlistManager'

// keep other stubs for now

const sections = { portfolio: Portfolio, journal: JournalManager, alerts: AlertsManager, watchlist: WatchlistManager }




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