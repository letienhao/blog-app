import React, { Fragment, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../store/Store";
import PostItem from "./PostItem";
import {
  BlogActions,
  deletePost,
  getPostList,
} from "../../store/sliceStore/SliceStore";
import SkeletonPost from "../skeletonPost/SkeletonPost";
const PostList = ({}) => {
  const postList = useSelector((item: RootState) => item.blog.postList);
  const loading = useSelector((item: RootState) => item.blog.loading);
  const dispatch = useAppDispatch();
  const handleDelete = (postId: string) => {
    dispatch(deletePost(postId));
  };
  const handleStartEditing = (postId: string) => {
    dispatch(BlogActions.editPost(postId));
  };
  useEffect(() => {
    const promise = dispatch(getPostList());
    return () => promise.abort();
  }, []);
  return (
    <div className="bg-white py-6 sm:py-8 lg:py-12">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="mb-10 md:mb-16">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
            Được Dev Blog
          </h2>
          <p className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg">
            Đừng bao giờ từ bỏ. Hôm nay khó khăn, ngày mai sẽ trở nên tồi tệ.
            Nhưng ngày mốt sẽ có nắng
          </p>
        </div>
        {loading && 
        <Fragment>
          <SkeletonPost/>
          <SkeletonPost/>
        </Fragment>
        }
        {!loading && (
          <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-2 xl:grid-cols-2 xl:gap-8">
            {postList.map((post) => (
              <PostItem
                post={post}
                key={post.id}
                handleDelete={handleDelete}
                handleStartEditing={handleStartEditing}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostList;
