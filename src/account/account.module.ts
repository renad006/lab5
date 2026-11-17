import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { TokenBlacklistService } from '../auth/token-blacklist.service';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { Account, AccountSchema } from './models/account.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'lab5-secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AccountController],
  providers: [AccountService, AuthGuard, RolesGuard, TokenBlacklistService],
  exports: [AccountService, AuthGuard, RolesGuard, TokenBlacklistService],
})
export class AccountModule {}
