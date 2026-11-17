import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AccountService } from './account.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.accountService.createAccount(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.accountService.login(dto);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  logout(@Req() req: any) {
    const token = req.token || null;
    return this.accountService.logout(token);
  }
}
