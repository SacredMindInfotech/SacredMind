import { Link, Outlet, useLocation } from "react-router-dom";

const AdminLayout = () => {
  const location = useLocation();

  const navItems = [
    { path: "/admin", label: "Dashboard" },
    { path: "/admin/users", label: "Users" },
    { path: "/admin/courses", label: "Courses" },
    { path: "/admin/orders", label: "Orders" },
    { path: "/admin/jobs", label: "Jobs" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-72 bg-gray-900 p-6">
        
        <div className="flex flex-col items-center gap-8">
          {/* Logo and Company Name */}
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="logo" className="w-12 h-12" />
            <span className="text-white font-medium text-lg">Sacred Mind Infotech Pvt Ltd</span>
          </div>

          {/* Circular User Profile Section */}
          {/* <div className="flex z-10 flex-col items-center mt-10  justify-center">
            <UserButton appearance={{
              layout: {
                termsPageUrl: 'https://clerk.com/terms'
              }
            }} />
            <span className="text-black montserrat-500 text-sm">{user?.firstName}</span>
            <span className="text-black montserrat-500 text-sm">{user?.lastName}</span>
          </div> */}

          {/* Navigation */}
          <nav className="w-full bg-gray-300 p-2 min-h-[60vh] rounded-lg">
            
            <ul className="space-y-4 mt-28">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      block px-4 py-3 rounded-lg transition duration-200
                      text-sm font-medium montserrat-secondary w-full
                      ${location.pathname === item.path
                        ? 'bg-white text-gray-900'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                      }
                    `}
                  >
                    {item.label}
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
