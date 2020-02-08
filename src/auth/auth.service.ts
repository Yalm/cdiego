import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hashSync } from 'bcryptjs';
import { SignEmailPasswordDto, ValidationTokenDto, ResetPasswordDto } from './dto';
import { Token } from './interfaces';
import { randomBytes } from 'crypto';
import { SendGridService } from "@anchan828/nest-sendgrid";
import { reset, verification } from './views/emails';
import { CustomersService } from 'src/customers/customers.service';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordResetRepository } from './password-reset.repository';
import { Repository, Raw } from 'typeorm';
import { PasswordReset } from './entities/password-reset.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly customersService: CustomersService,
        private readonly jwtService: JwtService,
        private readonly sendGrid: SendGridService,
        @InjectRepository(PasswordResetRepository)
        private readonly passwordResetRepository: Repository<PasswordReset>
    ) { }

    private async validate<T>(
        guard: T,
        password: string,
        options?: { verifyEmail: boolean }): Promise<T> {
        if (guard && compareSync(password, guard['password'])) {
            if (options && options.verifyEmail && !guard['emailVerifiedAt']) {
                throw new HttpException({ code: 'auth/user-not-verified-email' }, HttpStatus.UNPROCESSABLE_ENTITY);
            }
            return guard;
        }
        return null;
    }

    async attemptUser({ email, password }: SignEmailPasswordDto, options?: { verifyEmail: boolean }): Promise<Token> {
        const guard = await this.usersService.findByEmail(email);
        const entity = await this.validate(guard, password, options);
        if (entity) {
            return this.respondWithToken(entity);
        }
        throw new HttpException({ code: 'auth/user-not-found' }, HttpStatus.UNAUTHORIZED);
    }

    async attempt({ email, password }: SignEmailPasswordDto, options?: { verifyEmail: boolean }): Promise<Token> {
        const guard = await this.customersService.findByEmail(email);
        const entity = await this.validate(guard, password, options);
        if (entity) {
            return this.respondWithToken(entity);
        }
        throw new HttpException({ code: 'auth/user-not-found' }, HttpStatus.UNAUTHORIZED);
    }

    async sendVerificationEmail(email: string, options: { name?: string, host: string, from?: string }): Promise<void> {
        // Create a verification token for this user
        const { token } = await this.passwordResetRepository.save({
            token: randomBytes(16).toString('hex'),
            email,
            expireAt: new Date(new Date().getTime() + 300000)
        });

        await this.sendGrid.send({
            from: options.from || `no-reply@comercialdiego.com`,
            to: email,
            subject: 'Verifica tu dirección de correo electrónico',
            html: verification({ host: options.host, token, name: options.name })
        });
    }

    async confirmation(validationTokenDto: ValidationTokenDto): Promise<void> {
        const token = await this.validateToken(validationTokenDto);
        await this.customersService.updateOne({ email: token.email }, {
            emailVerifiedAt: new Date()
        });
    }

    async sendResetEmail(email: string, options: { host: string, from?: string }): Promise<void> {
        const { token } = await this.passwordResetRepository.save({
            token: randomBytes(16).toString('hex'),
            email,
            expireAt: new Date(new Date().getTime() + 300000)
        });

        await this.sendGrid.send({
            from: options.from || `no-reply@comercialdiego.com`,
            to: email,
            subject: 'Cambia la contraseña',
            html: reset({ email, host: options.host, token })
        });
    }

    async resetUser(resetPasswordDto: ResetPasswordDto): Promise<Token> {
        await this.validateToken({ token: resetPasswordDto.token, email: resetPasswordDto.email });
        await this.usersService.updateOne({ email: resetPasswordDto.email }, {
            password: hashSync(resetPasswordDto.password)
        });
        const user = await this.usersService.findByEmail(resetPasswordDto.email);
        return this.respondWithToken(user);
    }

    async reset(resetPasswordDto: ResetPasswordDto): Promise<Token> {
        await this.validateToken({ token: resetPasswordDto.token, email: resetPasswordDto.email });
        await this.customersService.updateOne({ email: resetPasswordDto.email }, {
            password: hashSync(resetPasswordDto.password)
        });
        const customer = await this.customersService.findByEmail(resetPasswordDto.email);
        return this.respondWithToken(customer);
    }

    private async validateToken(validationTokenDto: ValidationTokenDto): Promise<PasswordReset> {
        const token = await this.passwordResetRepository.findOne({
            where: { ...validationTokenDto, expireAt: Raw(alias => `${alias} > NOW()`) }
        });

        if (!token) {
            throw new HttpException('We were unable to find a valid token. Your token my have expired.',
                HttpStatus.NOT_FOUND);
        }
        await this.passwordResetRepository.delete(token.id);
        return token;
    }

    private respondWithToken({ id, name, avatar }: any): Token {
        return {
            access_token: this.jwtService.sign({ sub: id, name, avatar })
        };
    }
}
