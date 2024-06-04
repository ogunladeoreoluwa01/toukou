import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"


  

const Demos = () => {
    return ( <>



    <main className=" flex items-center justify-center w-[100vw] h-[100vh]">



    <Card className="w-[270px]  ">
  <CardHeader>
    <CardTitle className="text-xl h-[50px] line-clamp-2">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Pariatur porro quia, numquam voluptates magnam non dignissimos nam esse aliquam tempore! Blanditiis, consequatur placeat. Numquam excepturi iste vitae sapiente facilis ab!</CardTitle>
    <CardDescription className="">Card Description</CardDescription>
  </CardHeader>
  <CardContent className="p-2">
  <img 
                    loading="lazy"
                    decoding="async"
                    fetchpriority="high"
                    className="w-full rounded-md" 
                    src="https://c4.wallpaperflare.com/wallpaper/39/346/426/digital-art-men-city-futuristic-night-hd-wallpaper-preview.jpg"
                    alt="testing"
                />

  </CardContent>
  <CardFooter>
  <CardDescription>Card Description</CardDescription>
  </CardFooter>
</Card>

    </main>
 
    
    
    
    
    
    
    </> );
}
 
export default Demos;