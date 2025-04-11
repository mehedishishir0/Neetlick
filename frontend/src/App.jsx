import React from 'react'
import Signup from './components/Signup'
import axios from 'axios'
axios.defaults.withCredentials = true
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import Login from './components/Login'
import MainLayout from './components/MainLayout'
import Home from './components/Home'
import Profile from './components/Profile'

const browserRouter =  createBrowserRouter([
  {
    path:"/",
    element:<MainLayout/>,
    children:[
      {
        path:'/',
        element:<Home/>
      },
      {
        path:'/profile',
        element:<Profile/>
      }
    ]
  },
  {
    path:'/signup',
    element:<Signup/>
  },
  {
    path:'/login',
    element:<Login/>
  }
  
]) 

const App = () => {
  return (
    <>
    <RouterProvider router={browserRouter}/>
    </>
  )
}

export default App