import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function Home() {
  const [studentData, setstudentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  

  useEffect(() => {
    const init = async () => {
      // auth check
      axios.defaults.withCredentials=true
      try {
        const res = await axios.get('http://localhost:5000/home', { withCredentials: true });
        if (res.status !== 200) {
          navigate('/login');
          return;
        }
      } catch (error) {
        console.error('auth check failed', error);
        navigate('/login');
        return;
      }

      // fetch students
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/students');
         setstudentData(response.data || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch students', err);
        setstudentData([]);
        setError(err?.message || 'Failed to fetch students');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [id, navigate]);

  const handleLogOut = async () => {
    try {
      await axios.get('http://localhost:5000/logout', { withCredentials: true });

      setLoggingOut(true);

      setTimeout(() => {
        
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.log('user did not logout', error);
      
      navigate('/login');
    }
  };
  

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      await axios.delete(`http://localhost:5000/delete/${id}`);
      setstudentData(studentData.filter((student) => student.id !== id));
    }
  };

  return (
    <>
    <div className="w-full flex justify-end px-6 h-15 items-center bg-zinc-500">
      <div className="flex items-center gap-3">
        <button onClick={handleLogOut} disabled={loggingOut} className="bg-red-400 cursor-pointer hover:bg-zinc-400 text-amber-50 text-xl h-8 border-amber-400 px-2 rounded disabled:opacity-60">logout</button>
        {loggingOut && <span className="text-sm text-white">Logging out…</span>}
      </div>
    </div>
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-6 relative">
        {/* Create Button */}
        <Link
          to="/create"
          className="absolute top-6 right-6  bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg  font-medium shadow"
        >
          Create <span className="text-xl text-center ">+</span>
        </Link>

        <h1 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
          Student List
        </h1>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-100 text-gray-700 text-left">
                <th className="p-3 border-b">ID</th>
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Email</th>
                <th className="p-3 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="4" className="text-center p-4">
                    Loading...
                  </td>
                </tr>
              )}

              {error && (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-red-500">
                    {error}
                  </td>
                </tr>
              )}

              {Array.isArray(studentData) &&
                studentData.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-gray-50 transition duration-200"
                  >
                    <td className="p-3 border-b">{student.id}</td>
                    <td className="p-3 border-b">{student.name}</td>
                    <td className="p-3 border-b">{student.email}</td>
                    <td className="p-3 border-b flex justify-center gap-2">
                      <Link
                        to={`read/${student.id}`}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        Read
                      </Link>
                      <Link
                        to={`edit/${student.id}`}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

              {!loading &&
                !error &&
                Array.isArray(studentData) &&
                studentData.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center p-4 text-gray-500 italic"
                    >
                      No students found
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  );
}
