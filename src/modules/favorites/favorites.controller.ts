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
import { FindsGifsIdsResDto } from './dto/finds-gifs-ids-res.dto';

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
    description: 'Get all IDs favorites',
    type: Array<string>,
  })
  @JwtAuth()
  @Get()
  findAllIDsFavs(@GetUser('_id') userId: string): Promise<Array<string>> {
    return this.favoritesService.findAllIDsFavs(userId);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all gifId pagination',
    type: FindsGifsIdsResDto,
  })
  @JwtAuth()
  @Get('pagination-gifId')
  findsGifsIds(
    @GetUser('_id') userId: string,
    @Query() paginationDto: PaginationDto,
  ): Promise<FindsGifsIdsResDto> {
    return this.favoritesService.findsGifsIds(userId, paginationDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all favorites',
    type: FindAllFavsResDto,
  })
  @JwtAuth()
  @Get('pagination')
  findAllFavs(
    @Query() paginationDto: PaginationDto,
  ): Promise<FindAllFavsResDto> {
    return this.favoritesService.findAllFavs(paginationDto);
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
