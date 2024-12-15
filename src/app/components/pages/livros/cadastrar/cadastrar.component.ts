import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LivroService } from 'src/app/services/livro/livro.service'; 
import { CriarLivroModel } from 'src/app/interfaces/livros/criar.livro.model'; 
import { ListaLivrosModel } from 'src/app/interfaces/livros/lista.livros.model';
import { AutorService } from 'src/app/services/autor/autor.service'; 
import { ListaAutoresModel } from 'src/app/interfaces/autores/lista.autores.model'; 
import { CriarAutorModel } from 'src/app/interfaces/autores/criar.autor.model'; 
import { AssuntoService } from 'src/app/services/assunto/assunto.service'; 
import { ListaAssuntosModel } from 'src/app/interfaces/assuntos/lista.assuntos.model'; 
import { CriarAssuntoModel } from 'src/app/interfaces/assuntos/criar.assunto.model';
import { CurrencyMaskConfig } from 'ng2-currency-mask';
import { AlterarLivroModel } from 'src/app/interfaces/livros/alterar.livro.model';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.css']
})
export class CadastrarComponent implements OnInit {

  loading: boolean = false;

  titulo: string = ''; 
  erroTitulo: boolean = false; 

  editora: string = ''; 
  erroEditora: boolean = false; 

  edicao: string = ''; 
  erroEdicao: boolean = false; 
  erroEdicaoNumber: boolean = false; 

  anoPublicacao: string = ''; 
  erroAnoPublicacao: boolean = false; 
  erroAnoPublicacaoNumber: boolean = false; 

  valor: number = 0; // Valor do livro (numérico)
  customOptions: Partial<CurrencyMaskConfig> = {
    align: 'left',              // Alinhamento do valor (esquerda)
    prefix: 'R$ ',              // Prefixo monetário
    thousands: '.',             // Separador de milhares
    decimal: ',',               // Separador de decimais
    precision: 2,               // Casas decimais
    allowNegative: false        // Não permite valores negativos
  };
  
  mensagemErro: string = ''; 
  sucesso: string = ''; 
  livroId: string | null = null;

  modalVisivelAutor: boolean = false;
  novoAutor: CriarAutorModel = { nome: '' };
  erroNome: boolean = false;
  listaAutores: ListaAutoresModel[] = [];
  autoresSelecionados: string[] = [];

  modalVisivelAssunto: boolean = false;
  novoAssunto: CriarAssuntoModel = { descricao: '' };
  erroDescricao: boolean = false;
  listaAssuntos: ListaAssuntosModel[] = [];
  assuntosSelecionados: string[] = [];

  constructor(
    private livroService: LivroService,
    private autorService: AutorService,
    private assuntoService: AssuntoService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.carregarAutores();
    this.carregarAssuntos();
    this.livroId = this.route.snapshot.paramMap.get('id');
    if (this.livroId) {
      this.carregarLivro();
    }
  }

  carregarAutores(): void {
    this.autorService.listarAutores().subscribe({
      next: (resposta) => {
        this.listaAutores = resposta;
      },
      error: (error) => {
        console.error('Erro ao carregar autores:', error);
        this.mensagemErro = 'Erro ao carregar a lista de autores.';
      }
    });
  }

  carregarAssuntos(): void {
    this.loading = true;
    this.mensagemErro = '';

    this.assuntoService.listarAssuntos().subscribe({
      next: (resposta) => {
        this.listaAssuntos = resposta;
        this.loading = false;
      },
      error: (error) => {
        this.mensagemErro = 'Erro ao carregar autores. Tente novamente.';
        console.error(error);
        this.loading = false;
      }
    });
  }

  getItemNome(id: string): string {
    const item = this.listaAutores.find((x) => x.id === id);
    return item ? item.nome : 'Item não encontrado';
  }

  getItemDescricao(id: string): string {
    const item = this.listaAssuntos.find((x) => x.id === id);
    return item ? item.descricao : 'Item não encontrado';
  }

