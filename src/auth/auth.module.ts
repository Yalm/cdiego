import { Module, HttpModule } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CustomersModule } from '../customers/customers.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { SendGridModule } from "@anchan828/nest-sendgrid";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordReset } from './entities/password-reset.entity';
import { PasswordResetRepository } from './password-reset.repository';
import { UsersModule } from 'src/users/users.module';
import { AuthUserController } from './auth-user.controller';
import { JwtUserStrategy, JwtStrategy } from './strategies';

@Module({
    imports: [
        CustomersModule,
        UsersModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('APP_KEY'),
                signOptions: { expiresIn: '7d' }
            }),
            inject: [ConfigService]
        }),
        SendGridModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                apikey: configService.get('SENDGRID_API_KEY')
            }),
            inject: [ConfigService]
        }),
        HttpModule,
        TypeOrmModule.forFeature([PasswordReset, PasswordResetRepository])
    ],
    providers: [AuthService, JwtStrategy, JwtUserStrategy],
    controllers: [AuthController, AuthUserController],
    exports: [AuthService]
})
export class AuthModule { }
