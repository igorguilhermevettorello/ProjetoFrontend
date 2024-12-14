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
        console.log('Autor deletado com sucesso!');
        this.fecharModal();
        this.carregarAutores();
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
