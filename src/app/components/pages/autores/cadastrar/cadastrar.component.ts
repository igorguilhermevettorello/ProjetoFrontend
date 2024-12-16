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

  tituloModal: string = 'Mensagem'; 
  mensagemModal: string = '';  
  tipoMensagem: string = '';  

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
          this.abrirModalMensagem('Sucesso', 'O autor foi atualizado com sucesso!', 'sucesso');
        },
        error: (error) => {
          this.abrirModalMensagem('Mensagem', `Erro ao atualizar autor: ${JSON.stringify(error)}` , 'erro');
          this.loading = false;
          console.error('Erro ao atualizar autor:', error);
        }
      });
    } else {
      const autor: CriarAutorModel = { nome: this.nome };
      this.autorService.salvarAutor(autor).subscribe({
        next: () => {
          this.loading = false;
          this.abrirModalMensagem('Sucesso', 'O autor foi salvo com sucesso!', 'sucesso');
        },
        error: (error) => {
          this.loading = false;
          this.abrirModalMensagem('Mensagem', `Erro ao salvar autor: ${JSON.stringify(error)}` , 'erro');
          console.error('Erro ao salvar autor:', error);
        }
      });
    }
  }
  
  onFocus(): void {
    this.erroNome = false; // Oculta a mensagem de erro
    this.erroNomeTamanho = false;
  }

  abrirModalMensagem(titulo: string, mensagem: string, tipo: 'sucesso' | 'erro'): void {
    this.tituloModal = titulo;
    this.mensagemModal = mensagem;
    this.tipoMensagem = tipo;

    const modalElement = document.getElementById('mensagemModal');
    if (modalElement) {
      modalElement.classList.add('show');
      modalElement.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  fecharModalMensagem(): void {
    const modalElement = document.getElementById('mensagemModal');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
    this.router.navigate(['/autores/listar']);
  }
}
