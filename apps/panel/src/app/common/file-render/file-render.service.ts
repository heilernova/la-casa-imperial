import { inject, Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class FileRenderService {
  private _domSanitizer: DomSanitizer = inject(DomSanitizer);

  extractBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const objectURL = window.URL.createObjectURL(file);
        const image = this._domSanitizer.bypassSecurityTrustUrl(objectURL);
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
          resolve((reader.result as string));
        }

        reader.onerror = error =>{
          reject(error);
        }

        return;

      } catch (error) {
        return;
      }
    });
  }
}
