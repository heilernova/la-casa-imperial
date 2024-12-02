import { HttpException, Injectable, PipeTransform } from '@nestjs/common';
import { getService } from '../../../common/utils';
import { ItemsService } from './items.service';

@Injectable()
export class ItemPipe implements PipeTransform {
  async transform(value: unknown) {
    if (typeof value != "string"){
      throw new HttpException("El Valor debe ser un string", 404);
    }
    const service = await getService(ItemsService);
    const item = await service.get(value);
    if (!item) {
      throw new HttpException(`No se encontró ningún producto que coincida con la búsqueda de "${value}".`, 404);
    }
    return item;
  }
}
