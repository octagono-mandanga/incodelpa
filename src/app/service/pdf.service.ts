import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { TDocumentDefinitions, Content, ContentColumns } from 'pdfmake/interfaces';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  public logoColegio: string | undefined;
  public logo: string | undefined;

  constructor() {
    this.loadLogos();
  }

  async loadLogos() {
    this.logoColegio = await this.getImageBase64('assets/images/logocolegio.png');
    this.logo = await this.getImageBase64('assets/images/logo.png');
  }

  async getImageBase64(path: string): Promise<string> {
    // Convertir imagen a base64 usando FileReader
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onload = function() {
        var reader = new FileReader();
        reader.onloadend = function() {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = reject;
      xhr.open('GET', path);
      xhr.responseType = 'blob';
      xhr.send();
    });
  }

  async formatDate(d: any) {
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

    return days[d.getDay()] + ", " + d.getDate() + " de " + months[d.getMonth()] + " de " + d.getFullYear() + '\nDocumento Generado con la tecnología mandanga.co';
  }
  getDocumentDefinition(title: string, data: any): TDocumentDefinitions {
    return {
      pageSize: 'LETTER',
      pageMargins: [40, 105, 40, 60],
      background: (currentPag, pageSize) => {
        return {
          canvas: [
            {
              type: 'rect',
              x: 20,
              y: 20,
              w: pageSize.width - 40,
              h: pageSize.height - 40,
              lineWidth: 1,
              lineColor: 'black',
            }
          ],
        };
      },
      header: (currentPage: number, pageCount: number): Content => {
        return {
          columns: [
            {
              image: this.logoColegio,
              width: 50,
              margin: [40, 30, 0, 0]
            },
            {
              text: 'Some text here', // ejemplo de columna con texto
              style: { bold: true, fontSize: 12 }
            }
          ],
          columnGap: 10
        } as ContentColumns; // Asegúrate de castear correctamente
      },
      footer: (currentPage: number, pageCount: number): Content => {
        return {
          columns: [
            { image: this.logo, width: 72, margin: [0, 10, 0, 0] }
          ],
          margin: [40, 0]
        } as ContentColumns; // Cast como ContentColumns
      },
      content: [] // Add the 'content' property with an empty array
    };
  }


  generatePDF(title: string, data: any) {
    const documentDefinition = this.getDocumentDefinition(title, data);
    pdfMake.createPdf(documentDefinition).download('output.pdf');
  }
}
