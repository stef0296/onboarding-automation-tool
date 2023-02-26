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

export const FileBuffer = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();

        return request.fileBuffer || null;
    },
);

@Controller('api')
export class ApiController {
    @Put('/upload/:fileName')
    async webGetContentConfigListing(
        @Headers() headers,
        @Res() response: Response,
        @FileBuffer() fileBuffer,
    ): Promise<any> {
        try {
            if (fileBuffer === null) throw new BadRequestException('File is required');
            console.log(`body type: ${fileBuffer}`);
            return response.status(HttpStatus.OK).json('Upload Success!!');
        } catch (err) {
            console.log(err);
        }
    }
}
