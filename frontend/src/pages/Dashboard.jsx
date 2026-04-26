import { useState } from 'react'
import { AppProvider } from '../context/AppContext'
import Navbar    from '../components/layout/Navbar'
import Layout    from '../components/layout/Layout'
import Portfolio from '../components/portfolio/Portfolio'
import AlertsManager from '../components/alerts/AlertsManager'
import JournalManager from '../components/journal/JournalManager'
import WatchlistManager from '../components/watchlist/WatchlistManager'
import TechnicalChart from '../components/charts/TechnicalChart'
import IntelligenceDashboard from '../components/intelligence/IntelligenceDashboard'
import ManagerHub from '../components/layout/ManagerHub'
import TickerTape from '../components/layout/TickerTape'

// keep other stubs for now

const sections = { 
  portfolio: Portfolio, 
  hub: ManagerHub,
  charts: TechnicalChart,
  intelligence: IntelligenceDashboard
}




export default function Dashboard() {
  const [active, setActive] = useState('portfolio')
  const Section = sections[active]

  return (
    <>
      <Navbar active={active} onChange={setActive} />
      <TickerTape />
      <Layout>
        <Section />
      </Layout>
    </>
  )
}