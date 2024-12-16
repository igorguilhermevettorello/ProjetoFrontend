import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monetario'
})
export class MonetarioPipe implements PipeTransform {

  transform(value: number | string): string {
    if (value === null || value === undefined) {
      return '';
    }

    // Converte para número e aplica a formatação BRL
    const numero = typeof value === 'string' ? parseFloat(value) : value;

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numero);
  }

}
