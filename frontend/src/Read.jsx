import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Read() {
  const { id } = useParams(); // Get student ID from URL
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/read/${id}`);
        setStudent(response.data);
      } catch (error) {
        console.error("Error fetching student:", error);
        alert("Failed to load student details.");
      }
    };

    fetchStudent();
  }, [id]);

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600">
        Loading student details...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
          Student Details
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-500 font-medium">ID</label>
            <p className="text-gray-800">{student.id}</p>
          </div>

          <div>
            <label className="block text-gray-500 font-medium">Name</label>
            <p className="text-gray-800">{student.name}</p>
          </div>

          <div>
            <label className="block text-gray-500 font-medium">Email</label>
            <p className="text-gray-800">{student.email}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => navigate("/")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            Back to Home
          </button>

          <button
            onClick={() => navigate(`/edit/${student.id}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
