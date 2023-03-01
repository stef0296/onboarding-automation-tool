interface InternalProduct {
    sku: string,
    title: { shop: string, title: string }[],
    price: { shop: string, price: string }[],
    categories: { shop: string, categories: string[] }[],
}

interface ExportProduct {
    SKU: string;
    Product: string;
    COUNTRY: string;
    TITLE: string;
    QUANTITY: string;
    PRICE: string;
    SIZE: string;
    CATEGORY: string;
    Color: string;
    IMAGE1?: string;
    IMAGE2?: string;
    IMAGE3?: string;
    IMAGE4?: string;
    IMAGE5?: string;
    IMAGE6?: string;
    FIT: string;
    STYLE: string;
    WIDTH: string;
    LENGHT: string;
}

export {
    InternalProduct,
    ExportProduct
}