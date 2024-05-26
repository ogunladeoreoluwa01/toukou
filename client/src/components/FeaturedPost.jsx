import React from 'react';
import { Link } from 'react-router-dom';

const dummyImages = [
    "https://c4.wallpaperflare.com/wallpaper/39/346/426/digital-art-men-city-futuristic-night-hd-wallpaper-preview.jpg",
    "https://c4.wallpaperflare.com/wallpaper/843/56/876/night-artwork-futuristic-city-cyberpunk-wallpaper-preview.jpg",
    "https://c4.wallpaperflare.com/wallpaper/455/360/900/night-artwork-futuristic-city-cyberpunk-wallpaper-preview.jpg",
    "https://c4.wallpaperflare.com/wallpaper/944/587/750/artwork-futuristic-city-science-fiction-digital-art-wallpaper-preview.jpg"
];

const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * dummyImages.length);
    return dummyImages[randomIndex];
}

const FeaturedPost = ({ 
    postUrl = "/post", 
    authorUrl = "/author", 
    authorName = "default author name", 
    title = "Designers who changed the web is in the air", 
    time = "July 28, 2022 · 6 min read",
    image = getRandomImage()
}) => {
    
    return (
        <div className="featured-post">
            <Link to={postUrl} className="flex flex-col justify-around h-[430px] md:h-[200px] hover:scale-[1.01] hover:rotate-[-0.2deg] transition-all duration-300 ease-linear w-full rounded-lg md:justify-between md:flex-row">
                <div className="p-3 md:p-6 flex flex-col gap-2 md:max-w-[30vw] bg-slate-300 dark:bg-slate-600 md:rounded-l-lg rounded-t-lg">
                    
                    <Link to={authorUrl} className="bg-slate-400 w-fit px-3 rounded-md font-bold md:font-semibold capitalize text-slate-700 scale-90">
                        {authorName}
                    </Link>
                    <h1 className="w-full text-3xl md:text-3xl md:h-[130px] h-[140px] font-medium text-ellipsis line-clamp-3 whitespace-normal">
                        {title}
                    </h1>
                    <p className="font-bold text-slate-500 dark:text-slate-400 md:text-sm">
                        {time}
                    </p>
                </div>
                <div className="">
                    <img    
                        loading="lazy"
                        decoding='async'
                        fetchpriority='high' className="h-[200px] md:h-[198px] md:w-[70vw] rounded-b-lg md:rounded-br-lg md:rounded-tr-lg md:rounded-tl-none md:rounded-bl-none w-full object-cover" src={image} alt={image} />
                </div>
            </Link>
        </div>
    );
}

export default FeaturedPost;
