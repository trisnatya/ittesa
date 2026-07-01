import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';
import * as bcrypt from 'bcryptjs';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }

  @Post('test-password')
  async testPassword(@Body() body: { password: string; hash: string }) {
    const isValid = await bcrypt.compare(body.password, body.hash);
    return { 
      password: body.password, 
      hash: body.hash, 
      isValid,
      generatedHash: await bcrypt.hash(body.password, 10)
    };
  }
}