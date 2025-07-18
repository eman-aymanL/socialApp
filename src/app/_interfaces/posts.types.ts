export type PostType={
    _id: string,
    createdAt: string,
    image?: string,
    body?: string
    comments?: CommentType[],
    user: UserType,
};

export type UserType ={
    _id: string,
    name :string,
    photo : string
}

export type CommentType={
    _id : string,
    content: string,
    commentCreator : UserType,
    post: string,
    createdAt: string
}