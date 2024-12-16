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

  tituloModal: string = 'Mensagem'; 
  mensagemModal: string = '';  
  tipoMensagem: string = '';  

  constructor(
    private assuntoService: AssuntoService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.assuntoId = this.route.snapshot.paramMap.get('id');
    if (this.assuntoId) {
      this.carregarAssunto();
    }
  }

  carregarAssunto(): void {
    this.loading = true;
    this.assuntoService.obterAssuntoPorId(this.assuntoId!).subscribe({
      next: (assunto: ListaAssuntosModel) => {
        this.descricao = assunto.descricao;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar assunto:', error);
        this.mensagemErro = 'Erro ao carregar os dados do assunto.';
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
          this.abrirModalMensagem('Sucesso', 'O assunto foi atualizado com sucesso!', 'sucesso');
        },
        error: (error) => {
          this.loading = false;
          this.abrirModalMensagem('Mensagem', `Erro ao atualizar assunto: ${JSON.stringify(error)}` , 'erro');
          console.error('Erro ao atualizar assunto:', error);
        }
      });
    } else {
      const assunto: CriarAssuntoModel = { descricao: this.descricao };
      this.assuntoService.salvarAssunto(assunto).subscribe({
        next: () => {
          this.loading = false;
          this.abrirModalMensagem('Sucesso', 'Assunto salvo com sucesso', 'sucesso');
        },
        error: (error) => {
          this.loading = false;
          this.abrirModalMensagem('Mensagem', `Erro ao salvar assunto: ${JSON.stringify(error)}` , 'erro');
          console.error('Erro ao salvar assunto:', error);
        }
      });
    }
  }
  
  onFocus(): void {
    this.erroDescricao = false; 
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
    this.router.navigate(['/assuntos/listar']);
  }
}
