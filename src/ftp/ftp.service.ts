import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Client from 'ftp';

@Injectable()
export class FtpService {
    client: Client;
    connectionOptions: Client.Options = {};
    constructor(
        private readonly configService: ConfigService,
    ) {
        this.client = new Client();
        this.connectionOptions = {
            host: this.configService.get('FTP_HOST'),
            port: parseInt(this.configService.get('FTP_PORT')),
            user: this.configService.get('FTP_USER'),
            password: this.configService.get('FTP_PWD'),
        };
    }

    async uploadFile(fileName: string, buffer: Buffer) {
        this.client.on('ready', () => {
            this.client.put(buffer, fileName, (err) => {
                if (err) throw err;
                this.client.end();
            });
        });
        this.client.connect(this.connectionOptions);
    }
}
