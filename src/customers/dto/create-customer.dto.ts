export interface CreateCustomerDto {
    readonly name: string;
    readonly surnames?: string;
    readonly email: string;
    readonly return?: string;
    readonly emailVerifiedAt?: Date;
    password?: string;
}
