import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CadastrarComponent } from 'src/app/components/pages/livros/cadastrar/cadastrar.component';
import { ListarComponent } from 'src/app/components/pages/livros/listar/listar.component'; 

const routes: Routes = [
  { path: 'cadastrar', component: CadastrarComponent },
  { path: 'editar/:id', component: CadastrarComponent },
  { path: 'listar', component: ListarComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LivrosRoutingModule { }
