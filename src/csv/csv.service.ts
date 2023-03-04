import { Injectable } from '@nestjs/common';
import fs from 'fs';
import * as csv from 'csv';

@Injectable()
export class CsvService {
    parseCSV(data, delimiter: string = ';'): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            csv.parse(data, { delimiter: delimiter }, (err, records, info) => {
                if (err) {
                    return reject(err);
                }

                if (records) {
                    // An assumption is made here that the document has only one column with the SKUs.
                    // If there are more columns, we'd define a data model and map it to that.
                    let mappedRecords: string[] = records.map((items) => items[0]);
                    mappedRecords.shift();
                    resolve(mappedRecords);
                }

                if (info) {
                    console.log(`CSV parse info: ${info}`);
                }
            });
        });
    }

    async writeToCSV(data, delimiter: string = ';'): Promise<Buffer> {
        return null;
    }
}
