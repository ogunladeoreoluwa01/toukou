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
          <div className='grid md:grid-cols-3 lg:grid-cols-5 auto-rows-auto justify-items-center grid-flow-row grid-cols-1  justify-center items-center gap-4'>
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
       
        </main>
        

    </>
  )
}

export default App
