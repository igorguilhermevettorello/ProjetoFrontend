export interface AlterarLivroModel {
  id: string;
  titulo: string;
  editora: string;
  edicao: number;
  anoPublicacao: number;
  valor: number;
  autorIds: string[];  // Lista de IDs dos autores
  assuntoIds: string[]; // Lista de IDs dos assuntos
}