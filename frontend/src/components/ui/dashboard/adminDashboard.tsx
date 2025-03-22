import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiUsers, FiBookOpen } from 'react-icons/fi';
import { useAuth } from '@clerk/clerk-react';

interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
//   totalRevenue: number;
//   totalOrders: number;
}

interface UserStats {
  totalUsers: number;
  newUsersLastMonth: number;
  newUsersLastWeek: number;
  newUsersToday: number;
}

const AdminDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getToken } = useAuth();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = await getToken();
        const [statsRes, usersRes] = await Promise.all([
          axios.get(`${backendUrl}api/v1/admin/dashboard/stats`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          axios.get(`${backendUrl}api/v1/admin/dashboard/users`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        ]);
        // @ts-ignore
        setDashboardStats(statsRes.data);
        // @ts-ignore
        setUserStats(usersRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome to your admin dashboard</p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={userStats?.totalUsers || 0}
          icon={<FiUsers className="w-6 h-6" />}
          color="bg-blue-500"
        />
      
        <StatsCard
          title="Total Courses"
          value={dashboardStats?.totalCourses || 0}
          icon={<FiBookOpen className="w-6 h-6" />}
          color="bg-yellow-500"
        />
        {/* <StatsCard
          title="Total Orders"
          value={dashboardStats?.totalOrders || 0}
          icon={<FiShoppingCart className="w-6 h-6" />}
          color="bg-purple-500"
        /> */}
      </div>

      {/* User Growth Stats */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-6">User Growth Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-gray-500 text-sm mb-2">New Users (Today)</h3>
            <p className="text-2xl font-semibold text-blue-600">{userStats?.newUsersToday}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-gray-500 text-sm mb-2">New Users (This Week)</h3>
            <p className="text-2xl font-semibold text-blue-600">{userStats?.newUsersLastWeek}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-gray-500 text-sm mb-2">New Users (This Month)</h3>
            <p className="text-2xl font-semibold text-blue-600">{userStats?.newUsersLastMonth}</p>
          </div>
        </div>
      </div>

      {/* User Growth Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">User Growth Trend</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="50%" height="100%">
            <BarChart data={[
                { period: 'This Month', users: userStats?.newUsersLastMonth || 0 },
                { period: 'This Week', users: userStats?.newUsersLastWeek || 0 },
                { period: 'Today', users: userStats?.newUsersToday || 0 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
    </div>

  );
};

// Stats Card Component
const StatsCard = ({ title, value, icon, color }: { title: string; value: string | number; icon: React.ReactNode; color: string }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex items-center">
      <div className={`${color} p-3 rounded-full text-white`}>
        {icon}
      </div>
      <div className="ml-4">
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  </div>
);

export default AdminDashboard;
