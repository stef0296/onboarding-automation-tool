import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CsvService } from '../csv/csv.service';
import { DbService } from '../db/db.service';
import { ProductSchema } from '../schema/product.schema';
import { ApiController } from './api.controller';

@Module({
    imports: [
        MongooseModule.forFeature(
            [{ name: 'Product', schema: ProductSchema }]
        ),
    ],
    controllers: [ApiController],
    providers: [CsvService, DbService]
})
export class ApiModule { }
