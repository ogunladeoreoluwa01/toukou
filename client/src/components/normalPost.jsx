import React from 'react';
import { Link } from 'react-router-dom';

// Array of dummy images
const dummyImages = [
    "https://c4.wallpaperflare.com/wallpaper/39/346/426/digital-art-men-city-futuristic-night-hd-wallpaper-preview.jpg",
    "https://c4.wallpaperflare.com/wallpaper/843/56/876/night-artwork-futuristic-city-cyberpunk-wallpaper-preview.jpg",
    "https://c4.wallpaperflare.com/wallpaper/455/360/900/night-artwork-futuristic-city-cyberpunk-wallpaper-preview.jpg",
    "https://c4.wallpaperflare.com/wallpaper/944/587/750/artwork-futuristic-city-science-fiction-digital-art-wallpaper-preview.jpg"
];

// Function to get a random image from the array
const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * dummyImages.length);
    return dummyImages[randomIndex];
}

const FeaturedPost = ({ 
    postUrl = "/post", 
    authorUrl = "/author", 
    authorName = "author", 
    authorRole ="",
    title = "Designers who changed the web is in the air", 
    time = "July 28, 2022 · 6 min read",
    image = getRandomImage(),
    dynamicClass="hover:rotate-[.5deg]"
}) => {
    return ( 
        <Link to={postUrl} className={`flex  md:flex-col md:justify-around w-screen md:h-[345px] md:w-[260px]  transition-all duration-300 ease-linear rounded-lg md:p-0 m-0 h-[170px] hover:-translate-y-2 ${dynamicClass}`}>
            <div>
                <img className="md:h-[180px] h-[170px] max-w-[170px] md:max-w-full  rounded-t-lg md:w-full object-cover" src={image} alt={image} />
            </div>
            <div className="p-3 md:p-4 flex flex-col w-[70%] gap-2 md:gap-0 md:w-full bg-slate-300  dark:bg-slate-600 rounded-b-lg">
                <span className="flex justify-between">
                <Link to={authorUrl} className="bg-slate-400 w-fit text-[0.75rem] md:text-sm px-2  md:px-3 rounded-md font-bold capitalize text-slate-700">
                    {authorName}
                </Link>
                {authorRole && (
  <span  className="bg-slate-400 w-fit text-[0.65rem] md:text-sm px-2 md:px-3 rounded-md font-bold capitalize text-slate-700">
    {authorRole}
  </span>
)}
                </span>
               
                <h1 className="md:w-full sm:text-lg text-xl leading-5 md:text-2xl h-[100px] md:h-[100px] font-medium text-ellipsis line-clamp-4 whitespace-normal">
                    {title}
                </h1>
                <p className="font-bold text-slate-500 dark:text-slate-400 text-xs">
                    {time}
                </p>
            </div>
        </Link>
    );
}

export default FeaturedPost;
