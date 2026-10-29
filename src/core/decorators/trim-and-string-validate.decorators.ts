import { applyDecorators } from "@nestjs/common"
import { Trim } from "./trim-transform.decorator.js"
import { IsString, Length } from "class-validator"

export const IsStringWithTrim = (minLength: number, maxLength: number) => 
    applyDecorators(IsString(), Length(minLength, maxLength) , Trim())
