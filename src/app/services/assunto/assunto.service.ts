import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { CriarAssuntoModel } from 'src/app/interfaces/assuntos/criar.assunto.model'; 
import { RetornoAssuntoModel } from 'src/app/interfaces/assuntos/retorno.assunto.model'; 
import { ListaAssuntosModel } from 'src/app/interfaces/assuntos/lista.assuntos.model';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AssuntoService {

  private apiUrl = 'https://localhost:7167/api/Assunto';
  private apiUrlListar = 'https://localhost:7167/api/Assunto';

  constructor(private http: HttpClient) {}

  salvarAssunto(assunto: CriarAssuntoModel): Observable<RetornoAssuntoModel> {
    return this.http.post<RetornoAssuntoModel>(this.apiUrl, assunto).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erro na requisição:', error);
        return throwError(() => error);
      })
    );
  }

  listarAssuntos(): Observable<ListaAssuntosModel[]> {
    return this.http.get<ListaAssuntosModel[]>(this.apiUrlListar).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao buscar assuntos:', error);
        return throwError(() => error);
      })
    );
  }

  deletarAssunto(id: string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao deletar assunto:', error);
        return throwError(() => error);
      })
    );
  }  

  obterAssuntoPorId(id: string): Observable<ListaAssuntosModel> {
    return this.http.get<ListaAssuntosModel>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao obter assunto:', error);
        return throwError(() => error);
      })
    );
  }

  editarAssunto(id: string, assunto: ListaAssuntosModel): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, assunto).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao editar assunto:', error);
        return throwError(() => error);
      })
    );
  }
}
