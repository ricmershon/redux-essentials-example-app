import React, { useMemo } from 'react'
import { createSelector } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { selectUserById } from '../users/usersSlice'
import { useGetPostsQuery } from '../api/apiSlice'

export const UserPage = ({ match }) => {
    const { userId } = match.params

    const user = useSelector(state => selectUserById(state, userId))

    const selectPostsForUser = useMemo(() => {
        const emptyArray = []
        // Return a unique selector instance for this page so that
        // the filtered results are correctly memoized
        return createSelector(
            result => result.data,
            (_result, userId) => userId,
            (data, userId) => data?.filter(post => post.user === userId) ?? emptyArray
        )
    }, [])
    

  // Use the same posts query, but extract only part of its data
    const { postsForUser } = useGetPostsQuery(undefined, {
        selectFromResult: result => ({
            // We can optionally include the other metadata fields from the result here
            ...result,
            // Include a field called `postsForUser` in the hook result object,
            // which will be a filtered list of posts
            postsForUser: selectPostsForUser(result, userId)
        })
    })

    const postTitles = postsForUser.map(post => (
        <li key={post.id}>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
        </li>
    ))

    return (
        <section>
            <h2>{user.name}</h2>
            <ul>{postTitles}</ul>
        </section>
    )
}