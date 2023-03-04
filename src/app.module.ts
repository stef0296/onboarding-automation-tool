import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiController } from './api/api.controller';
import { FileBufferMiddleware } from './middleware/filebuffer.middleware';
import { ApiModule } from './api/api.module';
import { CsvService } from './csv/csv.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './schema/product.schema';
import { DbService } from './db/db.service';
import { ShopifyService } from './shopify/shopify.service';
import { TranslateService } from './translate/translate.service';
import { FtpService } from './ftp/ftp.service';

// This is an array of routes we want raw body parsing to be available on
const rawBodyParsingRoutes: Array<RouteInfo> = [
  {
    path: '/api/upload/:fileName',
    method: RequestMethod.PUT,
  },
]

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: `${configService.get<string>('CONN_STR')}/${configService.get<string>('DB_NAME')}`,
      }),
      inject: [ConfigService]
    }),
    MongooseModule.forFeature(
      [{ name: 'Product', schema: ProductSchema }]
    ),
    ApiModule,
  ],
  controllers: [ApiController],
  providers: [
    CsvService,
    DbService,
    FtpService,
    ShopifyService,
    TranslateService,
  ]
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer
      .apply(FileBufferMiddleware)
      .forRoutes(...rawBodyParsingRoutes);
  }
}
