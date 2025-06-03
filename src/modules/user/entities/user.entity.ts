import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { Role } from 'src/common/enums';
import { Favorite } from 'src/modules/favorites/entities/favorite.entity';

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;
  createdAt: String;
  updatedAt: String;

  @Prop({ type: Boolean, default: true, select: false })
  active: boolean;

  @Prop({
    type: String,
    unique: true,
    index: true,
    sparse: true,
    trim: true,
    required: true,
  })
  username: string;

  @Prop({
    type: String,
    unique: true,
    index: true,
    sparse: true,
    trim: true,
    lowercase: true,
    required: true,
  })
  email: string;

  @Prop({ type: String, required: true, select: false })
  password: string;

  @Prop({ type: [String], enum: Role, default: [Role.USER] })
  roles: Role[];

  @Prop({ type: String, select: false })
  hashRefreshToken: string;

  @Prop({ type: Boolean, default: false })
  emailVerified: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: Favorite.name }] })
  favorites: Favorite[];
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;
export type UserModel = Model<User>;
