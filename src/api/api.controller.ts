import {
    createParamDecorator,
    Controller,
    ExecutionContext,
    Headers,
    HttpStatus,
    Res,
    Put,
    BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { CsvService } from '../csv/csv.service';
import { DbService } from '../db/db.service';
import { InternalProduct } from '../interfaces/product.interface';

export const FileBuffer = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();

        return request.fileBuffer || null;
    },
);

@Controller('api')
export class ApiController {

    constructor(
        private readonly csvService: CsvService,
        private readonly dbService: DbService,
    ) { }

    @Put('/upload/:fileName')
    async uploadCsvFile(
        @Headers() headers,
        @Res() response: Response,
        @FileBuffer() fileBuffer,
    ): Promise<any> {
        try {
            if (fileBuffer === null) throw new BadRequestException('File is required');

            // parse data from raw buffer
            let skuData: string[] = await this.csvService.parseCSV(fileBuffer, ';');

            // fetch product data from DB
            let dbData: InternalProduct[] = await this.dbService.getProducts(skuData);

            return response.status(HttpStatus.OK).json('Upload Success!!');
        } catch (err) {
            console.log(err);
        }
    }
}
