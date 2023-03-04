import { Injectable, Logger } from '@nestjs/common';
import fs from 'fs/promises';
import * as csv from 'csv';
import { ExportProduct } from '../interfaces/product.interface';

@Injectable()
export class CsvService {
    private readonly logger = new Logger(CsvService.name);

    parseCSV(data, delimiter: string = ';'): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            csv.parse(data, { delimiter: delimiter, columns: false }, (err, records, info) => {
                if (err) {
                    this.logger.error(err, null, 'parseCSV');
                    return reject(err);
                }

                if (records) {
                    // An assumption is made here that the document has only one column with the SKUs.
                    // If there are more columns, we'd define a data model and map it to that.
                    let mappedRecords: string[] = records.map((items) => items[0]);
                    resolve(mappedRecords);
                }

                if (info) {
                    this.logger.log(info);
                }
            });
        });
    }

    writeToCSV(fileName: string, data: ExportProduct[], delimiter: string = ';'): Promise<Boolean> {
        return new Promise<Boolean>((resolve, reject) => {
            csv.stringify(data, async (error, output) => {
                if (error) {
                    this.logger.error(error, null, 'writeToCSV');
                    reject(error);
                }
                await fs.writeFile(fileName, output);
                resolve(true);
            });
        });
    }
}
