import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Properties from './pages/Properties'
import Tenants from './pages/Tenants'
import Payments from './pages/Payments'
import Reports from './pages/Reports'
import PropertyDetails from './pages/PropertyDetails'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/tenants" element={<Tenants />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />

          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App