import { BlogDbRow } from "../../domain/blog-sql-model.js"

export class BlogViewModel {
    id:string
    name: string
    description: string
    websiteUrl: string
    createdAt: Date
    isMembership: boolean

    static mapToView(
        blogDbRow: BlogDbRow
    ): BlogViewModel {
        const viewModel = new BlogViewModel()

        viewModel.id = blogDbRow.id.toString()
        viewModel.name = blogDbRow.name
        viewModel.description = blogDbRow.description
        viewModel.websiteUrl = blogDbRow.website_url
        viewModel.createdAt = blogDbRow.created_at
        viewModel.isMembership = blogDbRow.is_membership
        
        return viewModel
    }
}