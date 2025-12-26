import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiKey, GetToken, GetUser, JwtAuth, JwtRefreshAuth } from 'src/common/decorators';
import { MessageResDto } from 'src/common/dtos';

import { AccessResDto } from '../dto/access-res.dto';
import { SignInDto } from '../dto/sign-in.dto';
import { SignUpDto } from '../dto/sign-up.dto';
import { AuthService } from '../services/auth.service';

@ApiKey()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sign in with your credentials',
    type: AccessResDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Body() signInDto: SignInDto): Promise<AccessResDto> {
    return this.authService.signIn(signInDto);
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Sign up with your credentials',
    type: MessageResDto,
  })
  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto): Promise<MessageResDto> {
    return this.authService.signUp(signUpDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Refresh tokens',
    type: AccessResDto,
  })
  @HttpCode(HttpStatus.OK)
  @JwtRefreshAuth()
  @Post('refresh-tokens')
  refreshTokens(@GetUser('_id') _id: string, @GetToken() token: string): Promise<AccessResDto> {
    return this.authService.refreshTokens(_id, token);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Log out',
    type: MessageResDto,
  })
  @HttpCode(HttpStatus.OK)
  @JwtAuth()
  @Post('logout')
  logout(@GetUser('_id') _id: string): Promise<MessageResDto> {
    return this.authService.logout(_id);
  }
}
