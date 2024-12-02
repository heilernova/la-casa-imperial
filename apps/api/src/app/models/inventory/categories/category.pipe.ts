import { isHexadecimal } from '@la-casa-imperial/core';
import { HttpException, Injectable, PipeTransform } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../../app.module';
import { ICategory } from '@la-casa-imperial/schemas/inventory/categories';

@Injectable()
export class CategoryPipe implements PipeTransform {
  async transform(value: unknown): Promise<ICategory> {
    
    if (typeof  value != "string"){
      throw new HttpException("El parámetro de la URL es incorrecto tiene el tipo incorrecto", 400);
    }
  
    if (!isHexadecimal(value, 8)) throw new HttpException("El parámetro de la URL es incorrecto", 400);

    const appContext = await NestFactory.createApplicationContext(AppModule);
    const categories = appContext.get(CategoriesService);

    const category: ICategory | undefined = await categories.get(value);
    if (!category) throw new HttpException("Categoría no encontrada", 404);
    return category;
  }
}
