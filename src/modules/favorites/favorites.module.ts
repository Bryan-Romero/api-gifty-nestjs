import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Favorite, FavoriteSchema } from './entities/favorite.entity';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Favorite.name, schema: FavoriteSchema }])],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService, MongooseModule.forFeature([{ name: Favorite.name, schema: FavoriteSchema }])],
})
export class FavoritesModule {}
