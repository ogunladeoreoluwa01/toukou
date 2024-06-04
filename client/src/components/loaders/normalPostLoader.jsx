import { Skeleton } from "@/components/ui/skeleton"


const NormalPostLoader = () => {
    return ( <>
 <div className="flex flex-col space-y-3 w-[270px] h-[326px] p-2">
<div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[50px]" />
      </div>
 
<Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
       
        <Skeleton className="h-4 w-[250px]" />
        
        <Skeleton className="h-4 w-[250px]" />
         <Skeleton className="h-4 w-[200px]" />
      </div>




 </div>
    </> );
}
 
export default NormalPostLoader;