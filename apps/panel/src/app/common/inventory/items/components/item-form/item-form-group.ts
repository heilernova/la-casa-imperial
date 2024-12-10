import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { IDetail, IItemCategory } from "@la-casa-imperial/schemas/inventory/items";

export const generateItemFromGroup = () => new FormGroup({
    code: new FormControl<string>("", { nonNullable: true, }),
    barcode: new FormControl<string>("", { nonNullable: true }),
    unspsc: new FormControl<string>("", { nonNullable: true }),
    name: new FormControl<string>("", { nonNullable: true, validators: Validators.required }),
    brand: new FormControl<string>("", { nonNullable: true }),
    model: new FormControl<string>("", { nonNullable: true}),
    categories: new FormControl<IItemCategory[]>([], { nonNullable: true, validators: Validators.required }),
    profit: new FormControl<number>(0, { nonNullable: true }),
    cost: new FormGroup({
        costBase: new FormControl<number>(0),
        othersConst: new FormGroup({
            total: new FormControl<number>(0),
            details: new FormArray<FormGroup<{ field: FormControl<string>, value: FormControl<number> }>>([])
        }),
        total: new FormControl<number>(0),
    }),
    price: new FormControl<number>(0, { nonNullable: true }),
    orderIndex: new FormControl<number>(0, { nonNullable: true }),
    slug: new FormControl<string>("", { nonNullable: true }),
    seo: new FormGroup({
        title: new FormControl<string>("", { nonNullable: true }),
        description: new FormControl<string>("", { nonNullable: true }),
        keywords: new FormControl<string[]>([], { nonNullable: true })
    }),
    details: generateItemDetailsFormArray()
})

export const generateItemDetailsFormArray = (): ItemDetailsForm => {
    return new FormArray<ItemDetailForm>([]);
}

export const generateDetailFormGroup = (data?: IDetail) => {
    const formGroup = new FormGroup({
        title: new FormControl<string>("", { nonNullable: true, validators: Validators.required }),
        items: new FormArray<FormGroup<ItemDetailItemControls>>([], { validators: Validators.required })
    });

    if (data){
        formGroup.controls.title.setValue(data.title);
        data.items.forEach(item => {
            formGroup.controls.items.push(new FormGroup({
                field: new FormControl<string>(item.field, { nonNullable: true, validators: Validators.required }),
                value: new FormControl<string>(item.value, { nonNullable: true, validators: Validators.required }),
            }))
        })
    }

    return formGroup;
}

export const generateDetailItem = (data?: { field: string, value: string }) => {
    return new FormGroup({
        field: new FormControl<string>(data?.field ?? "", { nonNullable: true, validators: Validators.required }),
        value: new FormControl<string>(data?.value ?? "", { nonNullable: true, validators: Validators.required })
    })
}

export type ItemDetailItemControls = { field: FormControl<string>, value: FormControl<string> };
export type ItemDetailControls = { title: FormControl<string>, items: FormArray<FormGroup<ItemDetailItemControls>> };

export type ItemDetailItemFormGroup = FormGroup<{ field: FormControl<string>, value: FormControl<string> }>;
export type ItemDetailForm = FormGroup<{ title: FormControl<string>, items: FormArray<ItemDetailItemFormGroup> }>;
export type ItemDetailsForm = FormArray<FormGroup<ItemDetailControls>>;