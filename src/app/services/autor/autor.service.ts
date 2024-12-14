import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { CriarAutorModel } from 'src/app/interfaces/autores/criar.autor.model'; 
import { RetornoAutorModel } from 'src/app/interfaces/autores/retorno.autor.model'; 
import { ListaAutoresModel } from 'src/app/interfaces/autores/lista.autores.model';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AutorService {

  private apiUrl = 'https://localhost:7013/api/Autor';
  private apiUrlListar = 'https://localhost:7013/api/Autor';

  constructor(private http: HttpClient) {}

  salvarAutor(autor: CriarAutorModel): Observable<RetornoAutorModel> {
    return this.http.post<RetornoAutorModel>(this.apiUrl, autor).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erro na requisição:', error);
        return throwError(() => error);
      })
    );
  }

  listarAutores(): Observable<ListaAutoresModel[]> {
    return this.http.get<ListaAutoresModel[]>(this.apiUrlListar).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao buscar autores:', error);
        return throwError(() => error);
      })
    );
  }

  deletarAutor(id: string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao deletar autor:', error);
        return throwError(() => error);
      })
    );
  }  

  obterAutorPorId(id: string): Observable<ListaAutoresModel> {
    return this.http.get<ListaAutoresModel>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao obter autor:', error);
        return throwError(() => error);
      })
    );
  }

  editarAutor(id: string, autor: ListaAutoresModel): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, autor).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao editar autor:', error);
        return throwError(() => error);
      })
    );
  }
}
