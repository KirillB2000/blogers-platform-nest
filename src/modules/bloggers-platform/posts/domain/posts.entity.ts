import { Schema } from "@nestjs/mongoose";

@Schema({timestamps: true})
export class Post {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string

    createdAt: string
    updatedAt: string

    // extendedLikesInfo: ExtendedLikesInfoDb ===> Without myStatus

    static createInstance() { //TODO: add dto to function param with CreatePostDomainDto type
        //TODO: add instance creation
    }
}