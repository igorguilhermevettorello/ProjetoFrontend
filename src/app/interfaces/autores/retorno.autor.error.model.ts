export interface RetornoAutorErrorModel {
  type: string;
  title: string;
  status: number;
  traceId: string;
  errors: { [key: string]: string[] }; // Exemplo: { "Nome": ["O nome é obrigatório."] }
}