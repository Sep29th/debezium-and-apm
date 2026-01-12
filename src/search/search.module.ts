import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@elastic/elasticsearch';

@Global()
@Module({
  providers: [
    {
      provide: 'ELASTIC_CLIENT',
      useFactory: (configService: ConfigService) =>
        new Client({
          node: configService.get<string>('ELASTIC_NODE'),
        }),
      inject: [ConfigService],
    },
  ],
  exports: ['ELASTIC_CLIENT'],
})
export class SearchModule {}
