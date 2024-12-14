import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssuntoService } from 'src/app/services/assunto/assunto.service'; 
import { CriarAssuntoModel } from 'src/app/interfaces/assuntos/criar.assunto.model'; 
import { ListaAssuntosModel } from 'src/app/interfaces/assuntos/lista.assuntos.model';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.css']
})
export class CadastrarComponent implements OnInit {

  descricao: string = ''; 
  erroDescricao: boolean = false; 
  loading: boolean = false;
  mensagemErro: string = ''; 
  sucesso: string = ''; 
  assuntoId: string | null = null;

  constructor(
    private assuntoService: AssuntoService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.assuntoId = this.route.snapshot.paramMap.get('id');
    if (this.assuntoId) {
      this.carregarAutor();
    }
  }

  carregarAutor(): void {
    this.loading = true;
    this.assuntoService.obterAssuntoPorId(this.assuntoId!).subscribe({
      next: (autor: ListaAssuntosModel) => {
        this.descricao = autor.descricao;
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

    if (!this.descricao.trim()) {
      this.erroDescricao = true;
      return;
    }

    this.loading = true;

    if (this.assuntoId) {
      const assunto: ListaAssuntosModel = { 
        id: this.assuntoId,
        descricao: this.descricao 
      }
      this.assuntoService.editarAssunto(this.assuntoId, assunto).subscribe({
        next: () => {
          this.loading = false;
          this.sucesso = 'Autor atualizado com sucesso!';
          this.router.navigate(['/assuntos/listar']);
        },
        error: (error) => {
          console.error('Erro ao atualizar autor:', error);
          this.mensagemErro = 'Erro ao atualizar o autor.';
          this.loading = false;
        }
      });
    } else {
      const autor: CriarAssuntoModel = { descricao: this.descricao };
      this.assuntoService.salvarAssunto(autor).subscribe({
        next: () => {
          this.loading = false;
          this.sucesso = 'Autor salvo com sucesso!';
          this.router.navigate(['/assuntos/listar']);
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
    this.erroDescricao = false; // Oculta a mensagem de erro
  }

}
