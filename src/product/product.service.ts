import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { Client } from '@elastic/elasticsearch';
import { ConfigService } from '@nestjs/config';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  private readonly indexName: string;

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject('ELASTIC_CLIENT')
    private readonly elasticClient: Client,
    private readonly configService: ConfigService,
  ) {
    this.indexName = this.configService.get('ELASTIC_INDEX', 'products');
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = this.productRepository.create(createProductDto);
    const saved = await this.productRepository.save(newProduct);

    this.logger.log(`Created product ID: ${saved.id}.`);
    return saved;
  }

  async search(text: string) {
    try {
      const result = await this.elasticClient.search<Product>({
        index: this.indexName,
        query: {
          multi_match: {
            query: text,
            fields: ['name', 'description'],
            fuzziness: 'AUTO',
          },
        },
      });

      return result.hits.hits;
    } catch (error) {
      if (error instanceof Error)
        this.logger.error(`Elasticsearch error: ${error.message}`);
      return [];
    }
  }
}
