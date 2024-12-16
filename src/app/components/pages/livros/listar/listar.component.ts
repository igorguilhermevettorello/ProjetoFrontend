import { Component, OnInit } from '@angular/core';
import { LivroService } from 'src/app/services/livro/livro.service'; 
import { ListaLivrosModel } from 'src/app/interfaces/livros/lista.livros.model'; 

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {

  livros: ListaLivrosModel[] = [];
  loading: boolean = false; 
  mensagemErro: string = ''; 
  livroSelecionadoId: string = '';

  constructor(private livroService: LivroService) { }

  ngOnInit(): void {
    this.carregarLivros();
  }

  carregarLivros(): void {
    this.loading = true;
    this.mensagemErro = '';

    this.livroService.listarLivros().subscribe({
      next: (resposta) => {
        this.livros = resposta;
        this.loading = false;
      },
      error: (error) => {
        this.mensagemErro = 'Erro ao carregar livros. Tente novamente.';
        console.error(error);
        this.loading = false;
      }
    });
  }

  abrirModalDeletar(id: string): void {
    this.livroSelecionadoId = id;
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
    this.livroService.deletarLivro(this.livroSelecionadoId).subscribe({
      next: () => {
        console.log('Livro deletado com sucesso!');
        this.fecharModal();
        this.carregarLivros();
      },
      error: (error) => {
        console.error('Erro ao deletar livro:', error);
        this.fecharModal();
      }
    });
  }

  downloadArquivo(): void {
    this.livroService.gerarArquivo().subscribe({
      next: (data: Blob) => {
        // Cria um link temporário para o download
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'arquivo-gerado.pdf'; // Nome do arquivo (ajuste conforme necessário)
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url); // Libera o recurso
        document.body.removeChild(a);
        console.log('Download realizado com sucesso.');
      },
      error: (err) => {
        console.error('Erro ao gerar o arquivo:', err);
      }
    });
  }
}
