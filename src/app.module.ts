import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';
import { ConfigModule } from '@nestjs/config';
import { ApiController } from './api/api.controller';
import { FileBufferMiddleware } from './middleware/filebuffer.middleware';

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
  ],
  controllers: [ApiController],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer
      .apply(FileBufferMiddleware)
      .forRoutes(...rawBodyParsingRoutes);
  }
}
