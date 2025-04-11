import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSideber from './LeftSideber'

const MainLayout = () => {
  return (
    <div className='flex'>
        <LeftSideber/>
            <Outlet/>       
    </div>
  )
}

export default MainLayout