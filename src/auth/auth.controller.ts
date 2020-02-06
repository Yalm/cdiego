import { Controller, Post, HttpCode, Body, Req, UseGuards, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignEmailPasswordDto, ValidationTokenDto, ResetPasswordDto } from './dto';
import { Token } from './interfaces/token.interface';
import { Request } from 'express';
import { CustomersService } from 'src/customers/customers.service';
import { CreateCustomerDto } from 'src/customers/dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './decorators/user.decorator';
import { Payload } from './interfaces';
import { Customer } from 'src/customers/entities/customer.entity';
import { FindOneOptions } from 'typeorm';

@Controller('auth/customer')
export class AuthController {

    constructor(
        private readonly customersService: CustomersService,
        private readonly authService: AuthService
    ) { }

    @Post('login')
    create(@Body() signEmailPasswordDto: SignEmailPasswordDto): Promise<Token> {
        return this.authService.attempt(signEmailPasswordDto, { verifyEmail: true });
    }

    @Post('register')
    @HttpCode(204)
    async store(@Req() req: Request, @Body() createCustomerDto: CreateCustomerDto): Promise<void> {
        const customer = await this.customersService.store(createCustomerDto);
        await this.authService.sendVerificationEmail(customer.email, { name: customer.name, host: req.headers.origin as string });
    }

    @Post('password/email')
    @HttpCode(204)
    sendPasswordResetEmail(@Req() req: Request, @Body() { email }: { email: string }): Promise<void> {
        return this.authService.sendResetEmail(email, { host: req.headers.origin as string });
    }

    @Post('customer/password/reset')
    reset(@Body() resetPasswordDto: ResetPasswordDto): Promise<Token> {
        return this.authService.reset(resetPasswordDto);
    }

    @Post('send-email-verify')
    @HttpCode(204)
    sendEmailVerify(@Req() req: Request, @Body() { email }: { email: string }): Promise<void> {
        return this.authService.sendVerificationEmail(email, { host: req.headers.origin as string });
    }

    @Post('verify')
    @HttpCode(204)
    confirmation(@Body() validationTokenDto: ValidationTokenDto): Promise<void> {
        return this.authService.confirmation(validationTokenDto);
    }

    @UseGuards(AuthGuard())
    @Get('me')
    me(@User() { id }: Payload, @Query() query: FindOneOptions<Customer>): Promise<Customer> {
        return this.customersService.show(id, query);
    }

    @UseGuards(AuthGuard())
    @Get('complete')
    async complete(@User() { id }: Payload): Promise<boolean> {
        const customer = await this.customersService.show(id);
        return customer && customer.surnames && customer.phone ? true : false;
    }
}
