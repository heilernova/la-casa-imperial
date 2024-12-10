import { Controller, Get, HttpStatus, Param, Query, Res } from '@nestjs/common';
import { ItemPipe } from '../../models/inventory';
import { IItem } from '@la-casa-imperial/schemas/inventory/items';
import { existsSync } from 'node:fs';
import { Response } from 'express';
import { join, resolve } from 'node:path';

@Controller('media')
export class MediaController {
    @Get("items/:id/:resource")
    async items(@Res() res: Response, @Param("id", ItemPipe) item: IItem, @Param("resource") resource: string, @Query("size") size: "thumbnail" | "small"){
        const path = `${process.env.APP_DIR_FILES}/items/${item.id}`;
        if (resource.startsWith("img")){
            const name = resource.split('.')[0];
            const filePath =  resolve(join(`${path}/${name}/${size == "thumbnail" ? "thumbnail" : ( size == "small" ? "small" : "regular")}.avif`));
            if (existsSync(filePath)){
                res.setHeader('Content-Type', 'image/avif');
                res.setHeader('Cache-Control', 'public, max-age=86400');
                res.setHeader('Content-Disposition', 'inline');
                res.sendFile(filePath);
                return;
            }
        }
        
        if (resource.startsWith("og")){
            const filePath =  resolve(join(`${path}/${resource}`));
            console.log(filePath);
            if (existsSync(filePath)){
                res.setHeader('Content-Type', 'image/avif');
                res.setHeader('Cache-Control', 'public, max-age=86400');
                res.setHeader('Content-Disposition', 'inline');
                res.sendFile(filePath);
                return;
            }
        }
        res.status(HttpStatus.NOT_FOUND).json({ message: 'Image not found' });
    }
}
