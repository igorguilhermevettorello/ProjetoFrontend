import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LivroService } from 'src/app/services/livro/livro.service'; 
import { CriarLivroModel } from 'src/app/interfaces/livros/criar.livro.model'; 
import { ListaLivrosModel } from 'src/app/interfaces/livros/lista.livros.model';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.css']
})
export class CadastrarComponent implements OnInit {

  titulo: string = ''; 
  erroTitulo: boolean = false; 

  editora: string = ''; 
  erroEditora: boolean = false; 

  edicao: string = ''; 
  erroEdicao: boolean = false; 

  anoPublicacao: string = ''; 
  erroAnoPublicacao: boolean = false; 

  loading: boolean = false;
  mensagemErro: string = ''; 
  sucesso: string = ''; 
  livroId: string | null = null;

  constructor(
    private livroService: LivroService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.livroId = this.route.snapshot.paramMap.get('id');
    if (this.livroId) {
      this.carregarLivro();
    }
  }

  carregarLivro(): void {
    this.loading = true;
    this.livroService.obterLivroPorId(this.livroId!).subscribe({
      next: (livro: ListaLivrosModel) => {
        this.titulo = livro.titulo;
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

    if (!this.titulo.trim()) {
      this.erroTitulo = true;
      return;
    }

    // Exibe o loading
    this.loading = true;

    if (this.livroId) {
      const autor: ListaLivrosModel = { 
        id: this.livroId,
        titulo: this.titulo 
      }
      this.livroService.editarLivro(this.livroId, autor).subscribe({
        next: () => {
          this.loading = false;
          this.sucesso = 'Livro atualizado com sucesso!';
          this.router.navigate(['/livros/listar']);
        },
        error: (error) => {
          console.error('Erro ao atualizar livro:', error);
          this.mensagemErro = 'Erro ao atualizar o livro.';
          this.loading = false;
        }
      });
    } else {
      const livro: CriarLivroModel = { titulo: this.titulo };
      this.livroService.salvarLivro(livro).subscribe({
        next: () => {
          this.loading = false;
          this.sucesso = 'Livro salvo com sucesso!';
          this.router.navigate(['/livros/listar']);
        },
        error: (error) => {
          console.error('Erro ao salvar livro:', error);
          this.mensagemErro = 'Erro ao salvar o livro.';
          this.loading = false;
        }
      });
    }
  }
  
  onFocus(): void {
    this.erroTitulo = false; // Oculta a mensagem de erro
  }
}