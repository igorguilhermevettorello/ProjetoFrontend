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
  autorSelecionadoId: string = '';

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
    this.assuntoService.deletarAssunto(this.autorSelecionadoId).subscribe({
      next: () => {
        console.log('Autor deletado com sucesso!');
        this.fecharModal();
        this.carregarAssuntos(); 
      },
      error: (error) => {
        console.error('Erro ao deletar autor:', error);
        this.fecharModal();
      }
    });
  }

  // // Placeholder para editar autor
  // editarAutor(id: string): void {
  //   console.log(`Editar autor com ID: ${id}`);
  //   // Aqui você pode navegar para a página de edição
  // }

  // // Placeholder para deletar autor
  // deletarAutor(id: string): void {
  //   console.log(`Deletar autor com ID: ${id}`);
  //   // Aqui você pode chamar um método do serviço para deletar o autor
  // }
}
