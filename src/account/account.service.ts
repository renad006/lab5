import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Account, AccountDocument } from './models/account.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { TokenBlacklistService } from '../auth/token-blacklist.service';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name)
    private readonly accountModel: Model<AccountDocument>,
    private readonly jwtService: JwtService,
    private readonly tokenBlacklist: TokenBlacklistService,
  ) {}

  async createAccount(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    const existingAccount = await this.accountModel.findOne({ email }).exec();

    if (existingAccount) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const created = await this.accountModel.create({
      name: dto.name,
      email,
      password: hashedPassword,
      role: 'user',
    });

    const { password, ...account } = created.toObject();
    return account;
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();
    const account = await this.accountModel.findOne({ email }).exec();

    if (!account) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, account.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: account._id.toString(),
      id: account._id.toString(),
      email: account.email,
      role: account.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async logout(token: string) {
    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }

    this.tokenBlacklist.invalidate(token);

    return { message: 'Logged out successfully' };
  }

  async findById(id: string) {
    return this.accountModel.findById(id).select('-password').exec();
  }

  isTokenInvalidated(token: string) {
    return this.tokenBlacklist.isInvalid(token);
  }
}
