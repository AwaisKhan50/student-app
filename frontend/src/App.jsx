import React from 'react'
import { Routes, Route} from 'react-router-dom'
import Home from './Home'
import Create from './Create'
import Read from './Read'
import Edit from './Edit'
import Register from './Register'
import Login from './Login'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => {
   
 
  return (
    <div>
  <Routes>
   <Route path='/login' element={<Login/>}/>
   <Route path='/register' element={<Register/>}/>

   {/* Protected routes - require login */}
   <Route path='/' element={<ProtectedRoute><Home/></ProtectedRoute>} />
   <Route path='/create' element={<ProtectedRoute><Create/></ProtectedRoute>} />
   <Route path='/read/:id' element={<ProtectedRoute><Read/></ProtectedRoute>} />
   <Route path='/edit/:id' element={<ProtectedRoute><Edit/></ProtectedRoute>} />
  </Routes>
    </div>
  )
}

export default App