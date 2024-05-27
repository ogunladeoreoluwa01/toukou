import { useState } from 'react'
import NavBarComp from "./components/NavBar";
import SectionHeader from './components/SectionHeader';
import FeaturedPost from './components/FeaturedPost';
import NormalPost from './components/normalPost'
import Grid from './components/Grid'
import Footer from './components/footer';
import MakeaPost from './components/makeapost';
import ToAdminDash from './components/adminDashboardButton';
import NormalPostLoader from './components/loaders/normalPostLoader';
import FtPostLoader from './components/loaders/ftPostLoader';
function App() {


  return (
    <>
        <NavBarComp/>
        <main className=' mx-auto relative '>
          <section className='mb-6'>
          <SectionHeader/>
        <FeaturedPost/>
          </section>
          <div className='flex flex-col gap-4 my-6 '>
          <SectionHeader/>
          <div className='flex flex-wrap  justify-center items-center gap-4 md:gap-2'>
        <NormalPost/>
        <NormalPost/>
        <NormalPost/>
        <NormalPost/>
        <NormalPost/>
        <NormalPost/>
        <NormalPost/>
        <NormalPost/>
        <NormalPost/>
        <NormalPost/>
        
        </div>
          </div>
       
        <div className='my-6'>
          
        <Grid/>
        </div>


       

       
        <FtPostLoader/>
        <MakeaPost/>
        <ToAdminDash/>
        </main>
        
        <Footer/>
    </>
  )
}

export default App
