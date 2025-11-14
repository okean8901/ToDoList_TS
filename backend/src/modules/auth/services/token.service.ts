import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  generateAccessToken(userId: string): string {
    return this.jwtService.sign(
      { sub: userId },
      { expiresIn: '15m' }
    );
  }

  generateRefreshToken(userId: string): string {
    return this.jwtService.sign(
      { sub: userId },
      { expiresIn: '7d' }
    );
  }

  verifyAccessToken(token: string) {
    return this.jwtService.verify(token);
  }

  verifyRefreshToken(token: string) {
    return this.jwtService.verify(token);
  }
}
