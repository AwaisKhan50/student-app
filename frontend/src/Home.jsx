import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

// Set axios defaults once (keeps component clean and prevents reassigning on every render)
axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

export default function Home() {
  const [studentData, setstudentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [name, setname] = useState("")
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [email, setemail] = useState("")
  const { id } = useParams();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/students",{
          params: { name:search }
        });
        if (!mounted) return;
        // Expecting an array of students from the protected endpoint
        setstudentData(response.data || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch /students", err?.message || err);
        if (!mounted) return;
        setstudentData([]);
        setError(err?.message || "Failed to fetch students");
      } finally {
        if (mounted) setLoading(false);
      }

      (async () => {
        try {
          const res = await axios.get("/home");
          if (res.status !== 200) {
            navigate("/login");
            return;
          }

          const username =
            
            res?.data?.userData?.username ||
            "";
          setname(username);
          setemail(res?.data?.email || "");
          console.log("auth check:", res.data);
        } catch (e) {
          console.debug("auth check (non-blocking) failed", e?.message || e);
        }
      })();
    };

    init();

    return () => {
      mounted = false;
    };
  }, [id, navigate,search]);

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
    <div className="w-full flex justify-between px-6 h-15 items-center bg-zinc-500">
      <h1>Welcome, {name}!</h1>
      <h2>your email is {email}</h2>
      <div className="flex items-center gap-3">
        <button onClick={handleLogOut} disabled={loggingOut} className="bg-red-400 cursor-pointer hover:bg-zinc-400 text-amber-50 text-xl h-8 border-amber-400 px-2 rounded disabled:opacity-60">logout</button>
        {loggingOut && <span className="text-sm text-white">Logging out…</span>}
      </div>
    </div>

    <div className="w-full h-20 flex justify-between items-center">
      <input className="mx-auto mt-4 p-2 border border-gray-300 rounded-lg w-1/3"
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
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
