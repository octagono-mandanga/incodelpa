import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'round'
})
export class RoundPipe implements PipeTransform {

  transform(value: number, digits?: number): string {
    const factor = Math.pow(10, digits || 0); // Cambiado a 0 para comportarse correctamente cuando digits no se proporciona
    let result = (Math.round(value * factor) / factor).toString();

    // Si no se especifican dígitos, o se especifica como 0, y el resultado no tiene decimales, agrega ".0"
    if (!result.includes('.')) {
      result += '.0';
    }
    if(result==='0.0')
      result = '0'
    return result;
  }
}
