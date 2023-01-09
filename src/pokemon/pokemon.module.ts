import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonShema } from './entities/pokemon.entity';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Pokemon.name, //Nuestra entity. Ese name solo se refiere a que extiende de Document
        schema: PokemonShema,
      }, //Si tuviera mas Entitys con schemas solo las pongo despues de esta coma
    ])
  ]
})
export class PokemonModule {}
