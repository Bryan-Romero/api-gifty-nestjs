import { Injectable, NotFoundException } from '@nestjs/common';
import { AddFavoriteDto } from './dto/create-favorite.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  Favorite,
  FavoriteDocument,
  FavoriteModel,
} from './entities/favorite.entity';
import { User, UserModel } from '../user/entities/user.entity';
import { MessageResDto, PaginationDto } from 'src/common/dtos';
import { StandardMessage } from 'src/common/enums';
import { FindAllFavsResDto } from './dto/find-all-favs-res.dto';
import { ProjectionType } from 'mongoose';
import { SortOptions } from 'src/common/enums/sort-options.enum';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(Favorite.name) private favoriteModel: FavoriteModel,
    @InjectModel(User.name) private userModel: UserModel,
  ) {}

  async addFav(
    userId: string,
    addFavoriteDto: AddFavoriteDto,
  ): Promise<MessageResDto> {
    const { gifId } = addFavoriteDto;

    // Crear un nuevo favorito
    const newFavorite = await this.favoriteModel.create({
      gifId,
      user: userId,
    });

    // Actualizar la lista de favoritos del usuario
    await this.userModel.findByIdAndUpdate(userId, {
      $addToSet: { favorites: newFavorite._id },
    });

    return { message: StandardMessage.SUCCESS };
  }

  async findAllFavs(
    userId: string,
    paginationDto: PaginationDto,
  ): Promise<FindAllFavsResDto> {
    const {
      limit = 10,
      offset = 0,
      sort = SortOptions.CREATED_AT_DESC,
      keyWord,
    } = paginationDto;
    // Construir el filtro base: favoritos activos del usuario
    const filter: any = { user: userId, active: true };

    // Si hay búsqueda por palabra clave, agregar filtro por nombre (ajusta el campo según tu modelo)
    if (keyWord) {
      filter.$or = [
        { gifId: { $regex: keyWord, $options: 'i' } },
        // Agrega aquí otros campos si quieres buscar por más propiedades
      ];
    }

    // Convertir el sort del enum a formato Mongoose
    let sortOption: any = {};
    if (typeof sort === 'string') {
      if (sort.startsWith('-')) {
        sortOption[sort.substring(1)] = -1;
      } else {
        sortOption[sort] = 1;
      }
    }

    // Contar el total de favoritos que cumplen el filtro
    const total_items = await this.favoriteModel.countDocuments(filter);

    // Calcular el total de páginas
    const total_pages = Math.ceil(total_items / limit);

    // Obtener los favoritos paginados y ordenados
    const data = await this.favoriteModel
      .find(filter)
      .sort(sortOption)
      .skip(offset)
      .limit(limit)
      .lean();

    return {
      data,
      total_items,
      total_pages,
    };
  }

  async findOneFav(id: string): Promise<Favorite> {
    return await this.findFavoriteById(id);
  }

  async updateFav(userId: string, id: string): Promise<MessageResDto> {
    await this.favoriteModel.findOneAndUpdate(
      { gifId: id, user: userId },
      { active: false },
    );

    return { message: StandardMessage.SUCCESS };
  }

  async findFavoriteById(
    _id: string,
    projection?: ProjectionType<Favorite>,
    whitException = true,
  ): Promise<FavoriteDocument> {
    const favorite = await this.favoriteModel.findOne(
      { _id, active: true },
      projection,
    );

    if (!favorite && whitException)
      throw new NotFoundException(`Favorite with _id ${_id} does not exist`);

    return favorite || null;
  }
}
