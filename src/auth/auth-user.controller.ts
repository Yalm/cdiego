import { Controller, Post, HttpCode, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignEmailPasswordDto, ResetPasswordDto } from './dto';
import { Token } from './interfaces/token.interface';
import { Request } from 'express';

@Controller('auth/user')
export class AuthUserController {

    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('login')
    create(@Body() signEmailPasswordDto: SignEmailPasswordDto): Promise<Token> {
        return this.authService.attemptUser(signEmailPasswordDto);
    }

    @Post('password/email')
    @HttpCode(204)
    sendPasswordResetEmail(@Req() req: Request, @Body() { email }: { email: string }): Promise<void> {
        return this.authService.sendResetEmail(email, { host: req.headers.origin as string });
    }

    @Post('password/reset')
    reset(@Body() resetPasswordDto: ResetPasswordDto): Promise<Token> {
        return this.authService.resetUser(resetPasswordDto);
    }
}
