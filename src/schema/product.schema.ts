import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
@Schema()
export class Product {
    @Prop()
    sku: string;
    @Prop()
    title: [];
    @Prop()
    price: [];
    @Prop()
    categories: [];
}
export const ProductSchema = SchemaFactory.createForClass(Product);