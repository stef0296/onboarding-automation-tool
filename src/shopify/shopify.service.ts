import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Shopify from 'shopify-api-node';

// reference: https://blog.logrocket.com/build-shopify-app-with-node-js/
@Injectable()
export class ShopifyService {
    private shopifyInstance: Shopify;
    constructor(
        private readonly configService: ConfigService
    ) {
        let config: Shopify.IPrivateShopifyConfig = <Shopify.IPrivateShopifyConfig>{
            apiKey: this.configService.get<string>('SHOPIFY_API_KEY'),
            shopName: this.configService.get<string>('SHOPIFY_SHOP'),
            password: this.configService.get<string>('SHOPIFY_PWD'),
            apiVersion: this.configService.get<string>('SHOPIFY_API_VERSION'),
            autoLimit: true, // track how many requests have been made, and delay sending subsequent requests if the rate limit has been exceeded
        };

        this.shopifyInstance = new Shopify(config);
    }

    async fetchProducts(ids: string[]) {
        let variants: Shopify.IProductVariant[];
        let params = {
            ids: ids.join(','),
            limit: 250, // ≤ 250 | default 50
        };

        while (params != undefined) {
            let products = await this.shopifyInstance.product.list();
            for (let product of products) {
                variants.concat(product.variants);
            }
            params = products.nextPageParameters;
        }

        return variants;
    }
}


