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

export const FileBuffer = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();

        return request.fileBuffer || null;
    },
);

@Controller('api')
export class ApiController {

    constructor(
        private readonly csvService: CsvService
    ) { }

    @Put('/upload/:fileName')
    async uploadCsvFile(
        @Headers() headers,
        @Res() response: Response,
        @FileBuffer() fileBuffer,
    ): Promise<any> {
        try {
            if (fileBuffer === null) throw new BadRequestException('File is required');
            let parsedData = await this.csvService.parseCSV(fileBuffer, ';');
            return response.status(HttpStatus.OK).json('Upload Success!!');
        } catch (err) {
            console.log(err);
        }
    }
}
