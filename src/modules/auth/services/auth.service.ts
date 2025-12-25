import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { MessageResDto } from 'src/common/dtos';
import { StandardMessage } from 'src/common/enums';
import { JwtPayload } from 'src/common/interfaces';
import {
  ConfigurationType,
  DefaultUserType,
  JwtType,
} from 'src/config/configuration.interface';
import { BcryptjsService } from 'src/modules/bcryptjs/bcryptjs.service';
import { MailService } from 'src/modules/mail/mail.service';
import { User, UserModel } from 'src/modules/user/entities/user.entity';
import { AccessResDto } from '../dto/access-res.dto';
import { SignInDto } from '../dto/sign-in.dto';
import { SignUpDto } from '../dto/sign-up.dto';
import { UserService } from 'src/modules/user/services/user.service';
import * as ms from 'ms';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: UserModel,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<ConfigurationType>,
    private readonly bcryptjsService: BcryptjsService,
    private readonly mailService: MailService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<AccessResDto> {
    const { email, password } = signInDto;

    // Validate if email exists
    const user = await this.userModel.findOne(
      { email, active: true },
      '+password',
    );
    if (!user) throw new ForbiddenException('Invalid credentials');

    // Validate password
    const isPasswordValid = await this.bcryptjsService.compareStringHash(
      password,
      user.password,
    );
    if (!isPasswordValid) throw new ForbiddenException('Invalid credentials');

    if (!user.emailVerified)
      throw new UnauthorizedException(
        'Unverified email, please verify your email',
      );

    return await this.accessRes(user);
  }

  async signUp(signUpDto: SignUpDto): Promise<MessageResDto> {
    const { email, username, password, confirmPassword } = signUpDto;

    // Validate if user already exists
    await this.userService.validateIfUserExists({ email, username });

    // Validate if password equals confirmPassword
    if (password !== confirmPassword)
      throw new BadRequestException(
        { confirmPassword: 'Passwords must match' },
        'Passwords must match',
      );

    const hash = await this.bcryptjsService.hashData(password);
    const user = await this.userModel.create({
      username,
      email,
      password: hash,
    });

    // send confirmation mail
    this.mailService.sendUserConfirmation(user);

    return { message: StandardMessage.SUCCESS };
  }

  async refreshTokens(_id: string, token: string): Promise<AccessResDto> {
    const user = await this.userModel.findOne({ _id }, '+hashRefreshToken');
    if (!user || !user.hashRefreshToken)
      throw new ForbiddenException('Refresh token not found');

    const isRefreshTokenValid = await this.bcryptjsService.compareStringHash(
      token,
      user.hashRefreshToken,
    );
    if (!isRefreshTokenValid)
      throw new ForbiddenException('Refresh token not valid');

    return await this.accessRes(user);
  }

  async logout(_id: string): Promise<MessageResDto> {
    await this.userModel.updateOne(
      { _id, hashRefreshToken: { $ne: null } },
      {
        $set: {
          hashRefreshToken: null,
        },
      },
    );
    return {
      message: StandardMessage.SUCCESS,
    };
  }

  async accessRes(
    user: Pick<
      User,
      | '_id'
      | 'createdAt'
      | 'updatedAt'
      | 'active'
      | 'username'
      | 'email'
      | 'emailVerified'
      | 'roles'
    >,
  ): Promise<AccessResDto> {
    const {
      _id,
      createdAt,
      updatedAt,
      active,
      username,
      email,
      emailVerified,
      roles,
    } = user;
    const { access_token, refresh_token, expires_in } = await this.getTokens({
      sub: _id.toString(),
      email,
    });

    await this.updateRefreshToken(_id, refresh_token);

    return {
      user: {
        _id,
        createdAt,
        updatedAt,
        active,
        username,
        email,
        emailVerified,
        roles,
      },
      tokens: {
        access_token,
        expires_in,
        refresh_token,
      },
    };
  }

  async getTokens(payload: JwtPayload): Promise<{
    access_token: string;
    expires_in: number;
    refresh_token: string;
  }> {
    const { refresh_secret, refresh_expires_in, expires_in } =
      this.configService.get<JwtType>('jwt');

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: refresh_secret,
        expiresIn: refresh_expires_in,
      }),
    ]);

    return {
      access_token,
      expires_in: Date.now() + ms(expires_in), //Date.now() + ms(expires_in) / 1000
      refresh_token,
    };
  }

  async updateRefreshToken(_id: Types.ObjectId, refresh_token: string) {
    const hashRefreshToken = await this.bcryptjsService.hashData(refresh_token);
    await this.userModel.updateOne({ _id }, { hashRefreshToken });
  }

  async onModuleInit() {
    await this.createDefaultUser();
  }

  private async createDefaultUser(): Promise<void> {
    const { email, password, username, role } =
      this.configService.get<DefaultUserType>('default_user');

    const existingUser = await this.userModel.findOne({
      email,
    });

    // If default user does not exist then create default user
    if (!existingUser) {
      const hash = await this.bcryptjsService.hashData(password);
      await this.userModel.create({
        username,
        email,
        password: hash,
        roles: [role],
        emailVerified: true,
      });
    }
  }
}
