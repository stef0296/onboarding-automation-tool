import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import translate from "translate";

@Injectable()
export class TranslateService {

    constructor(
        private readonly configService: ConfigService,
    ) {
        translate.engine = "deepl";
        translate.key = this.configService.get('DEEPL_KEY')
    }

    async translateContent(
        value: string,
        from: string = 'en',
        to: string = 'es'
    ): Promise<string> {
        if (!value) return '';
        return await translate(value, { from: from, to: to });
    }
}
