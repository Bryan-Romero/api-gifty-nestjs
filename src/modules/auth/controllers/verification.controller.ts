import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiKey } from 'src/common/decorators';
import { MessageResDto } from 'src/common/dtos';

import { EmailVerifiedDto } from '../dto/email-verified.dto';
import { ResendEmailDto } from '../dto/resend-email.dto';
import { VerificationService } from '../services/verification.service';

@ApiKey()
@ApiTags('Verification')
@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email verified',
    type: MessageResDto,
  })
  @Get('email')
  emailVerified(@Query() emailVerifiedDto: EmailVerifiedDto): Promise<MessageResDto> {
    return this.verificationService.emailVerified(emailVerifiedDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Resend verification email',
    type: MessageResDto,
  })
  @Get('resend-email')
  resendVerificationEmail(@Query() resendEmailDto: ResendEmailDto): Promise<MessageResDto> {
    return this.verificationService.resendVerificationEmail(resendEmailDto);
  }
}
