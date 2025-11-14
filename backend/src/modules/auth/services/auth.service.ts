import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../../../schemas/user.schema';
import { RegisterDto, LoginDto, AuthResponseDto, RefreshTokenDto } from '../dtos/auth.dto';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private tokenService: TokenService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, name, password } = registerDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const accessToken = this.tokenService.generateAccessToken(user._id.toString());
    const refreshToken = this.tokenService.generateRefreshToken(user._id.toString());

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = this.tokenService.generateAccessToken(user._id.toString());
    const refreshToken = this.tokenService.generateRefreshToken(user._id.toString());

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<AuthResponseDto> {
    try {
      const decoded = this.tokenService.verifyRefreshToken(refreshTokenDto.refreshToken);
      const user = await this.userModel.findById(decoded.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const accessToken = this.tokenService.generateAccessToken(user._id.toString());
      const refreshToken = this.tokenService.generateRefreshToken(user._id.toString());

      return {
        accessToken,
        refreshToken,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
