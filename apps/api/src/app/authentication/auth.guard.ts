import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { UserRole, UserStatus } from '@la-casa-imperial/schemas/users';
import { DbConnectionService } from '../common/db-connection';
import { AppSession } from './app-session.model';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';

@Injectable()
export class AuthGuard implements CanActivate {

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const request = context.switchToHttp().getRequest<Request>();
    const token: string | string[] | undefined | null  = request.headers["x-app-token"];

    if (typeof token != "string"){
      throw new HttpException("Se require autenticación", 401);
    }
    
    const appContext = await NestFactory.createApplicationContext(AppModule);
    const db = appContext.get(DbConnectionService);
    const result: { id: string, email: string, role: UserRole, status: UserStatus, permissions: string[] } | undefined = (await db.query("SELECT b.id, b.email, b.role, b.permissions, b.status FROM users_tokens a inner join users b on b.id = a.user_id where a.id = $1", [token])).rows[0] ?? undefined;

    if (!result) {
      throw new HttpException("Token invalido", 401);
    }

    if (result.status == "lock") {
      throw new HttpException("Usuario bloqueado", 403);
    }

    const appSession = new AppSession({ ...result, token });

    request["appSession"] = appSession;

    return true;
  }
}
