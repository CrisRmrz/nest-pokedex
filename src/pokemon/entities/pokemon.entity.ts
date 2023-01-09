import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose/dist";
import { Document } from "mongoose";

// Las entitis es la representacion de lo que vamos a estar guardando en la base de datos

@Schema() //Con este decorador le decimos que va a ser un schema de de base de datos
export class Pokemon extends Document {  // Mongo se encarga de ponerle la s, para que quede como 'pokemons'

    //id: string // Mongo ya me da el id entonces no hay que ponerlo

    @Prop({
        unique: true,
        index: true //Le decimos que va a tener un indice
    })
    name: string;

    @Prop({
        unique: true,
        index: true
    })
    no: number; //numero de pokemon

}

export const PokemonShema = SchemaFactory.createForClass( Pokemon );