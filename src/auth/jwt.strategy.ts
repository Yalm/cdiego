import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import configuration from '../config/configuration';
import { Payload } from './interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
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
