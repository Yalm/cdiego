import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import configuration from 'src/config/configuration';
import { Payload } from '../interfaces';

@Injectable()
export class JwtUserStrategy extends PassportStrategy(Strategy, 'jwt-user') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configuration().auth.secret
        });
    }

    validate(payload: any): Payload {
        return {
            id: payload.sub,
            name: payload.name,
            avatar: payload.avatar,
            email: payload.email
        };
    }
}
