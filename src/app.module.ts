import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CsvService } from './csv/csv.service';
import { FtpService } from './ftp/ftp.service';
import { TranslateService } from './translate/translate.service';
import { ShopifyService } from './shopify/shopify.service';
import { DbService } from './db/db.service';
import { SchedulerService } from './scheduler/scheduler.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    CsvService,
    FtpService,
    TranslateService,
    ShopifyService,
    DbService,
    SchedulerService
  ],
})
export class AppModule { }
