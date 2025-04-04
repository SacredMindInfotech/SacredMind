import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface User {
  id: number;
  clerkuserId: string;
  phoneNumber: string | null;
  email: string;
  firstName: string;
  lastName: string | null;
  imageUrl: string | null;
  role: "ADMIN" | "USER" | "MANAGER";
  createdAt: string;
  updatedAt: string;
  courses: UserCourse[];
}

interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string | null;
  published: boolean;
  enrolledAt: string;
  isActive: boolean;
}

interface UserCourse {
  id: number;
  userId: number;
  courseId: number;
  enrolledAt: string;
}

const UserDetails = () => {
  const { clerkUserId } = useParams();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [user, setUser] = useState<User | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      const token = await getToken();
      const response = await axios.get(`${backendUrl}api/v1/course`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const allCourses = response.data as Course[];
      const filteredCourses = allCourses.filter(
        (course) => !enrolledCourses.some((enrolledCourse) => enrolledCourse.id === course.id)
      );
      setCourses(filteredCourses);
    };
    fetchCourses();
  }, [enrolledCourses]);

  const fetchUserDetails = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      const response = await axios.get(`${backendUrl}api/v1/user/${clerkUserId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser(response.data as User);

      // Get user courses (enrollment data)
      //@ts-ignore
      const userCourses: UserCourse[] = response.data.courses;

      // Fetch detailed course information for each enrolled course
      if (userCourses.length > 0) {
        const courseDetailsPromises = userCourses.map(async (enrollment) => {
          try {
            const courseResponse = await axios.get(`${backendUrl}api/v1/course/${enrollment.courseId}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });

            return {
              //@ts-ignore
              ...courseResponse.data,
              enrolledAt: enrollment.enrolledAt
            };
          } catch (err) {
            console.error(`Error fetching course ${enrollment.courseId}:`, err);
            return null;
          }
        });

        const courseDetails = await Promise.all(courseDetailsPromises);
        setEnrolledCourses(courseDetails.filter((course: any) => course !== null));
      }

    } catch (err) {
      setError("Failed to load user details. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {

    if (clerkUserId) {
      fetchUserDetails();
    }
  }, [clerkUserId]);

  const handleGiveAccess = async () => {
    if (!selectedCourse || !user) return;

    setIsEnrolling(true);
    try {
      const token = await getToken();
      await axios.post(`${backendUrl}api/v1/admin/${selectedCourse}/adduser`,
        { userId: user.id },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setEnrollmentSuccess(true);
      // Refresh user details to show the newly enrolled course
      setTimeout(() => {
        fetchUserDetails();
        setIsPanelOpen(false);
        setSelectedCourse(null);
        setEnrollmentSuccess(false);
      }, 1500);

    } catch (err) {
      console.error("Error enrolling user:", err);
      setError("Failed to enroll user in the course. Please try again.");
    } finally {
      setIsEnrolling(false);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!user) {
    return <EmptyState />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-gray-900 text-white p-6">
              <h2 className="text-xl font-bold mb-8 border-b montserrat-700 border-gray-700 pb-4">User Details</h2>
              <div className="flex flex-col gap-3 montserrat-500">
                <button
                  className="p-3 rounded-md flex items-center transition-all bg-white text-gray-900 font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  User Profile
                </button>
                <button
                  className="p-3 rounded-md flex items-center transition-all hover:bg-gray-800"
                  onClick={() => navigate("/admin/users")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back to User List
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="p-6">
                <div className="bg-white rounded-lg shadow">
                  {/* User Profile Header */}
                  <div className="bg-gradient-to-r from-gray-200 via-gray-400 to-yellow-200 p-6 rounded-t-lg">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
                        {user.imageUrl ? (
                          <img src={user.imageUrl} alt={user.firstName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 text-2xl font-bold">
                            {user.firstName.charAt(0)}
                            {user.lastName ? user.lastName.charAt(0) : ''}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <h1 className="text-2xl font-bold montserrat-700">
                          {user.firstName} {user.lastName}
                        </h1>
                        <p className="text-gray-700 montserrat-500">{user.email}</p>
                        <div className="mt-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                              user.role === 'MANAGER' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                            }`}>
                            {user.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* User Details */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 montserrat-500">User ID</h3>
                        <p className="mt-1 text-gray-900 montserrat-500">{user.id}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 montserrat-500">Clerk User ID</h3>
                        <p className="mt-1 text-gray-900 montserrat-500">{user.clerkuserId}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 montserrat-500">Phone Number</h3>
                        <p className="mt-1 text-gray-900 montserrat-500">{user.phoneNumber || "Not provided"}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 montserrat-500">Account Created</h3>
                        <p className="mt-1 text-gray-900 montserrat-500">
                          {new Date(user.createdAt).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 montserrat-500">Last Updated</h3>
                        <p className="mt-1 text-gray-900 montserrat-500">
                          {new Date(user.updatedAt).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Enrolled Courses */}
                    <div className="mt-8">
                      <div className="flex  gap-6 items-center mb-4">
                        <h2 className="text-xl font-bold montserrat-700">Enrolled Courses</h2>
                        <button
                          onClick={() => setIsPanelOpen(true)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                          Give Access to a Course
                        </button>
                      </div>

                      {enrolledCourses.length === 0 ? (
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-yellow-700">
                          <p className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            This user is not enrolled in any courses yet.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {enrolledCourses.map((course) => (
                            <div
                              key={course.id}
                              className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => navigate(`/admin/course/${course.id}`)}
                            >
                              <div className="h-40 bg-gray-200 relative">
                                {course.imageUrl ? (
                                  <img
                                    src={course.imageUrl}
                                    alt={course.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                  </div>
                                )}
                                <div className="absolute top-2 right-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${course.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {course.published ? 'Published' : 'Draft'}
                                  </span>
                                </div>
                              </div>
                              <div className="p-4">
                                <h3 className="text-lg font-semibold mb-2 montserrat-600 line-clamp-1">{course.title}</h3>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-900 font-bold">₹{course.price}</span>
                                  <span className="text-xs text-gray-500">
                                    Enrolled: {new Date(course.enrolledAt).toLocaleDateString('en-GB')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Access Side Panel */}
      <div className={`fixed inset-y-0 right-0 w-96 bg-white shadow-lg transform ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50 overflow-hidden`}>
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h3 className="text-xl font-bold montserrat-700">Give Course Access</h3>
            <button
              onClick={() => {
                setIsPanelOpen(false);
                setSelectedCourse(null);
                setEnrollmentSuccess(false);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <p className="mb-6 text-gray-600">
              Select a course to give {user?.firstName} {user?.lastName} access to:
            </p>

            {courses.length === 0 ? (
              <div className="text-yellow-600 bg-yellow-50 p-4 rounded-md mb-6">
                <p className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  No available courses to enroll this user in.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mb-6">
                  <label htmlFor="course-select" className="block text-sm font-medium text-gray-700 mb-2">Available Courses</label>
                  <div className="relative">
                    <select
                      id="course-select"
                      className="w-full p-3 pl-4 pr-10 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 appearance-none transition-all"
                      value={selectedCourse || ""}
                      onChange={(e) => setSelectedCourse(Number(e.target.value))}
                    >
                      <option value="" className="text-gray-500">Select a course</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id} className="py-2">
                          {course.title}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-600">
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                {selectedCourse && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                    <h4 className="font-medium mb-2">Selected Course Details</h4>
                    <p className="text-sm text-gray-600 mb-1">
                      {courses.find(c => c.id === selectedCourse)?.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      Price: ₹{courses.find(c => c.id === selectedCourse)?.price.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {!enrollmentSuccess && (
            <div className="border-t px-6 py-4">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsPanelOpen(false);
                    setSelectedCourse(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGiveAccess}
                  disabled={!selectedCourse || isEnrolling}
                  className={`px-4 py-2 rounded-md text-white ${!selectedCourse || isEnrolling
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                  {isEnrolling ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Give Access"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>


    </div>
  );
};

const LoadingState = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="animate-pulse space-y-8 w-full max-w-4xl p-8">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-24 h-24 rounded-full bg-gray-200"></div>
        <div className="space-y-3 flex-1">
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mt-2"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 rounded"></div>
        ))}
      </div>

      <div className="h-8 bg-gray-200 rounded w-1/4 mt-8"></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  </div>
);

const ErrorState = ({ error }: { error: string }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
      <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-center mb-2 montserrat-700">Error Loading User</h2>
      <p className="text-gray-600 text-center mb-6">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
      <div className="flex items-center justify-center w-12 h-12 mx-auto bg-yellow-100 rounded-full mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-center mb-2 montserrat-700">User Not Found</h2>
      <p className="text-gray-600 text-center mb-6">The requested user could not be found or you don't have permission to view this user.</p>
      <button
        onClick={() => window.history.back()}
        className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
      >
        Go Back
      </button>
    </div>
  </div>
);

export default UserDetails;