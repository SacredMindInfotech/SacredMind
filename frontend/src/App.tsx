
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Landing from './pages/landing'
import Footer from './components/ui/footer'
import Contact from './components/ui/contact'
import Navbar from './components/ui/navbar'
import Category from './components/ui/category'
import Course from './components/ui/course'
import AdminLayout from './pages/adminLayout'
import UserManagement from './components/ui/userManagement'
import CourseManagement from './components/ui/courseManagement'
import OrderManagement from './components/ui/orderManagement'
import AdminDashboard from './components/ui/adminDashboard'
import Careers from './components/ui/careers'
import ProtectedRoutes from './components/protected-routes'
import JobDetails from './components/ui/jobDetails'
import JobManagement from './components/ui/jobManagement'
import PrivacyPolicy from './components/ui/PrivacyPolicy'
import TermsAndConditions from './components/ui/TermsAndConditions'
import SalesAndRefunds from './components/ui/SalesAndRefunds'

function App() {
  const Router = createBrowserRouter([
    {
      path: "/",
      element: <>

        <Navbar></Navbar>
        <Landing></Landing>
        <Footer />
      </>
    },
    {
      path: "/category/:id",
      element: <>
        <Navbar></Navbar>
        <Category></Category>
        <Footer />
      </>
    },
    {
      path: "/course/:id",
      element: <>
        <Navbar></Navbar>
        <Course></Course>
        <Footer />
      </>
    },
    {
      path: "/admin",
      element: <ProtectedRoutes><AdminLayout /></ProtectedRoutes>,
      children: [
        { path: "", element: <AdminDashboard /> },
        { path: "users", element: <UserManagement /> },
        { path: "courses", element: <CourseManagement /> },
        { path: "orders", element: <OrderManagement /> },
        { path: "jobs", element: <JobManagement /> },
      ]
    },
    {
      path: "/contact",
      element: <>
        <Navbar></Navbar>
        <Contact></Contact>
        <Footer />
      </>
    },
    {
      path: "/careers",
      element: <>
        <Navbar></Navbar>
        <Careers></Careers>
        <Footer />
      </>
    },
    {
      path: "/careers/:id",
      element: <>
        <Navbar></Navbar>
        <JobDetails />
        <Footer />
      </>
    },{
      path: "/privacy-policy",
      element: <>
        <Navbar></Navbar>
        <PrivacyPolicy />
        <Footer />
      </>
    },
    {
      path: "/terms-and-conditions",
      element: <>
        <Navbar></Navbar>
        <TermsAndConditions />
        <Footer />
      </>
    },
    {
      path: "/sales-and-refunds",
      element: <>
        <Navbar></Navbar>
        <SalesAndRefunds />
        <Footer />
      </>
    }
  ])
  return (
    <div>
      <RouterProvider router={Router}></RouterProvider>

    </div>
  )
}

export default App
