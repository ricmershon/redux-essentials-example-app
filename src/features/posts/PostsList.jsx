import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { fetchPosts } from './postsApi'
import { selectPostIds } from './postsSlice'
import { PostExcerpt } from './PostExcerpt'
import { Spinner } from '../../components/Spinner'

export const PostsList = () => {
    const dispatch = useDispatch();
    const orderedPostIds = useSelector(selectPostIds)
    const postStatus = useSelector(state => state.posts.status)

    useEffect(() => {
        if (postStatus === 'idle') {
            dispatch(fetchPosts())
        }
    }, [dispatch, postStatus])

    let content;

    if (postStatus === 'loading') {
        content = <Spinner text="Loading" />
    } else if (postStatus === 'succeeded') {
        content = orderedPostIds.map(postId => (
            <PostExcerpt key={postId} postId={postId} />
        ))
    }

    return (
        <section className="posts-list">
            <h2>Posts</h2>
            {content}
        </section>
    )
}