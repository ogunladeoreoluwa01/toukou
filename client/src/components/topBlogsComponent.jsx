import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useInView } from 'react-intersection-observer';
import topBlogs from '@/services/index/postServices/getTopBlogs'
import BlogCard from './BlogCard';
import NormalPostLoader from './loaders/normalPostLoader';


const TopBlogsComponent = () => {
  const user = useSelector(state => state.user);
  const navigate = useNavigate();
  const { ref, inView } = useInView();

  const { data, error, isError, isFetching, status } = useQuery({
    queryKey: ['post'],
    queryFn: () => topBlogs(),
    staleTime: 5 * 60 * 1000, // Cache the data for 5 minutes
  });

  useEffect(() => {
    if (status === 'loading') {
      toast.warning("Loading...");
    }
  }, [status]);

  useEffect(() => {
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
  }, [isError, error, navigate]);

  return (
    <>
      <section className='flex flex-col gap-3  w-full md:w-full '>
        <div className='w-full flex-col lg:px-14 md:px-6  md:flex-row lg:my-6 flex flex-wrap items-center justify-start md:justify-center lg:justify-start gap-3 lg:gap-5'>
          {isFetching ? (
            Array(10).fill(0).map((_, index) => <NormalPostLoader key={index} />)
          ) : (
            data?.posts.map((post, index) => (
              <BlogCard
                key={post._id}
                postUrl={`/blogview/${post._id}`}
                currentUser={user?.userInfo?.username ||"no user logged in"}
                authorUrl={`/user/${post.authorId}`}
                authorName={post.authorName}
                title={post.title}
                date={post.createdAt}
                image={post.postImage.postImgUrl}
                ref={index === 9 ? ref : null} // Add ref to the last post for future reference
              />
            ))
          )}
        </div>
      </section>

    </>
  );
};

export default TopBlogsComponent;
