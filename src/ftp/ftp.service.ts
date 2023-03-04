import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Client from 'ftp';
import fs from 'fs/promises';

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

    uploadFile(fileName: string, filePath: string): Promise<Boolean> {
        return new Promise(async (resolve, reject) => {
            if (!(await fs.readFile(`${filePath}/${fileName}`))) {
                reject('File does not exist!');
            }
            let buffer: Buffer = await fs.readFile(`${filePath}/${fileName}`);

            this.client.on('ready', () => {
                this.client.put(buffer, fileName, (err) => {
                    if (err) {
                        reject(err);
                    }
                    this.client.end();
                    resolve(true);
                });
            });
            this.client.connect(this.connectionOptions);
        });
    }
}
