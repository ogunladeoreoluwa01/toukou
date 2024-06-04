import { Skeleton } from "@/components/ui/skeleton"

const YourProfileSectionLoader = () => {
 

  return (
    <>
     
    <section>
      
      <div className='relative mb-5'>
          <Skeleton className="h-4 w-[55px] z-50 absolute right-1 top-2" />
       
       <Skeleton className="h-[125px] md:h-[180px] lg:h-[250px] w-full" />
          <Skeleton className="h-[100px] w-[100px] md:h-[160px] md:w-[160px] absolute -bottom-10 md:-bottom-20 left-2 md:left-5 rounded-full" />
       
      </div>
      <div className='flex flex-col gap-1 mt-12 pb-2 md:pb-5 md:mt-24 md:pl-7 border-b'>
        <div className='flex justify-between items-center'>
          <span className='flex gap-3'>
            <Skeleton className="h-4 w-[250px] " />
          </span>
         
        </div>
        <Skeleton className="h-4 w-[150px] " />
        <Skeleton className="h-4 w-[50px] my-2 " />
       <span className="flex flex-col gap-1">
         <Skeleton className="h-4 w-[90%]  " />
          <Skeleton className="h-4 w-[90%]  " />
           <Skeleton className="h-4 w-[85%] " />
            <Skeleton className="h-4 w-[85%]  " />
             <Skeleton className="h-4 w-[80%]  " />
              <Skeleton className="h-4 w-[70%]  " />
       </span>
       
      </div>
    </section>
    </>
  );
};

export default YourProfileSectionLoader;
