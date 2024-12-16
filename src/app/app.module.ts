import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CurrencyMaskModule } from 'ng2-currency-mask';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CadastrarComponent as CadastrarAutoresComponent} from './components/pages/autores/cadastrar/cadastrar.component';
import { ListarComponent as ListarAutoresComponent} from './components/pages/autores/listar/listar.component';
import { CadastrarComponent as CadastrarAssuntosComponent} from './components/pages/assuntos/cadastrar/cadastrar.component';
import { ListarComponent as ListarAssuntosComponent} from './components/pages/assuntos/listar/listar.component';
import { CadastrarComponent as CadastrarLivrosComponent} from './components/pages/livros/cadastrar/cadastrar.component';
import { ListarComponent as ListarLivrosComponent} from './components/pages/livros/listar/listar.component';
import { MonetarioPipe } from './pipes/monetario.pipe';

@NgModule({
  declarations: [
    AppComponent,
    CadastrarAutoresComponent,
    ListarAutoresComponent,
    CadastrarAssuntosComponent,
    ListarAssuntosComponent,
    CadastrarLivrosComponent,
    ListarLivrosComponent,
    MonetarioPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CurrencyMaskModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
