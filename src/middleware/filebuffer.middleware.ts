import { Injectable, NestMiddleware } from '@nestjs/common';
import { raw } from 'body-parser';

// For more information, read here // https://gist.github.com/jonilsonds9/efc228e34a298fa461d378f48ef67836

@Injectable()
export class FileBufferMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void): any {
        raw({
            verify: (req, res, buffer) => {
                req['fileBuffer'] = buffer;
            },
            limit: '5mb',
            type: 'text/csv'
        })(req, res as any, next);
    }
}