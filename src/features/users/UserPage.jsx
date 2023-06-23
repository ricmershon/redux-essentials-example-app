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
        return createSelector(
            result => result.data,
            (_result, userId) => userId,
            (data, userId) => data?.filter(post => post.user === userId) ?? emptyArray
        )
    }, [])
    

    const { postsForUser } = useGetPostsQuery(undefined, {
        selectFromResult: result => ({
            ...result,
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