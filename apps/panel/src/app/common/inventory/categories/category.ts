import { ApiCategory, ICategory } from '@la-casa-imperial/schemas/inventory/categories'
import { BehaviorSubject } from 'rxjs';

export class Category {
    public readonly changeValues: BehaviorSubject<ICategory>;
    public readonly id: string;
    public readonly parentId: string | null;
    public readonly name: string;
    public readonly slug: string;
    public readonly description: string | null;

    

    constructor(data: ApiCategory) {
        this.id = data.id;
        this.parentId = data.parentId;
        this.name = data.name;
        this.slug = data.slug;
        this.description = data.description;
        this.changeValues = new BehaviorSubject<ICategory>(data);
    }

    // get changeValues(){
    //     return this._changeValues.asObservable();
    // }
}