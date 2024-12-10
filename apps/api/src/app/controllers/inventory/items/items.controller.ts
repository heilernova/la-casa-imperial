import { Body, Controller, Delete, FileTypeValidator, Get, HttpException, Param, ParseFilePipe, Post, Put, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ItemPipe, ItemsService } from '../../../models/inventory';
import { ApiItem, IItem, IOpenGraphImage, parseObjectItemToApiItem } from '@la-casa-imperial/schemas/inventory/items';
import { ItemCreateDto } from './dto';
import { FilesImagesValidator } from './files-image-validator';
import * as multer from 'multer';
import e, { Express } from 'express';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import * as sharp from 'sharp';
import { AuthGuard } from '../../../authentication';


@UseGuards(AuthGuard)
@Controller('items')
export class ItemsController {
    constructor(private readonly _items: ItemsService){}

    @Get()
    async getAll(): Promise<ApiItem[]> {
        const items = await this._items.getAll({});
        return items.map(x => parseObjectItemToApiItem(x, `${process.env.APP_URL_MEDIA_BASE}/items`));
    }

    @Get(':id')
    get(@Param('id', ItemPipe) item: IItem): ApiItem {
        return parseObjectItemToApiItem(item, `${process.env.APP_URL_MEDIA_BASE}`);
    }

    @Post()
    async create(@Body() body: ItemCreateDto): Promise<ApiItem> {
        const nameAvailable = await this._items.isNameAvailable(body.name);
        if (!nameAvailable){
            throw new HttpException("El nombre del ítem ya está en uso. Por favor, elige un nombre diferente.", 400);
        }
        const item = await this._items.create(body);
        return parseObjectItemToApiItem(item, `${process.env.APP_URL_MEDIA_BASE}`);
    }

    @Put(':id')
    async update(@Param('id', ItemPipe) item: IItem, @Body() body: ItemCreateDto): Promise<ApiItem> {
        const nameAvailable = await this._items.isNameAvailable(body.name);
        if (!nameAvailable){
            throw new HttpException("El nombre del ítem ya está en uso. Por favor, elige un nombre diferente.", 400);
        }
        await this._items.update(item.id, body);
        const result = await this._items.get(item.id);
        if (!result) throw new HttpException("Error inesperado", 500);
        return  parseObjectItemToApiItem(result, `${process.env.APP_URL_MEDIA_BASE}`);
    }

    @Delete(':id')
    async delete(@Param('id', ItemPipe) item: IItem): Promise<void> {
        await this._items.delete(item.id);
    }

    @Put(':id/publish')
    async publish(@Param('id', ItemPipe) item: IItem): Promise<void> {
        const messagesError: string[] = [];

        const validations = [
            { condition: item.gallery.length === 0, message: 'El item no cuenta con imágenes en la galleria' },
            { condition: !item.openGraphImages.some(x => x.name === "og-sms"), message: "El item no cuenta con una imagen para Open Graph en SMS" },
            { condition: !item.openGraphImages.some(x => x.name === "og-facebook"), message: "El item no cuenta con una imagen para Open Graph para Facebook" },
            { condition: !item.seo.title, message: "El item no cuenta con un título" },
            { condition: !item.seo.description, message: "El item no cuenta con una descripción" },
        ];

        validations.forEach(validation => {
            if (validation.condition) messagesError.push(validation.message);
        });

        if (messagesError.length > 0) {
            const errorResponse: Record<string, unknown> = {
                message: "No se puede publicar el producto",
                details: messagesError,
            };
            throw new HttpException(errorResponse, 400);
        }

        await this._items.update(item.id, { publish: true });
    }


    @Put(':id/unpublish')
    async unpublish(@Param('id', ItemPipe) item: IItem): Promise<void> {
        await this._items.update(item.id, { publish: false });
    }

