import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AutorService } from 'src/app/services/autor/autor.service'; 
import { CriarAutorModel } from 'src/app/interfaces/autores/criar.autor.model'; 
import { ListaAutoresModel } from 'src/app/interfaces/autores/lista.autores.model';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.css']
})
export class CadastrarComponent implements OnInit {

  nome: string = ''; 
  erroNome: boolean = false; 
  erroNomeTamanho: boolean = false; 

  loading: boolean = false;
  mensagemErro: string = ''; 
  sucesso: string = ''; 
  autorId: string | null = null;

  constructor(
    private autorService: AutorService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.autorId = this.route.snapshot.paramMap.get('id');
    if (this.autorId) {
      this.carregarAutor();
    }
  }

  carregarAutor(): void {
    this.loading = true;
    this.autorService.obterAutorPorId(this.autorId!).subscribe({
      next: (autor: ListaAutoresModel) => {
        this.nome = autor.nome;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar autor:', error);
        this.mensagemErro = 'Erro ao carregar os dados do autor.';
        this.loading = false;
      }
    });
  }

  onSalvar(): void {
    this.mensagemErro = '';
    this.sucesso = '';

    if (!this.nome.trim()) {
      this.erroNome = true;
      return;
    }

    console.log(this.nome.length);
    if (this.nome.length > 40) {
      this.erroNomeTamanho = true;
      return;
    }

    // Exibe o loading
    this.loading = true;

    if (this.autorId) {
      const autor: ListaAutoresModel = { 
        id: this.autorId,
        nome: this.nome 
      }
      this.autorService.editarAutor(this.autorId, autor).subscribe({
        next: () => {
          this.loading = false;
          this.sucesso = 'Autor atualizado com sucesso!';
          this.router.navigate(['/autores/listar']);
        },
        error: (error) => {
          console.error('Erro ao atualizar autor:', error);
          this.mensagemErro = 'Erro ao atualizar o autor.';
          this.loading = false;
        }
      });
    } else {
      const autor: CriarAutorModel = { nome: this.nome };
      this.autorService.salvarAutor(autor).subscribe({
        next: () => {
          this.loading = false;
          this.sucesso = 'Autor salvo com sucesso!';
          this.router.navigate(['/autores/listar']);
        },
        error: (error) => {
          console.error('Erro ao salvar autor:', error);
          this.mensagemErro = 'Erro ao salvar o autor.';
          this.loading = false;
        }
      });
    }
  }
  
  onFocus(): void {
    this.erroNome = false; // Oculta a mensagem de erro
    this.erroNomeTamanho = false;
  }
}
