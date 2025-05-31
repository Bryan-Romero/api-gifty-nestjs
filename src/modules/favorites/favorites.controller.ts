import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { AddFavoriteDto } from './dto/create-favorite.dto';
import { ApiKey, GetUser, JwtAuth } from 'src/common/decorators';
import { MessageResDto, PaginationDto } from 'src/common/dtos';
import { FindAllFavsResDto } from './dto/find-all-favs-res.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Favorite } from './entities/favorite.entity';

@ApiKey()
@ApiTags('Favorites')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create a new favorite',
    type: MessageResDto,
  })
  @JwtAuth()
  @Post()
  addFav(
    @GetUser('_id') userId: string,
    @Body() addFavoriteDto: AddFavoriteDto,
  ): Promise<MessageResDto> {
    return this.favoritesService.addFav(userId, addFavoriteDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all favorites',
    type: FindAllFavsResDto,
  })
  @JwtAuth()
  @Get()
  findAllFavs(
    @GetUser('_id') userId: string,
    @Query() paginationDto: PaginationDto,
  ): Promise<FindAllFavsResDto> {
    return this.favoritesService.findAllFavs(userId, paginationDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get one favorite by id',
    type: Favorite,
  })
  @JwtAuth()
  @Get(':id')
  findOneFav(@Param('id') id: string): Promise<Favorite> {
    return this.favoritesService.findOneFav(id);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update one favorite by id',
    type: MessageResDto,
  })
  @JwtAuth()
  @Patch(':id')
  updateFav(
    @GetUser('_id') userId: string,
    @Param('id') id: string,
  ): Promise<MessageResDto> {
    return this.favoritesService.updateFav(userId, id);
  }
}
