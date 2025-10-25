import React, { useState } from 'react';
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
export default function Register() {
  const [values, setvalues] = useState({username:"",email:"",password:""})
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const handleChanges = (e) => {
    setvalues({...values, [e.target.name]:e.target.value})
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    // basic client-side validation
    if (!values.username || !values.email || !values.password) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    setError("");
    try{
      const response= await axios.post('http://localhost:5000/register', values)
      console.log(response.data);
      // reset form only after successful registration
      setvalues({username:"", email:"" , password: ""})
      navigate('/login');  
    }catch(err){
      console.log(err);
      // show a friendly error if available
      if (err?.response?.data?.message) setError(err.response.data.message);
      else setError('Registration failed. Check server logs.');
    } finally {
      setLoading(false);
    }

      
  };

  return (
    <div className="min-h-screen bg-gradient-to-br  from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className=" bg-white rounded-lg shadow-2xl shadow-black  p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome</h1>
          <p className="text-gray-600">Sign up your account</p>
        </div>
        <form action="" onSubmit={handleSubmit}>

        <div className="space-y-6">
          {error && (
            <div className="p-2 bg-red-100 text-red-700 rounded mb-2">{error}</div>
          )}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              username
            </label>
            <input
            name='username'
              type="text"
              id="username"
              onChange={handleChanges}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
            name='email'
              type="email"
              id="email"
              onChange={handleChanges}
             
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name='password'
              
              onChange={handleChanges}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              placeholder="Enter your password"
            />
          </div>

          

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >{loading ? 'Registering...' : 'Sign Up'}
          </button>
        </div>
        </form>
        

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            
          </div>

          
        </div>

        <p className="mt-8 text-center text-sm text-gray-600">
          already have an account?{' '}
          <Link to={'/login'}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}