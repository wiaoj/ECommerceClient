import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { Create_User } from 'src/app/contracts/user/Create_User';
import { User } from 'src/app/entities/user';
import { HttpClientService } from '../httpClient/http-client.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClientService: HttpClientService) {}

  async create(user: User): Promise<Create_User> {
    const observable: Observable<Create_User | User> =
      this.httpClientService.post<Create_User | User>(
        {
          controller: 'users',
        },
        user
      );
    return (await firstValueFrom(observable)) as Create_User;
  }
}