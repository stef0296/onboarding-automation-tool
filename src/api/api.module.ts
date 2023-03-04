import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CsvService } from '../csv/csv.service';
import { DbService } from '../db/db.service';
import { FtpService } from '../ftp/ftp.service';
import { ProductSchema } from '../schema/product.schema';
import { ShopifyService } from '../shopify/shopify.service';
import { TranslateService } from '../translate/translate.service';
import { ApiController } from './api.controller';

@Module({
    imports: [
        MongooseModule.forFeature(
            [{ name: 'Product', schema: ProductSchema }]
        ),
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
export class ApiModule { }
