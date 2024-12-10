import { Component, computed, inject, Input, signal } from '@angular/core';
import { FileRenderService } from '../../../../../file-render';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { IOpenGraphImage, IOpenGraphImageBase } from '@la-casa-imperial/schemas/inventory/items';

@Component({
  selector: 'app-item-gallery',
  standalone: true,
  imports: [
    NzIconModule,
    NzDropDownModule
  ],
  templateUrl: './item-gallery.component.html',
  styleUrl: './item-gallery.component.scss'
})
export class ItemGalleryComponent {
  private readonly _fileRender = inject(FileRenderService);
  private _deleteImages: string[] = [];

  private openGraph: { type: "sms" | "facebook", file: File }[] = [];

  protected openGraphSMS = signal<string>("");
  protected openGraphShowSMS = computed(() => this.openGraphSMS() ? true : false);
  protected openGraphFacebook = signal<string>("");
  protected openGraphShowFacebook = computed(() => this.openGraphFacebook() ? true : false);

  protected gallery = signal<{ name?: string, src: string, file?: File }[]>([]);

  @Input()
  public set data(value: { openGraph: IOpenGraphImage[], gallery: string[] } | undefined){
    if (value){
      this.gallery.set(value.gallery.map(x => ({ src: x, name: x.split("/").pop()?.split(".")[0] })));
  
      value.openGraph.forEach(item => {
        if (item.name == "og-sms"){
          this.openGraphSMS.set(item.url);
        }

        if (item.name == "og-facebook"){
          this.openGraphFacebook.set(item.url);
        }
      })
    }

  }

  protected async tryFile(event: Event, type?: "sms" | "facebook"): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (type == "sms" || type == "facebook"){
      const file = input.files?.item(0);
      if (file){
        const base64 = await this._fileRender.extractBase64(file);
        if (type == "sms"){
          this.openGraph = this.openGraph.filter(x => x.type != "sms")
          this.openGraph.push({ type: "sms", file });
          this.openGraphSMS.set(base64);
        } else {
          this.openGraph = this.openGraph.filter(x => x.type != "facebook")
          this.openGraph.push({ type: "facebook", file });
          this.openGraphFacebook.set(base64);
        }
      }
    } else {
      const files = input.files;
      const  gallery = this.gallery();
      if (files){
        for (let index = 0; index < files.length; index++) {
          const file = files.item(index);
          if (file){
            const base64 = await this._fileRender.extractBase64(file);
            gallery.push({  src: base64, file: file });
          }
        }
      }
      this.gallery.set(gallery);
    }
    input.value = "";
  }

  protected onClickDelete(index: number): void {
    this.gallery.update(list => {
      const item = list.splice(index, 1)[0];
      if (item.name){
        this._deleteImages.push(item.name);
      }
      return list;
    })
  }

  public getImages(){

    const gallery = this.gallery().filter(x => x.file).map(x => x.file) as File[]
    if (this._deleteImages.length > 0 || this.openGraph.length > 0 || gallery.length > 0){
      return {
        delete: this._deleteImages,
        openGraph: this.openGraph,
        gallery
      }
    }

    return null;
  }
}
