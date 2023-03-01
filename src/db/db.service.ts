import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InternalProduct } from '../interfaces/product.interface';

// Reference: https://medium.com/globant/crud-application-using-nestjs-and-mongodb-99a0756adb76
@Injectable()
export class DbService {
    constructor(
        @InjectModel('Product') private productRepository: Model<InternalProduct>
    ) { }

    async getProducts(skus: string[]): Promise<InternalProduct[]> {
        const productData: InternalProduct[] = await this.productRepository.find({
            sku: {
                $in: skus
            }
        });
        if (!productData || productData.length == 0) {
            throw new NotFoundException('Products data not found!');
        }
        return productData;
    }
}
