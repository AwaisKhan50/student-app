import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Edit() {
    const navigate=useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
const {id} = useParams()

  useEffect(() => {
    const fetchStudent = async () => {
      if (!id) return;
      try {
        const res = await axios.get(`http://localhost:5000/read/${id}`);
        if (res && res.data) setFormData(res.data);
      } catch (error) {
        console.error("Error fetching student:", error);
      }
    };

    fetchStudent();
    }, [id])
    
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      alert("Please fill out all fields.");
      return;
    }
    
    try {
      const res = await axios.put(`http://localhost:5000/edit/${id}`, {
        name: formData.name,
        email: formData.email,
      });

      if (res && (res.status === 200 || res.status === 204)) {
        // navigate back to home after successful update
        navigate('/');
      } else {
        alert('Update may have failed');
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update student.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
          Update Student
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter student name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter student email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition duration-200"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
}
