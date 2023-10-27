import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { useContainer } from "class-validator";
import { AppModule } from "./modules/main/app.module";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.setGlobalPrefix("/api")
    await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();
