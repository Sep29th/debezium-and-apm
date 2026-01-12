import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post()
  async create(@Body() createDto: CreateProductDto) {
    return this.productService.create(createDto);
  }

  @Get('search')
  async search(@Query('q') query: string) {
    if (!query) return [];
    return this.productService.search(query);
  }
}