    @Put(':id/images')
    @UseInterceptors(AnyFilesInterceptor())
    async images(
    @Param('id', ItemPipe) item: IItem,
    @Body('delete') deleteImagesString?: string,
    @UploadedFiles(new ParseFilePipe({
        fileIsRequired: false,
        validators: [
        new FileTypeValidator({ fileType: /^image\/\w+/ }),
        new FilesImagesValidator(/^og-sms$|^og-facebook$|^gallery$|^image$/),
        ]
    })) files?: Express.Multer.File[]
    ) {
        const path = `${process.env.APP_DIR_FILES as string}/items/${item.id}`;
        const deleteImages = deleteImagesString?.split(',').map(name => name.trim()) || [];
        if (!existsSync(`${process.env.APP_DIR_FILES as string}/items`)) mkdirSync(`${process.env.APP_DIR_FILES as string}/items`);
        
        let gallery = item.gallery;
        let openGraphImages = item.openGraphImages;

        deleteImages.forEach(name => {
            if (name.startsWith("img") && existsSync(`${path}/${name}`)) {
                rmSync(`${path}/${name}`, { recursive: true, force: true });
                gallery = gallery.filter(x => x !== name);
            } else if (name.startsWith("og") && existsSync(`${path}/${name}.avif`)) {
                openGraphImages = openGraphImages.filter(x => x.name !== name);
            }
        });

        sharp.cache(false);

        if (files) {
            let galleryIndex = item.gallery.length > 0 ? Math.max(...item.gallery.map(x => parseInt(x.substring(4), 10))) : 0;

            if (!existsSync(path)) mkdirSync(path);

            sharp.cache(false);
            
            const promises = files.map(async (file) => {
                const sharpImage = sharp.default(file.buffer);
                const metaData = await sharpImage.metadata();
                if (metaData.format !== "avif") sharpImage.toFormat("avif");
                if (file.fieldname === "gallery") {
                    if (metaData.height !== metaData.width) {
                    const size = Math.max(metaData.height ?? 0, metaData.width ?? 0);
                        sharpImage.resize(size, size, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } });
                    }
                    galleryIndex++;
                    const folderImage = `img-${galleryIndex.toString().padStart(2, '0')}`;
                    mkdirSync(`${path}/${folderImage}`)
                    await Promise.all([
                        sharpImage.clone().toFile(`${path}/${folderImage}/regular.avif`),
                        sharpImage.clone().resize(200, 200).toFile(`${path}/${folderImage}/small.avif`),
                        sharpImage.clone().resize(50, 50).toFile(`${path}/${folderImage}/thumbnail.avif`),
                    ]);

                    return folderImage;
                } else {
                    const ogImage: IOpenGraphImage = {
                        name: file.fieldname,
                        type: "avif",
                        height: metaData.height as number,
                        width: metaData.width as number,
                        size: metaData.size as number,
                    };

                    if (ogImage.name == "og-sms" && ogImage.height != ogImage.width){
                        const height = ogImage.height > 1080 ? 1080 : ogImage.height;
                        sharpImage.resize(height, height, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } });
                    }

                    if (ogImage.name == "og-facebook" && (ogImage.height != 630 || ogImage.width != 1200)){
                        sharpImage.resize(1200, 630, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } });
                    }

                    const res = await sharpImage.toFile(`${path}/${file.fieldname}.avif`);
                    ogImage.height = res.height;
                    ogImage.width = res.width;
                    ogImage.size = res.size;
                    openGraphImages = [...openGraphImages.filter(x => x.name !== file.fieldname), ogImage];
                    return null;
                }
            });

            const isString = (value: string | null): value is string => value !== null;
            const result = (await Promise.all(promises)).filter(isString).sort();
            gallery.push(...result);
        }

        await this._items.update(item.id, { gallery, openGraphImages });
        return {
            gallery: gallery.map(x => `${process.env.APP_URL_MEDIA_BASE}/media/items/${x}.avif`),
            openGraphImages: openGraphImages.map(x => {
                return {
                    ...x,
                    url: `${process.env.APP_URL_MEDIA_BASE}/media/items/${x.name}.${x.type}`
                }
            })
        }
    }

}