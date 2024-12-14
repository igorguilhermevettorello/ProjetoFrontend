import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: "autores", loadChildren: () => import("../app/routes/autores/autores.module").then(m => m.AutoresModule) },
  { path: 'assuntos', loadChildren: () => import("../app/routes/assuntos/assuntos.module").then(m => m.AssuntosModule) },
  { path: 'livros', loadChildren: () => import("../app/routes/livros/livros.module").then(m => m.LivrosModule) },
  { path: '**', redirectTo: 'livros/listar' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
