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
import { CsvService } from '../csv/csv.service';
import { DbService } from '../db/db.service';
import { FtpService } from '../ftp/ftp.service';
import { ExportProduct, InternalProduct } from '../interfaces/product.interface';
import { ShopifyService } from '../shopify/shopify.service';
import { TranslateService } from '../translate/translate.service';

export const FileBuffer = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();

        return request.fileBuffer || null;
    },
);

@Controller('api')
export class ApiController {

    constructor(
        private readonly csvService: CsvService,
        private readonly dbService: DbService,
        private readonly ftpService: FtpService,
        private readonly shopifyService: ShopifyService,
        private readonly translateService: TranslateService,
    ) { }

    @Put('/upload/:fileName')
    async uploadCsvFile(
        @Headers() headers,
        @Res() response: Response,
        @FileBuffer() fileBuffer,
    ): Promise<any> {
        try {
            if (fileBuffer === null) throw new BadRequestException('File is required');

            // parse data from raw buffer
            let skuData: string[] = await this.csvService.parseCSV(fileBuffer, ';');

            this.processCSVUpload(skuData);

            return response.status(HttpStatus.OK).json('Upload Success!!');
        } catch (err) {
            console.log(err);
        }
    }

    async processCSVUpload(skuData: string[]) {
        // fetch product data from DB
        let dbData: InternalProduct[] = await this.dbService.getProducts(skuData);
        let ids: string[] = dbData.map((item) => item._id);
        let productVariants = this.shopifyService.fetchProducts(ids);
        let exportProducts: ExportProduct[] = [];

        for (let item of dbData) {
            let titleIndex = item.title.findIndex((title) => title.shop.toLowerCase() == 'en');
            let title = titleIndex != -1 ? item.title[titleIndex].title : null;
            title = await this.translateService.translateContent(title);

            let priceIndex = item.price.findIndex((price) => price.shop.toLowerCase() == 'en');
            let price = priceIndex != -1 ? item.price[priceIndex].price : null;

            let categoryIndex = item.categories.findIndex((category) => category.shop.toLowerCase() == 'en');
            let categories = priceIndex != -1 ? item.categories[categoryIndex].categories.join(',') : null;

            /**
             * Based on the shopify documentation, each product can have up to 3 options. The options can be different from product to product. For example, one product can use size, color, and style, and another product can use weight, finish, and material.
             * 
             * Keeping this in mind, we make the following assumption:
             * option1: SIZE
             * option2: COLOR
             * option3: STYLE
             * 
             * Reference: https://help.shopify.com/en/manual/products/variants/add-variants
             */
            let itemVariants = (await productVariants).filter((variant) => variant.product_id.toString() == item._id);
            for (let itemVariant of itemVariants) {
                let color = await this.translateService.translateContent(itemVariant.option2);
                let exportProduct: ExportProduct = {
                    SKU: `${item.sku}-${itemVariant.option1}`,
                    Product: item.sku,
                    EAN: itemVariant.barcode,
                    COUNTRY: 'ES',
                    TITLE: title,
                    QUANTITY: `${itemVariant.inventory_quantity}`,
                    PRICE: price,
                    SIZE: itemVariant.option1,
                    CATEGORY: categories,
                    Color: color,
                    IMAGE1: `https://ivy-oak.com/IVYOAK/${item.sku}/${item.sku}-1`,
                    IMAGE2: `https://ivy-oak.com/IVYOAK/${item.sku}/${item.sku}-2`,
                    IMAGE3: `https://ivy-oak.com/IVYOAK/${item.sku}/${item.sku}-3`,
                    IMAGE4: `https://ivy-oak.com/IVYOAK/${item.sku}/${item.sku}-4`,
                    IMAGE5: `https://ivy-oak.com/IVYOAK/${item.sku}/${item.sku}-5`,
                    IMAGE6: `https://ivy-oak.com/IVYOAK/${item.sku}/${item.sku}-6`,
                    FIT: '',
                    STYLE: itemVariant.option3,
                    WIDTH: '',
                    LENGHT: '',
                };
                exportProducts.push(exportProduct);
            };
        }

        // Write data to CSV
        let buffer: Buffer = await this.csvService.writeToCSV(exportProducts);

        // Upload CSV file via FTP
        let date: Date = new Date();
        let formattedDate: string = date.toISOString().split('T')[0];
        this.ftpService.uploadFile(`${formattedDate}_ivyoak_product_export_es.csv`, buffer);
    }
}
