import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import translate from "translate";

@Injectable()
export class TranslateService {

    constructor(
        private readonly configService: ConfigService,
    ) { }

    /**
     * Translate string value from English to Spanish.
     * @param value String value to be translated
     * @param from Base language. Default is English
     * @param to Language the string should be translated to. Default is Spanish
     * @returns 
     */
    async translateContent(
        value: string,
        from: string = 'en',
        to: string = 'es'
    ): Promise<string> {
        translate.engine = "deepl";
        translate.key = this.configService.get('DEEPL_KEY')
        if (!value) return '';
        return await translate(value, { from: from, to: to });
    }
}
