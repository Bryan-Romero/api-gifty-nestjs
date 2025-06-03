import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { User } from 'src/modules/user/entities/user.entity';

@Schema({ timestamps: true })
export class Favorite {
  _id: Types.ObjectId;
  createdAt: String;
  updatedAt: String;

  @Prop({ type: Boolean, default: true, select: false })
  active: boolean;

  @Prop({ type: String })
  gifId: String;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);
export type FavoriteDocument = HydratedDocument<Favorite>;
export type FavoriteModel = Model<Favorite>;
