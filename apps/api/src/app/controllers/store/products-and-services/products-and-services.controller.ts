import { Controller, Get, Query } from '@nestjs/common';
import { ItemsService } from '../../../models/inventory';
import { IItem } from '@la-casa-imperial/schemas/inventory/items';
import { ApiProductAndService } from '@la-casa-imperial/schemas/store';

@Controller('products-and-services')
export class ProductsAndServicesController {
    constructor(private _items: ItemsService){}

    private parse(data: IItem, urlMedia: string): ApiProductAndService {
        return {
            id: data.id,
            createdAt: data.createdAt.toUTCString(),
            updatedAt: data.updatedAt.toUTCString(),
            type: data.type,
            status: data.status,
            publish: data.publish,
            code: data.code,
            barcode: data.barcode,
            unspsc: data.unspsc,
            name: data.name,
            brand: data.brand,
            model: data.model,
            stock: data.stock,
            price: data.price,
            offer: data.offer ? {
                basePrice: data.offer.basePrice,
                percentage: data.offer.percentage,
                exp: data.offer.exp ? data.offer.exp.toISOString() : null
            } : null,
            categories: data.categories,
            filters: data.filters,
            tags: data.tags,
            flags: data.flags,
            slug: data.slug,
            orderIndex: data.orderIndex,
            seo: data.seo,
            details: data.details,
            gallery: data.gallery.map(x => `${urlMedia}/${data.code}/${x}.avif`),
            openGraphImages: data.openGraphImages.map(x =>  ({ ...x, url:  `${urlMedia}/${data.code}/${x.name}.${x.type}` }) ),
            description: data.description
        }
    }

    @Get()
    async getAll(@Query("category") category: string | undefined){
        const categories = category?.split(",");
        const list = await this._items.getAll({ publish: false, category: categories });
        return list.map(x => this.parse(x, `${process.env.APP_URL_MEDIA_BASE}`));
    }
}
