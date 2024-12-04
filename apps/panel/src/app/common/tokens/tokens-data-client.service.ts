import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IToken } from './token.interface';

@Injectable({
  providedIn: 'root'
})
export class TokensDataClientService {
  private readonly _http = inject(HttpClient);

  public getAll(): Observable<IToken[]> {
    return this._http.get<{ id: string, createdAt: string, exp: string | null, ip: string, platform: string |null, device: string }[]>("profile/tokens")
    .pipe(map(list => list.map(x => ({
        id: x.id,
        createdAt: new Date(x.createdAt),
        ip: x.ip,
        platform: x.platform,
        device: x.device,
        exp: x.exp ? new Date(x.exp) : null
    }))));
  }

  public delete(id: string): Observable<void> {
    return this._http.delete<void>(`profile/tokens/${id}`);
  }
}
