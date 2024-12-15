import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { CriarLivroModel } from 'src/app/interfaces/livros/criar.livro.model'; 
import { RetornoLivroModel } from 'src/app/interfaces/livros/retorno.livro.model'; 
import { ListaLivrosModel } from 'src/app/interfaces/livros/lista.livros.model';
import { catchError } from 'rxjs/operators';
import { AlterarLivroModel } from 'src/app/interfaces/livros/alterar.livro.model';

@Injectable({
  providedIn: 'root'
})
export class LivroService {

  private apiUrl = 'https://localhost:7167/api/Livro';
  private apiUrlListar = 'https://localhost:7167/api/Livro';

  constructor(private http: HttpClient) {}

  salvarLivro(livro: CriarLivroModel): Observable<RetornoLivroModel> {
    return this.http.post<RetornoLivroModel>(this.apiUrl, livro).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erro na requisição:', error);
        return throwError(() => error);
      })
    );
  }

  listarLivros(): Observable<ListaLivrosModel[]> {
    return this.http.get<ListaLivrosModel[]>(this.apiUrlListar).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao buscar de livros:', error);
        return throwError(() => error);
      })
    );
  }

  deletarLivro(id: string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao deletar livro:', error);
        return throwError(() => error);
      })
    );
  }  

  obterLivroPorId(id: string): Observable<ListaLivrosModel> {
    return this.http.get<ListaLivrosModel>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao obter livro:', error);
        return throwError(() => error);
      })
    );
  }

  editarLivro(id: string, livro: AlterarLivroModel): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, livro).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao editar livro:', error);
        return throwError(() => error);
      })
    );
  }
}
