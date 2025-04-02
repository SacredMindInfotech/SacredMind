
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Landing from './pages/landing'
import Footer from './components/ui/footer'
import Contact from './pages/contact'
import Navbar from './components/ui/navbar'
import Category from './components/ui/category'
import Course from './components/ui/course'
import AdminLayout from './pages/adminLayout'
import UserManagement from './pages/dashboard/userManagement'
import CourseManagement from './pages/dashboard/courseManagement'
import OrderManagement from './pages/dashboard/orderManagement'
import AdminDashboard from './components/ui/dashboard/adminDashboard'
import ProtectedRoutes from './routesProtection/protected-routes'
import JobDetails from './pages/jobDetails'
import JobManagement from './pages/dashboard/jobManagement'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsAndConditions from './pages/TermsAndConditions'
import SalesAndRefunds from './pages/SalesAndRefunds'
import Purchases from './components/ui/purchases'
import CourseContent from './components/ui/courseContent'
import MetaPixel from './MetaPixel'
import PricingPolicy from './pages/pricingPolicy'
import ViewContent from './components/ui/viewContent'
import OnlyPaidUsers from './routesProtection/onlyPaidUsers'
import CategoryManagement from './pages/dashboard/categoryManagement'
import Careers from './pages/careers'
import EditJob from './components/ui/dashboard/job/editJob'
import AddCourse from './components/ui/dashboard/course/addCourse'
import EditCourse from './components/ui/dashboard/course/editCourse'
// import PaymentCheckOutModal from './pages/paymentCheckOutPage'
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
      path: "/course/:id/content",
      element: <>
        <ProtectedRoutes>
          <OnlyPaidUsers>
            <Navbar></Navbar>
            <CourseContent></CourseContent>
            <Footer />
          </OnlyPaidUsers>
        </ProtectedRoutes>
      </>
    },
    {
      //id is required by onlyPaidUsers to check if the user has purchased the course
      path: "/course/:id/content/:contentKey",
      element: <>
        <ProtectedRoutes>
          <OnlyPaidUsers>
            <Navbar></Navbar>
            <ViewContent />
            <Footer />
          </OnlyPaidUsers>
        </ProtectedRoutes>
      </>
    },
    {
      path: "/admin",
      element: <ProtectedRoutes><AdminLayout /></ProtectedRoutes>,
      children: [
        { path: "", element: <AdminDashboard /> },
        { path: "users", element: <UserManagement /> },
        { path: "courses", element: <CourseManagement /> },
        { path: "course/:id", element: <EditCourse /> },
        { path: "course/add", element: <AddCourse /> },
        { path: "categories", element: <CategoryManagement /> },
        { path: "orders", element: <OrderManagement /> },
        { path: "jobs", element: <JobManagement /> },
        { path: "jobs/:id", element: <EditJob /> },
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
    }, {
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
    },
    {
      path: "/pricing-policy",
      element: <>
        <Navbar></Navbar>
        <PricingPolicy />
        <Footer />
      </>
    },
    {
      path: "/purchases",
      element: <>
        <ProtectedRoutes>
          <Navbar></Navbar>
          <Purchases />
          <Footer />
        </ProtectedRoutes>
      </>
    },
    {
      path: "/admin/course/:id",
      element: <EditCourse />
    }
  ])
  return (
    <div className='overflow-auto'>
      <MetaPixel />
      <RouterProvider router={Router}></RouterProvider>
    </div>
  )
}

export default App
