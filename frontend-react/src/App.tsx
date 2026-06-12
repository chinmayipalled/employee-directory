import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from '@/components/NavBar'
import EmployeesPage from '@/pages/EmployeesPage'
import DepartmentsPage from '@/pages/DepartmentsPage'
import TicketsPage from '@/pages/TicketsPage'

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <div className="bg-gray-50 min-h-screen">
        <NavBar />
        <Routes>
          <Route path="/" element={<EmployeesPage />} />
          <Route path="/departments" element={<DepartmentsPage />} />
          <Route path="/tickets" element={<TicketsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
