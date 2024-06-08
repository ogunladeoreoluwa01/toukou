import React, { useEffect } from 'react';
import BlogCard from '../components/BlogCard';
import { useInfiniteQuery } from '@tanstack/react-query';
import getPostData from "../services/index/postServices/getPostData";
import { Toaster, toast } from 'sonner';
import NormalPostLoader from '../components/loaders/normalPostLoader';
import { useInView } from 'react-intersection-observer';

const UserPostComponent = ({ authorId, username }) => {
  const {
    data,
    error,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    status,
  } = useInfiniteQuery({
    queryKey: ['posts', authorId],
    queryFn: ({ pageParam = 1 }) => getPostData({ authorId, pageParam }),
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (isError) {
      try {
      const errormsg = JSON.parse(error.message);
      console.error(`Error ${errormsg.errorCode}: ${errormsg.errorMessage}`);
      if (errormsg.errorCode === 403) {
        navigate("/error-403");
      } else if (errormsg.errorCode === 452) {
        navigate("/user-is-disabled");
      } else if (errormsg.errorCode === 451) {
        navigate("/user-is-ban");
      } else if (errormsg.errorCode === 500) {
        navigate("/oops");
      }
    } catch (parseError) {
      console.error("Error parsing error message:", parseError);
    }
    }

  let postIndex = 0; // To track the overall index of posts

  return (
    <>
      <section className='flex flex-col gap-3 my-4  w-full md:w-[90vw] '>
          <h1 className='text-xl font-bold border-b-2 py-2 md:py-4'>
            Blogs by {username} 
          </h1>
        <div className='w-full md:my-6 flex flex-wrap flex-col md:flex-row items-center justify-start gap-3'>
          {isFetching && !isFetchingNextPage ? (
            Array(10).fill(0).map((_, index) => <NormalPostLoader key={index} />)
          ) : (
            data?.pages.map((page, i) => (
              <React.Fragment key={i}>
                {page.posts.map((post, index) => {
                  postIndex += 1; // Increment the post index
                  const isRef = (postIndex % 10 === 8); // Add ref to every 8th, 18th, 28th, etc. post
                  return (
                    <BlogCard
                      key={post._id}
                      postUrl={`/blogview/${post._id}`}
                      currentUser={username}
                      authorUrl={`/user/${post.authorId}`}
                      authorName={post.authorName}
                      title={post?.title}
                      date={post.createdAt}
                      image={post.postImage.postImgUrl}
                      ref={isRef ? ref : null} // Conditionally add ref
                    />
                  );
                })}
              </React.Fragment>
            ))
          )}
        </div>
        <div className='flex justify-center mt-4'>
          <button
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
            className='disabled:opacity-70 flex gap-2 items-center transition-all duration-300 ease-linear bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded'
          >
            {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Load More' : 'Nothing more to load'}
          </button>
        </div>
        <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
      </section>
    </>
  );
};

export default UserPostComponent;
