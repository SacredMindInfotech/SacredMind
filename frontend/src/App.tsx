import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Landing from './pages/LandingPage'
import Contact from './pages/contact'
import Category from './pages/category'
import Course from './pages/course'
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
import CourseContent from './pages/courseContent'
import MetaPixel from './MetaPixel'
import PricingPolicy from './pages/pricingPolicy'
import OnlyPaidUsers from './routesProtection/onlyPaidUsers'
import CategoryManagement from './pages/dashboard/categoryManagement'
import Careers from './pages/careers'
import EditJob from './components/ui/dashboard/job/editJob'
import AddCourse from './components/ui/dashboard/course/addCourse'
import EditCourse from './components/ui/dashboard/course/editCourse'
import Purchases from './pages/purchases'
import UserDetails from './components/ui/dashboard/user/UserDetails'
import Footer from './components/ui/footer'
import Navbar from './components/ui/navbar'
import ViewContent from './components/ui/viewContent'
import AllReviews from './pages/allReviewsPage'
import NotFound from './pages/NotFound'
import TeachWithUs from './pages/TeachWithUs'
import AboutUs from './pages/AboutUs'
import OurServices from './pages/OurServices'
function App() {
  const Router = createBrowserRouter([

    {
      path: "/",
      element: <>
        <Navbar></Navbar>
        <Landing></Landing>
        <Footer />
      </>
    },{
      path:"/about-us",
      element: <>
        <Navbar></Navbar>
        <AboutUs />
        <Footer />
      </>
    },
    {
      path: "/services",
      element: <>
        <Navbar></Navbar>
        <OurServices />
        <Footer />
      </>
    },
    {
      path: "/category/:categoryName",
      element: <>
        <Navbar></Navbar>
        <Category></Category>
        <Footer />
      </>
    },
    {
      path: "/course/:courseTitle",
      element: <>
        <Navbar></Navbar>
        <Course></Course>
        <Footer />
      </>
    },
    {
      path: "/course/:courseId/content",
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
      path: "/course/:courseId/content/:contentKey",
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
        { path: "user/:clerkUserId", element: <UserDetails /> },
        { path: "courses", element: <CourseManagement /> },
        { path: "course/:courseTitle", element: <EditCourse /> },
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
      path: "/all-reviews",
      element: <>
          <Navbar></Navbar>
          <AllReviews />
          <Footer />
      </>
    },
    {
      path: "/teach-with-us",
      element: <>
        <Navbar></Navbar>
        <TeachWithUs />
        <Footer />
      </>
    },
    {
      path: "*",
      element: <>
        <Navbar></Navbar>
        <NotFound/>
        <Footer />
      </>
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
