import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Optional,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountService } from '../account/account.service';
import { TokenBlacklistService } from './token-blacklist.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Optional() private readonly jwtService?: JwtService,
    @Optional() private readonly accountService?: AccountService,
    @Optional() private readonly tokenBlacklist?: TokenBlacklistService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!this.jwtService || !this.accountService || !this.tokenBlacklist) {
      throw new UnauthorizedException('Unauthorized');
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Unauthorized');
    }

    const token = authHeader.slice(7);

    if (this.tokenBlacklist.isInvalid(token)) {
      throw new UnauthorizedException('Unauthorized');
    }

    try {
      const payload = this.jwtService.verify(token);
      const account = await this.accountService.findById(
        payload.sub || payload.id,
      );

      if (!account) {
        throw new UnauthorizedException('Unauthorized');
      }

      request.user = {
        ...payload,
        id: payload.sub || payload.id,
        email: payload.email,
        role: payload.role,
      };
      request.token = token;

      return true;
    } catch {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
