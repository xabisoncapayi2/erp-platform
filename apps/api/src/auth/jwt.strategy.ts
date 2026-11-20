import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'dev-only-change-me',
    });
  }

  async validate(payload: any) {
    if (!payload || !payload.tenantId) {
      throw new UnauthorizedException('Invalid token payload: tenantId missing');
    }
    return {
      id: payload.sub,
      sub: payload.sub,
      email: payload.email,
      tenantId: payload.tenantId,
      role: payload.role || 'USER',
    };
  }
}
