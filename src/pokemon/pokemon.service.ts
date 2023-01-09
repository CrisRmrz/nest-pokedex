import { Injectable } from '@nestjs/common';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>  //Ese pokemon hace referencia al entity con su schema
  ) { }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto); //GUARDAMOS EN BASE DE DATOS
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }


  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) { // Este nos permite buscar tanto por no, id o nombre

    let pokemon: Pokemon;

    if (!isNaN(+term)) { //Si es un numero
      pokemon = await this.pokemonModel.findOne({ no: term }) //Buscamos el que tenga el no que coincida con lo que el cliente envia
    }

    // Ahora verificar por mongoID
    if (!pokemon && isValidObjectId(term)) { //Si es un id correcto de mongo
      pokemon = await this.pokemonModel.findById(term);
    }

    // Luego por name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLocaleLowerCase().trim() });
    }


    if (!pokemon) throw new NotFoundException(`Pokemon with id, name or no "${term} not found"`); //En caso de que no encuentre nada

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(term); // Este findOne es el metodo que tenemos arriba, ejecuta todo
    if (updatePokemonDto.name) { // Si pasan el nombre entonces lo pasamos todo a minuscula
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }

    try {
      await pokemon.updateOne(updatePokemonDto) //El new es solo para mostrar el pokemon que se acaba de actualizar en postman
    } catch (error) {
      this.handleExceptions(error);
    }

    return { ...pokemon.toJSON(), ...updatePokemonDto }; // Con esto primero esparso todas las propiedades que tiene y
    // luego metemos las propiedades actualizadas que envian por el body de la peticion
  }

  async remove(id: string) { //Elimina tanto por id, no y nombre
    
    //const pokemon = await this.findOne( id );
    //await pokemon.deleteOne();
    //return {id};

      //const result = await this.pokemonModel.findByIdAndDelete( id );

      const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });

      if( deletedCount === 0 ){
        throw new BadRequestException(`Pokemon with id ${id} not found`)
      }

      return;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) { //Si ya existe un pokemon
      throw new BadRequestException(`Pokemon exists in DB ${JSON.stringify(error.keyValue)}`)
    }
    console.log(error)
    throw new InternalServerErrorException(`Cant create pokemon - Check servers logs`)
  }

}
