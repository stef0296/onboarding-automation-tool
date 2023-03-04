import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Client from 'ftp';
import fs from 'fs/promises';

@Injectable()
export class FtpService {
    client: Client;
    connectionOptions: Client.Options = {};

    private readonly logger = new Logger(FtpService.name);

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

    /**
     * Method to upload a CSV file to the FTP server
     * @param fileName 
     * @param filePath 
     * @returns 
     */
    uploadFile(fileName: string, filePath: string): Promise<Boolean> {
        return new Promise(async (resolve, reject) => {
            if (!(await fs.readFile(`${filePath}/${fileName}`))) {
                this.logger.error('File does not exist!', null, 'uploadFile: readFile');
                reject('File does not exist!');
            }
            let buffer: Buffer = await fs.readFile(`${filePath}/${fileName}`);

            this.client.on('ready', () => {
                this.client.put(buffer, fileName, (err) => {
                    if (err) {
                        this.logger.error(err, null, 'uploadFile: ftp upload');
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
