import { ListaAssuntosModel } from "../assuntos/lista.assuntos.model";
import { ListaAutoresModel } from "../autores/lista.autores.model";

export interface ListaLivrosModel {
  id: string;
  titulo: string;
  editora: string;
  edicao: number;
  anoPublicacao: number;
  valor: number;
  autores: ListaAutoresModel[];  
  assuntos: ListaAssuntosModel[]; 
}