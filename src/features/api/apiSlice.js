import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
    tagTypes: ['Post'],
    endpoints: builder => ({
        getPosts: builder.query({
            query: () => '/posts',
            providesTags: (result = [], _error, _arg) => [
                'Post',
                ...result.map(({ id }) => ({ type:'Post', id }))
            ]
        }),
        getPost: builder.query({
            query: postId => `/posts/${postId}`,
            providesTags: (_result, _error, arg) => [{ type: 'Post', id: arg }]
        }),
        addNewPost: builder.mutation({
            query: initialPost => ({
                url: '/posts',
                method: 'POST',
                body: initialPost
            }),
            invalidatesTags: ['Post']
        }),
        editPost: builder.mutation({
            query: post => ({
                url: `/posts/${post.id}`,
                method: 'PATCH',
                body: post
            }),
            invalidatesTags: (_result, _error, arg) => [{ type: 'Post', id: arg.id }]
        }),
        addReaction: builder.mutation({
            query: ({ postId, reaction }) => ({
                url: `posts/${postId}/reactions`,
                method: 'POST',
                body: { reaction }
            }),
            async onQueryStarted({ postId, reaction }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getPosts', undefined, (draft) => {
                        const post = draft.find(post => post.id === postId)
                        if (post) {
                            post.reactions[reaction]++
                        }
                    })
                )
                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                }
            }
        })
        // getUsers: builder.query({
        //     query: () => '/users'
        // })
    })
})

export const {
    useGetPostsQuery,
    useGetPostQuery,
    // useGetUsersQuery,
    useAddNewPostMutation,
    useEditPostMutation,
    useAddReactionMutation
} = apiSlice