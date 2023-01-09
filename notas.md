## ir a settings json y poner:
"material-icon-theme.activeIconPack": "nest",
esto para que aparezcan los iconos de nest en vez de los de angular

## desactivar prettier
yarn remove prettier
yarn remove eslint-config-prettier eslint-plugin-prettier

## Servir contenido estatico
En el pdf viene

yarn add @nestjs/serve-static

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
@Module({
 imports: [
 ServeStaticModule.forRoot({
 rootPath: join(__dirname,’..’,’public’),
 })
 ],
})
export class AppModule {}

## docker compose config

se crea el archivo docker-compose.yaml
version: '3'
services:
  db:
    image: mongo:5.0.0
    restart: always
    ports:
      - 27017:27017
    environment:
      MONGODB_DATABASE: nest-pokemon
    volumes:
      - ./mongo:/data/db
y en el cmd docker-compose up -d