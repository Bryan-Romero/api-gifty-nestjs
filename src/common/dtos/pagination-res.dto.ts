import { ApiProperty } from '@nestjs/swagger';

export class PaginationDt {
  @ApiProperty({ type: Number })
  total_items: number;

  @ApiProperty({ type: Number })
  total_pages: number;

  @ApiProperty({ type: Number })
  offset: number;

  @ApiProperty({ type: Number })
  items: number;
}

export class PaginationResDto {
  @ApiProperty()
  data: any;

  @ApiProperty({ type: PaginationDt })
  pagination: PaginationDt;
}
