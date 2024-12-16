import { Component, OnInit } from '@angular/core';
import { AutorService } from 'src/app/services/autor/autor.service'; 
import { ListaAutoresModel } from 'src/app/interfaces/autores/lista.autores.model'; 

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {

  autores: ListaAutoresModel[] = [];
  loading: boolean = false; 
  mensagemErro: string = ''; 
  autorSelecionadoId: string = '';

  tituloModal: string = 'Mensagem'; 
  mensagemModal: string = '';  
  tipoMensagem: string = '';  

  constructor(private autorService: AutorService) {}

  ngOnInit(): void {
    this.carregarAutores();
  }

  carregarAutores(): void {
    this.loading = true;
    this.mensagemErro = '';

    this.autorService.listarAutores().subscribe({
      next: (resposta) => {
        this.autores = resposta;
        this.loading = false;
      },
      error: (error) => {
        this.mensagemErro = 'Erro ao carregar autores. Tente novamente.';
        console.error(error);
        this.loading = false;
      }
    });
  }

  abrirModalDeletar(id: string): void {
    this.autorSelecionadoId = id;
    const modal = document.getElementById('modalDeletar');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  fecharModal(): void {
    const modal = document.getElementById('modalDeletar');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  confirmarDelecao(): void {
    this.autorService.deletarAutor(this.autorSelecionadoId).subscribe({
      next: () => {
        this.fecharModal();
        this.abrirModalMensagem('Sucesso', 'Autor deletado com sucesso!', 'sucesso');
        this.carregarAutores();
      },
      error: (error) => {
        this.fecharModal();
        this.abrirModalMensagem('Mensagem', `Erro ao deletar autor: ${JSON.stringify(error)}` , 'erro');
      }
    });
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
  }
}
