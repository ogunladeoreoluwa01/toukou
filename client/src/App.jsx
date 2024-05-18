import { useState } from 'react'
import NavBarComp from "./components/NavBar";
import SectionHeader from './components/SectionHeader';
import FeaturedPost from './components/FeaturedPost';
import NormalPost from './components/normalPost'
import Grid from './components/Grid'

function App() {


  return (
    <>
        <NavBarComp/>
        <main className=' mx-auto '>
          <section className='mb-6'>
          <SectionHeader/>
        <FeaturedPost/>
          </section>
          <div className='flex flex-col gap-4 my-6'>
          <SectionHeader/>
          <div className='flex flex-wrap justify-center items-center gap-5'>
        <NormalPost/>
        <NormalPost/>
        <NormalPost/>
        <NormalPost/>
        </div>
          </div>
       
        <div className='my-6'>
          
        <Grid/>
        </div>
       
        </main>
        

    </>
  )
}

export default App
