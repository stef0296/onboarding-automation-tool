import { Module } from '@nestjs/common';
import { CsvService } from '../csv/csv.service';
import { ApiController } from './api.controller';

@Module({
    controllers: [ApiController],
    providers: [CsvService]
})
export class ApiModule { }
