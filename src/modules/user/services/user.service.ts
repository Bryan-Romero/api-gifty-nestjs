import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProjectionType } from 'mongoose';
import { MessageResDto, PaginationDto } from 'src/common/dtos';
import { StandardMessage } from 'src/common/enums';
import { UserRequest } from 'src/common/interfaces';
import { generateRandomPassword } from 'src/common/utils/generate-random-pass';
import { BcryptjsService } from 'src/modules/bcryptjs/bcryptjs.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { FindAllResDto } from '../dto/find-all-res.dto';
import { ME } from '../dto/me.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User, UserDocument, UserModel } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: UserModel,
    private readonly bcryptjsService: BcryptjsService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, username } = createUserDto;

    // Validate if user already exists
    await this.validateIfUserExists({ email, username });

    const randomPassword = generateRandomPassword(12);
    console.log(randomPassword);
    const hash = await this.bcryptjsService.hashData(randomPassword);
    const newUser = await this.userModel.create({
      email,
      password: hash,
      ...createUserDto,
    });

    const user = await this.userModel.findOne(
      { _id: newUser._id },
      {
        active: 0,
      },
    );

    return user;
  }

  async findAll(paginationDto: PaginationDto): Promise<FindAllResDto> {
    console.log('🚀 ~ UserService ~ findAll ~ paginationDto:', paginationDto);
    return {
      data: [],
      pagination: {
        total_items: 0,
        total_pages: 0,
        items: 0,
        offset: 0,
      },
    };
  }

  async me(_id: string): Promise<ME> {
    const user = await this.findUserById(_id);

    return {
      _id: user._id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      active: user.active,
      username: user.username,
      email: user.email,
      emailVerified: user.emailVerified,
      roles: user.roles,
    };
  }

  async findOne(_id: string): Promise<User> {
    const user = await this.findUserById(_id);

    return user;
  }

  async update(_id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findUserById(_id);

    const { username } = updateUserDto;
    user.username = username;
    await user.save();

    return user;
  }

  async remove(_id: string): Promise<MessageResDto> {
    const user = await this.findUserById(_id);

    user.active = false;
    await user.save();

    return { message: StandardMessage.SUCCESS };
  }

  async validateUser(email: string, password: string): Promise<UserRequest> {
    const user = await this.userModel.findOne(
      { email, active: true },
      '+password',
    );
    if (user) {
      // Validate password
      const isPasswordValid = await this.bcryptjsService.compareStringHash(
        password,
        user.password,
      );

      const { _id, roles, username } = user;
      return isPasswordValid ? { _id, email, roles, username } : null;
    }

    return null;
  }

  async findUserByEmail(
    email: string,
    projection?: ProjectionType<User>,
    whitException = true,
  ): Promise<UserDocument> {
    const user = await this.userModel.findOne(
      { email, active: true },
      projection,
    );

    if (!user && whitException)
      throw new NotFoundException(`User with email ${email} does not exist`);

    return user || null;
  }

  async findUserById(
    _id: string,
    projection?: ProjectionType<User>,
    whitException = true,
  ): Promise<UserDocument> {
    const user = await this.userModel.findOne(
      { _id, active: true },
      projection,
    );

    if (!user && whitException)
      throw new NotFoundException(`User with _id ${_id} does not exist`);

    return user || null;
  }

  async validateIfUserExists({
    email,
    username,
  }: Pick<User, 'username' | 'email'>) {
    const [userByEmail, userByUsername] = await Promise.all([
      this.userModel.findOne({
        email: { $regex: new RegExp(`^${email}$`, 'i') },
      }),
      this.userModel.findOne({
        username: { $regex: new RegExp(`^${username}$`, 'i') },
      }),
    ]);
    /** En una expresión regular, ^ indica el inicio de la cadena y $
     * indica el final de la cadena. Por ejemplo, ^texto$ solo hace match
     * si la cadena es exactamente "texto" (no "otexto", ni "texto1"). */

    if (userByEmail || userByUsername) {
      const errors = {};
      if (userByEmail) errors['email'] = 'Email already exists';
      if (userByUsername) errors['username'] = 'Username already exists';
      throw new ConflictException(errors);
    }
  }
}
