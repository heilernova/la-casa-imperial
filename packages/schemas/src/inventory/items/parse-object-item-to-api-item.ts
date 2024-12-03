import { ApiItem } from "./api-item.interface"
import { IItem } from "./item.interface"

export const parseObjectItemToApiItem = (data: IItem, urlMedia: string): ApiItem => {
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
        stockMin: data.stockMin,
        cost: data.cost,
        profit: data.profit,
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
        gallery: data.gallery,
        openGraphImages: data.openGraphImages.map(x =>  ({ ...x, url:  `${urlMedia}/${data.code}` }) ),
        description: data.description
    }
}