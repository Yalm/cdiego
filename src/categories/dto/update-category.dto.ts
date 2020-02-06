import { CreateCategoryDto } from "./create-category.dto";

export interface UpdateCategoryDto extends CreateCategoryDto {
    readonly categories?: string[];
}
