import { ValidationTokenDto } from "./validation-token.dto";

export interface ResetPasswordDto extends ValidationTokenDto {
    readonly password: string;
}
