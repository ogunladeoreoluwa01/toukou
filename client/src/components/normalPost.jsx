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
    title = "Designers who changed the web is in the air", 
    time = "July 28, 2022 · 6 min read",
    image = getRandomImage(),
    dynamicClass="hover:rotate-[2.5deg]"
}) => {
    return ( 
        <Link to={postUrl} className={`flex flex-col justify-around h-[345px] w-[260px]  transition-all duration-300 ease-linear rounded-lg md:p-0 m-0 hover:-translate-y-2 ${dynamicClass}`}>
            <div>
                <img className="h-[180px] rounded-t-lg w-full object-cover" src={image} alt={image} />
            </div>
            <div className="p-3 md:p-4 flex flex-col gap-2 md:gap-0 w-full bg-slate-300 dark:bg-slate-600 rounded-b-lg">
                <Link to={authorUrl} className="bg-slate-400 w-fit text-sm px-3 rounded-md font-bold capitalize text-slate-700">
                    {authorName}
                </Link>
                <h1 className="w-full text-2xl h-[90px] md:h-[100px] font-medium text-ellipsis line-clamp-3 whitespace-normal">
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
