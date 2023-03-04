import { Injectable } from '@nestjs/common';
import fs from 'fs/promises';
import * as csv from 'csv';
import { ExportProduct } from '../interfaces/product.interface';

@Injectable()
export class CsvService {
    parseCSV(data, delimiter: string = ';'): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            csv.parse(data, { delimiter: delimiter, columns: false }, (err, records, info) => {
                if (err) {
                    return reject(err);
                }

                if (records) {
                    // An assumption is made here that the document has only one column with the SKUs.
                    // If there are more columns, we'd define a data model and map it to that.
                    let mappedRecords: string[] = records.map((items) => items[0]);
                    resolve(mappedRecords);
                }

                if (info) {
                    console.log(`CSV parse info: ${info}`);
                }
            });
        });
    }

    writeToCSV(fileName: string, data: ExportProduct[], delimiter: string = ';'): Promise<Boolean> {
        return new Promise<Boolean>((resolve, reject) => {
            csv.stringify(data, async (error, output) => {
                if (error) {
                    reject(error);
                }
                await fs.writeFile(fileName, output);
                resolve(true);
            });
        });
    }
}
