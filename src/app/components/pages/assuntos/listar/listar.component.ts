import { Component, OnInit } from '@angular/core';
import { AssuntoService } from 'src/app/services/assunto/assunto.service'; 
import { ListaAssuntosModel } from 'src/app/interfaces/assuntos/lista.assuntos.model'; 

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {

  assuntos: ListaAssuntosModel[] = [];
  loading: boolean = false; 
  mensagemErro: string = ''; 
  assuntoSelecionadoId: string = '';

  tituloModal: string = 'Mensagem'; 
  mensagemModal: string = '';  
  tipoMensagem: string = '';  

  constructor(private assuntoService: AssuntoService) {}

  ngOnInit(): void {
    this.carregarAssuntos();
  }

  carregarAssuntos(): void {
    this.loading = true;
    this.mensagemErro = '';

    this.assuntoService.listarAssuntos().subscribe({
      next: (resposta) => {
        this.assuntos = resposta;
        this.loading = false;
      },
      error: (error) => {
        this.mensagemErro = 'Erro ao carregar assuntos. Tente novamente.';
        console.error(error);
        this.loading = false;
      }
    });
  }

  abrirModalDeletar(id: string): void {
    this.assuntoSelecionadoId = id;
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
    this.assuntoService.deletarAssunto(this.assuntoSelecionadoId).subscribe({
      next: () => {
        this.fecharModal();
        this.abrirModalMensagem('Sucesso', 'O assunto deletado com sucesso!', 'sucesso');
        this.carregarAssuntos(); 
      },
      error: (error) => {
        this.fecharModal();
        this.abrirModalMensagem('Mensagem', `Erro ao deletar assunto: ${JSON.stringify(error)}` , 'erro');
        console.error('Erro ao deletar assunto:', error);
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
