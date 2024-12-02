import { NestFactory } from "@nestjs/core";
import { AppModule } from "../../app.module";
import { Type } from "@nestjs/common";

export const getService = async <T>(typeOrToken: Type<T> | string | symbol): Promise<T> => {
    const appContext = await NestFactory.createApplicationContext(AppModule);
    const service = appContext.get<T>(typeOrToken);
    return service;
};
