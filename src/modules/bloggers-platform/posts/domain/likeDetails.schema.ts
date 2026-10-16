import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    _id: false
})
export class LikeDetails {

    @Prop({
        type: Date
    })
    addedAt: Date


    @Prop({
        type: String
    })
    userId: string


    @Prop({
        type: String
    })
    login: string
}

export const LikeDetailsSchema = SchemaFactory.createForClass(LikeDetails)