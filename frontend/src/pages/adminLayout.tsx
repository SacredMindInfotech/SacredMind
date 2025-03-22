import { Link, Outlet, useLocation } from "react-router-dom";
import { FiHome, FiUsers, FiBook, FiShoppingCart, FiBriefcase, FiBookOpen } from 'react-icons/fi';

const AdminLayout = () => {
  const location = useLocation();

  const navItems = [
    { path: "/admin", label: "Home" , icon: <FiHome />},
    { path: "/admin/users", label: "Users" , icon: <FiUsers />},
    { path: "/admin/courses", label: "Courses" , icon: <FiBook />},
    { path: "/admin/categories", label: "Categories" , icon: <FiBookOpen />},
    { path: "/admin/orders", label: "Orders" , icon: <FiShoppingCart />},
    { path: "/admin/jobs", label: "Jobs" , icon: <FiBriefcase />},
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-40 bg-gray-900 p-4">
        
        <div className="flex flex-col items-center gap-6">
          {/* Logo and Company Name */}
          <div className="flex items-center gap-1">
            <img src="/logo.svg" alt="logo" className="w-10 h-10" />
        </div>

          {/* Navigation */}
          <nav className="w-full bg-gray-300 p-1 min-h-[50vh] rounded-lg">
            
            <ul className="space-y-3 mt-20">
              {navItems.map((item) => (
                <li key={item.path}>
                    <Link
                      to={item.path}
                    className={`
                      block px-3 py-2 rounded-lg transition duration-200
                      text-sm font-medium montserrat-secondary w-full
                      ${location.pathname === item.path
                        ? 'bg-white text-gray-900'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                     {item.icon} {item.label}
                  </div>
                    </Link>
                </li>
              ))}
            </ul>
          </nav>

        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
