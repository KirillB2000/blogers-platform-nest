import { BlogDocument } from "../../domain/blogs.entity.js"

export class BlogViewModel {
    id:string
    name: string
    description: string
    websiteUrl: string
    createdAt: Date
    isMembership: boolean

    static mapToView(blogDoc: BlogDocument) {
        const viewModel = new BlogViewModel()

        viewModel.id = blogDoc._id.toString()
        viewModel.name = blogDoc.name
        viewModel.description = blogDoc.description
        viewModel.websiteUrl = blogDoc.websiteUrl
        viewModel.createdAt = blogDoc.createdAt
        viewModel.isMembership = blogDoc.isMembership
        
        return viewModel
    }
}