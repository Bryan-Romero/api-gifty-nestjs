import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProjectionType } from 'mongoose';
import { MessageResDto, PaginationDto } from 'src/common/dtos';
import { StandardMessage } from 'src/common/enums';
import { SortOptions } from 'src/common/enums/sort-options.enum';
import { User, UserModel } from '../user/entities/user.entity';
import { AddFavoriteDto } from './dto/create-favorite.dto';
import { FindAllFavsResDto } from './dto/find-all-favs-res.dto';
import {
  Favorite,
  FavoriteDocument,
  FavoriteModel,
} from './entities/favorite.entity';
import { FindsGifsIdsResDto } from './dto/finds-gifs-ids-res.dto';

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

    // Buscar si existe
    const fondFovorite = await this.favoriteModel.findOne(
      {
        gifId,
        user: userId,
      },
      { active: 1 },
    );

    if (fondFovorite) {
      if (fondFovorite.active) {
        return { message: StandardMessage.SUCCESS };
      } else {
        fondFovorite.active = true;
        await fondFovorite.save();
        return { message: StandardMessage.SUCCESS };
      }
    }

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

  async findAllIDsFavs(userId: string): Promise<string[]> {
    // ▶ .find({ user: userId, active: true }, { ... }): Busca los favoritos del usuario.
    // ▶ .lean(): Devuelve objetos planos, más rápido y ligero.
    // ▶ .map(...): Extrae solo los valores de gifId en un array.

    // Busca todos los favoritos activos del usuario y solo trae el campo gifId
    const favorites = await this.favoriteModel
      .find(
        { user: userId, active: true },
        { gifId: 1, _id: -1, createdAt: -1, updatedAt: -1, user: -1 },
      )
      .lean();

    // Extrae solo los gifId en un array de strings
    return favorites.map((fav) => fav.gifId as string);
  }

  async findsGifsIds(
    userId: string,
    paginationDto: PaginationDto,
  ): Promise<FindsGifsIdsResDto> {
    const {
      limit = 10,
      offset = 0,
      sort = SortOptions.UPDATED_AT_DESC,
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
    const sortOption: any = {};
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
      .find(filter, { gifId: 1 })
      .sort(sortOption)
      .skip(offset)
      .limit(limit)
      .lean();

    return {
      data: data.map((fav) => fav.gifId) || [],
      pagination: {
        items: data.length,
        offset,
        total_items,
        total_pages,
      },
    };
  }

  async findAllFavs(paginationDto: PaginationDto): Promise<FindAllFavsResDto> {
    const {
      limit = 10,
      offset = 0,
      sort = SortOptions.UPDATED_AT_DESC,
      keyWord,
    } = paginationDto;
    // Construir el filtro base: favoritos activos del usuario
    const filter: any = { active: true };

    // Si hay búsqueda por palabra clave, agregar filtro por nombre (ajusta el campo según tu modelo)
    if (keyWord) {
      filter.$or = [
        { gifId: { $regex: keyWord, $options: 'i' } },
        // Agrega aquí otros campos si quieres buscar por más propiedades
      ];
    }

    // Convertir el sort del enum a formato Mongoose
    const sortOption: any = {};
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
      pagination: {
        items: data.length,
        offset,
        total_items,
        total_pages,
      },
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
