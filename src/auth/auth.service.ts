import { Injectable, HttpStatus, HttpException, HttpService } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hashSync } from 'bcryptjs';
import { SignEmailPasswordDto, ValidationTokenDto, ResetPasswordDto } from './dto';
import { Token } from './interfaces';
import { randomBytes } from 'crypto';
import { SendGridService } from "@anchan828/nest-sendgrid";
import { reset } from './views/emails';
import { CustomersService } from 'src/customers/customers.service';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordResetRepository } from './password-reset.repository';
import { Repository, Raw } from 'typeorm';
import { PasswordReset } from './entities/password-reset.entity';
import { UsersService } from 'src/users/users.service';
import { switchMap, map } from 'rxjs/operators';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly httpService: HttpService,
        private readonly customersService: CustomersService,
        private readonly jwtService: JwtService,
        private readonly sendGrid: SendGridService,
        @InjectRepository(PasswordResetRepository)
        private readonly passwordResetRepository: Repository<PasswordReset>
    ) { }

    private async validate<T>(
        guard: T,
        password: string,
        options?: { verifyEmail?: boolean }): Promise<T> {
        if (guard && compareSync(password, guard['password'])) {
            if (options && options.verifyEmail && !guard['emailVerifiedAt']) {
                throw new HttpException({ code: 'auth/user-not-verified-email' }, HttpStatus.UNPROCESSABLE_ENTITY);
            }
            return guard;
        }
        return null;
    }

    async attemptUser({ email, password }: SignEmailPasswordDto, options?: { provider: boolean }): Promise<Token> {
        const guard = await this.usersService.findByEmail(email);
        const entity = await this.validate(guard, password);
        if (entity) {
            return this.respondWithToken(entity);
        }
        throw new HttpException({ code: 'auth/user-not-found' }, HttpStatus.UNAUTHORIZED);
    }

    async attempt({ email, password, name }: SignEmailPasswordDto, options?: { verifyEmail?: boolean, provider?: boolean }): Promise<Token> {
        let guard = await this.customersService.findByEmail(email);
        if (!guard && options && !options.provider) {
            throw new HttpException({ code: 'auth/user-not-found' }, HttpStatus.UNAUTHORIZED);
        } else if (!guard && options && options.provider) {
            guard = await this.customersService.store({ email, name });
        }

        const entity = options.provider ? guard : await this.validate(guard, password, options);
        if (entity || options && options.provider) {
            return this.respondWithToken(entity);
        }
        throw new HttpException({ code: 'auth/user-not-found' }, HttpStatus.UNAUTHORIZED);
    }

    async sendVerificationEmail(email: string, options: { name?: string, host: string, from?: string, return?: string }): Promise<void> {
        // Create a verification token for this user
        const { token } = await this.passwordResetRepository.save({
            token: randomBytes(16).toString('hex'),
            email,
            expireAt: new Date(new Date().getTime() + 300000)
        });

        await this.sendGrid.send({
            from: options.from || `no-reply@comercialdiego.com`,
            to: email,
            templateId: 'd-8cd6a61b0e0e45ab96f47ab5a73e8caf',
            dynamicTemplateData: {
                name: options.name,
                url: `${options.host}/email/verify/${token}${options.return ? `?return=${options.return}` : ''}`
            }
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

    private respondWithToken({ id, name, avatar, email }: any): Token {
        return {
            access_token: this.jwtService.sign({ sub: id, name, avatar, email })
        };
    }

    loginByGoogle({ redirect_uri, code }: { redirect_uri: string, code: string }): Promise<{ email: string }> {
        return this.httpService.post('https://www.googleapis.com/oauth2/v4/token', {
            code, redirect_uri,
            client_id: '230642192836-5763ibgi0827ssim1oidilrse4gp98a3.apps.googleusercontent.com',
            client_secret: 'PiH1xM433Mkllxo3UnG9DdUj',
            grant_type: 'authorization_code'
        }).pipe(switchMap(({ data }) => {
            return this.httpService.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${data.access_token}` }
            }).pipe(map(({ data }) => data))
        })).toPromise();
    }
}
