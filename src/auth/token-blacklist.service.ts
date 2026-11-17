import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenBlacklistService {
  private readonly invalidatedTokens = new Set<string>();

  invalidate(token: string) {
    if (token) {
      this.invalidatedTokens.add(token);
    }
  }

  isInvalid(token: string) {
    return !!token && this.invalidatedTokens.has(token);
  }
}