  carregarLivro(): void {
    this.loading = true;
    this.livroService.obterLivroPorId(this.livroId!).subscribe({
      next: (livro: ListaLivrosModel) => {
        debugger;
        this.titulo = livro.titulo;
        this.editora = livro.editora;
        this.editora = livro.edicao.toString();
        this.anoPublicacao = livro.anoPublicacao.toString();
        this.valor = livro.valor;
        this.autoresSelecionados = livro.autores.map(item => item.id);
        this.assuntosSelecionados = livro.assuntos.map(item => item.id);
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

    if (!this.editora.trim()) {
      this.erroEditora = true;
      return;
    }

    if (typeof this.edicao != "number" && !this.edicao.trim()) {
      this.erroEdicao = true;
      return;
    }

    if (Number(this.edicao) <= 0) {
      this.erroEdicaoNumber = true;
      return;
    }

    if (typeof this.anoPublicacao != "number" && !this.anoPublicacao.trim()) {
      this.erroAnoPublicacao = true;
      return;
    }

    if (Number(this.anoPublicacao) <= 0) {
      this.erroAnoPublicacaoNumber = true;
      return;
    }

    this.loading = true;

    if (this.livroId) {
      const livro: AlterarLivroModel = { 
        id: this.livroId,
        titulo: this.titulo,
        editora: this.editora,
        edicao: Number(this.edicao),
        anoPublicacao: Number(this.anoPublicacao),
        valor: this.valor,
        autorIds: this.autoresSelecionados,
        assuntoIds: this.assuntosSelecionados
      }
      this.livroService.editarLivro(this.livroId, livro).subscribe({
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
      const livro: CriarLivroModel = { 
        titulo: this.titulo,
        editora: this.editora,
        edicao: Number(this.edicao),
        anoPublicacao: Number(this.anoPublicacao),
        valor: this.valor,
        autorIds: this.autoresSelecionados,
        assuntoIds: this.assuntosSelecionados
      }

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
    this.erroTitulo = false;
  }

  onFocusEditora(): void {
    this.erroEditora = false;
  }

  onFocusEdicao(): void {
    this.erroEdicao = false; 
    this.erroEdicaoNumber = false;
  }

  onFocusAnoPublicacao(): void {
    this.erroAnoPublicacao = false; 
    this.erroAnoPublicacaoNumber = false; 
  }

  abrirModalAutor(): void {
    this.modalVisivelAutor = true;
    const modal = document.getElementById('modalSalvarAutor');
    if (modal) modal.style.display = 'block';
  }

  fecharModalAutor(): void {
    this.modalVisivelAutor = false;
    const modal = document.getElementById('modalSalvarAutor');
    if (modal) modal.style.display = 'none';
    this.novoAutor.nome = '';
    this.erroNome = false;
  }

  salvarAutor(): void {
    if (!this.novoAutor.nome.trim()) {
      this.erroNome = true;
      return;
    }

    this.autorService.salvarAutor(this.novoAutor).subscribe({
      next: () => {
        this.carregarAutores();
        this.fecharModalAutor();
      },
      error: (error) => {
        console.error('Erro ao salvar autor:', error);
      }
    });
  }

  abrirModalAssunto(): void {
    this.modalVisivelAssunto = true;
    const modal = document.getElementById('modalSalvarAssunto');
    if (modal) modal.style.display = 'block';
  }

  fecharModalAssunto(): void {
    this.modalVisivelAssunto = false;
    const modal = document.getElementById('modalSalvarAssunto');
    if (modal) modal.style.display = 'none';
    this.novoAssunto.descricao = '';
    this.erroDescricao = false;
  }

  salvarAssunto(): void {
    if (!this.novoAssunto.descricao.trim()) {
      this.erroDescricao = true;
      return;
    }

    this.assuntoService.salvarAssunto(this.novoAssunto).subscribe({
      next: () => {
        this.carregarAssuntos();
        this.fecharModalAssunto();
      },
      error: (error) => {
        console.error('Erro ao salvar assunto:', error);
      }
    });
  }
}