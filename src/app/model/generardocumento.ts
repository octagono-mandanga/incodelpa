/**
 * Esta Clase maneja toda la logica para generar documentos
 */

import { Asignacion } from "./asignacion";
import { Curso } from "./curso";
import { User } from "./user";

/** Esta funcion toma una imagen pnh o jpg y la convierte a base64 para poder imprimirla */
function getImageBase64(url: string): Promise<string> {
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
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  });
}

/**
 *
 * @param d recibe una  fecha
 * @returns Un String con la fecha y mensae de generacion
 */

function formatDate(d: any) {
  const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  return days[d.getDay()] + ", " + d.getDate() + " de " + months[d.getMonth()] + " de " + d.getFullYear() + '\nDocumento Generado con la tecnología mandanga.co';
}

function styledHead(text: any) {
  return {
    text: text.toString(), // Asegurarse de que el texto sea una cadena
    bold: true,
    fontSize: 9,
    color: 'black'
  };
}

function styledCell(text: any) {
  return {
    text: text.toString(), // Asegurarse de que el texto sea una cadena
    bold: false,
    fontSize: 9,
    color: 'black'
  };
}


/** Asistencia  con cuadross */
function crearAsignacion(asignacion: Asignacion, matriculados: User[], curso: Curso, logoColegio: any, logo: any){
  const alumnos = matriculados.map((item, index) => {
    // Construye la fila con el nombre completo y luego agrega 10 celdas vacías.
    return [
      styledCell((index + 1)),
      styledCell((item.alumno.codigo)),
      styledCell(item.primer_apellido.toUpperCase() + ' ' + item.segundo_apellido.toUpperCase()  + ' ' + item.primer_nombre.toUpperCase()  + ' ' + item.segundo_nombre.toUpperCase() ),
      ...Array(10).fill(styledCell(' ')), // Esto genera 10 celdas vacías
    ];
  });
  return [
    {
      columns: [
        {
          stack: [
            { text: 'Materia', fontSize: 8, color: '#aaaaaa' },
            { text: asignacion.materia.nombre.toUpperCase(), fontSize: 9, bold: true, fillColor: ['stripe45d', 'blue'] },
          ],
        },
        {
          stack: [
            { text: 'Docente', fontSize: 8, color: '#aaaaaa' },
            { text: asignacion.docente.primer_nombre.toUpperCase()+' '+asignacion.docente.primer_apellido.toUpperCase() , fontSize: 8, bold: true},
          ],
        },
        {
          stack: [
            { text: 'Grado', fontSize: 8, color: '#aaaaaa' },
            { text: curso.grado.nombre.toUpperCase(), fontSize: 8, bold: true },
          ],
        },
        {
          stack: [
            { text: 'Sede', fontSize: 8, color: '#aaaaaa' },
            { text: curso.sede.nombre.toUpperCase(), fontSize: 8, bold: true },

          ],
        },
      ],
      margin: [0, 0, 0, 8]
    },
    {
      style: 'tableExample',
      table: {
        headerRows: 1,
        // Asegúrate de tener la cantidad correcta de anchuras para todas las columnas que necesitas
        widths: ['auto', 'auto', 'auto', ...Array(10).fill('*')], // 'auto' para el nombre, '*' para las celdas vacías

        body: [
          // Encabezados con una celda para el nombre y 10 celdas para los espacios en blanco
          [
            styledHead('No.'),
            styledHead('Código'),
            styledHead('Nombre Completo'),
            ...Array(10).fill(styledHead(' ') ) // Aplica estilos a las celdas del encabezado también
          ],
          ...alumnos
        ]
      },
      layout: {
        hLineWidth: function(i: any, node: any) {
          return 0.1; // Líneas horizontales más delgadas
        },
        vLineWidth: function(i: any, node: any) {
          return 0.1; // Líneas verticales más delgadas
        },
        fillColor: function (rowIndex: any) {
          return (rowIndex % 2 === 0) ? '#EAEAEA' : null;
        }
      }
    }
  ]
}

/** Asistencia sin cuadros */
function crearAsignacionGeneral(asignacion: Asignacion, matriculados: User[], curso: Curso, logoColegio: any, logo: any){
  const alumnos = matriculados.map((item, index) => {
    // Construye la fila con el nombre completo y luego agrega 10 celdas vacías.
    return [
      styledCell((index + 1)),
      styledCell((item.alumno.codigo)),
      styledCell(item.primer_apellido.toUpperCase() + ' ' + item.segundo_apellido.toUpperCase()  + ' ' + item.primer_nombre.toUpperCase()  + ' ' + item.segundo_nombre.toUpperCase() ),
      ...Array(10).fill(styledCell(' ')), // Esto genera 10 celdas vacías
    ];
  });
  return [
    {
      columns: [
        {
          stack: [
            { text: 'Materia', fontSize: 8, color: '#aaaaaa' },
            { text: asignacion.materia.nombre.toUpperCase(), fontSize: 9, bold: true, fillColor: ['stripe45d', 'blue'] },
          ],
        },
        {
          stack: [
            { text: 'Docente', fontSize: 8, color: '#aaaaaa' },
            { text: asignacion.docente.primer_nombre.toUpperCase()+' '+asignacion.docente.primer_apellido.toUpperCase() , fontSize: 8, bold: true},
          ],
        },
        {
          stack: [
            { text: 'Grado', fontSize: 8, color: '#aaaaaa' },
            { text: curso.grado.nombre.toUpperCase(), fontSize: 8, bold: true },
          ],
        },
        {
          stack: [
            { text: 'Sede', fontSize: 8, color: '#aaaaaa' },
            { text: curso.sede.nombre.toUpperCase(), fontSize: 8, bold: true },

          ],
        },
      ],
      margin: [0, 0, 0, 8]
    },
    {
      style: 'tableExample',
      table: {
        headerRows: 1,
        // Asegúrate de tener la cantidad correcta de anchuras para todas las columnas que necesitas
        widths: ['auto', 'auto', 'auto', ...Array(10).fill('*')], // 'auto' para el nombre, '*' para las celdas vacías

        body: [
          // Encabezados con una celda para el nombre y 10 celdas para los espacios en blanco
          [
            styledHead('No.'),
            styledHead('Código'),
            styledHead('Nombre Completo'),
            ...Array(10).fill(styledHead(' ') ) // Aplica estilos a las celdas del encabezado también
          ],
          ...alumnos
        ]
      },
      layout: {
        hLineWidth: function (i: any, node: any) {
          if (i === 0 || i === node.table.body.length) {
            return 0;
          }
          return (i === node.table.headerRows) ? 2 : 1;
        },
        vLineWidth: function (i: any) {
          return 0;
        },
        hLineColor: function (i: any) {
          return i === 1 ? 'black' : '#aaa';
        },
        fillColor: function (rowIndex: any) {
          return (rowIndex % 2 === 0) ? '#EAEAEA' : null;
        }
      }
    }
  ]
}


export class Documento {
  public def: any;
  public User!: User
  constructor(){
    //this.User = data
  }

  /**
   * @param matriculados relacion de estudiantes matriculados en un curso
   * @param curso Curso del que estamos hablando
   *
   * Genera el listado de alumno, een  la  cabecera el nombre del director de curso
  */
  async listado(matriculados: User[], curso: Curso){
    const alumnos = matriculados.map((item, index) => {
      // Construye la fila con el nombre completo y luego agrega 10 celdas vacías.
      return [
        styledCell((index + 1)),
        styledCell((item.alumno.codigo)),
        styledCell(item.primer_apellido.toUpperCase() + ' ' + item.segundo_apellido.toUpperCase()  + ' ' + item.primer_nombre.toUpperCase()  + ' ' + item.segundo_nombre.toUpperCase() ),
        ...Array(10).fill(styledCell(' ')), // Esto genera 10 celdas vacías
      ];
    });

    const logoColegioOriginal = 'assets/images/logocolegio.png'; // URL de la imagen
    const logoColegio = await getImageBase64(logoColegioOriginal);
    const logoOriginal = 'assets/images/logo.png'; // URL de la imagen
    const logo = await getImageBase64(logoOriginal);

    this.def = {
      pageSize: 'LETTER',
      pageMargins: [40, 105, 40, 60], // [left, top, right, bottom]
      background: function(currentPag: any, pageSize: any) {
        return {
          canvas: [
            {
              type: 'rect',
              x: 20,
              y: 20,
              w: pageSize.width-40,
              h: pageSize.height-40,
              lineWidth: 1,
              lineColor: 'black',
            }
          ],
        };
      },
      header: function(currentPage: any, pageCount: any) {
        return {
          columns: [
            {
              image: logoColegio,
              width: 50,
              margin: [40, 30, 0, 0]
            },
            {
              stack: [
                { text: 'INSTITUTO COMERCIAL DEL PACIFICO', bold: true, fontSize: 14 },
                { text: 'Resolución No. 0602 de Agosto 28 del 2006,  Dane No. 376109006564', italics: true, fontSize: 10 },
                { text: 'Calle 2a Nº 47-3 Bellavista 2444527 - 2440306', fontSize: 10 },
                { text: 'incodelpa.com - NIT.800.158.455-9', fontSize: 10 }
              ],
              margin: [45, 30, 35, 0], // Ajusta según sea necesario
              width: 'auto'
            },
            {
              width: '*', // Usa '*' o 'auto' para que tome el espacio mínimo necesario
              stack: [
                { text: 'Listado', bold: true, fontSize: 10 },
                { text: 'Alumnos', bold: true, fontSize: 9 }
              ],
              alignment: 'center',
              margin: [0, 30, 40, 0] // Ajusta la posición del texto [left, top, right, bottom]
            }
          ],
          // Definición de los anchos de cada columna
          columnGap: 10
        };
      },

      footer: function(currentPage: any, pageCount: any) {
        return {
          columns: [
            {
              image: logo,
              width: 72, // Ajusta esto según el tamaño que necesites
              margin: [0, 15, 0, 0] // Ajusta la posición del logo [left, top, right, bottom]
            },
            {
              text: formatDate(new Date()),
              alignment: 'right',
              fontSize: 8,
              color: '#aaaaaa',
              margin: [0, 10, 0, 0] // Ajusta la posición del texto [left, top, right, bottom]
            }
          ],
          margin: [40, 0] // Márgenes generales del footer [horizontal, vertical]
        };
      },
      content: [
        {
          columns: [
            {
              stack: [
                { text: 'Director', fontSize: 8, color: '#aaaaaa' },
                { text: curso.director.primer_nombre.toUpperCase()+' '+curso.director.primer_apellido.toUpperCase() , fontSize: 8, bold: true},
              ],
            },
            {
              stack: [
                { text: 'Curso', fontSize: 8, color: '#aaaaaa' },
                { text: curso.nombre.toUpperCase(), fontSize: 8, bold: true, fillColor: ['stripe45d', 'blue'] },
              ],
            },
            {
              stack: [
                { text: 'Grado', fontSize: 8, color: '#aaaaaa' },
                { text: curso.grado.nombre.toUpperCase(), fontSize: 8, bold: true },
              ],
            },
            {
              stack: [
                { text: 'Sede', fontSize: 8, color: '#aaaaaa' },
                { text: curso.sede.nombre.toUpperCase(), fontSize: 8, bold: true },

              ],
            },
          ],
          margin: [0, 0, 0, 8]
        },
        {
          style: 'tableExample',
          table: {
            headerRows: 1,
            // Asegúrate de tener la cantidad correcta de anchuras para todas las columnas que necesitas
            widths: ['auto', 'auto', 'auto', ...Array(10).fill('*')], // 'auto' para el nombre, '*' para las celdas vacías

            body: [
              // Encabezados con una celda para el nombre y 10 celdas para los espacios en blanco
              [
                styledHead('No.'),
                styledHead('Código'),
                styledHead('Nombre Completo'),
                ...Array(10).fill(styledHead(' ') ) // Aplica estilos a las celdas del encabezado también
              ],
              ...alumnos
            ]
          },
          layout: {
            hLineWidth: function(i: any, node: any) {
              return 0.1; // Líneas horizontales más delgadas
            },
            vLineWidth: function(i: any, node: any) {
              return 0.1; // Líneas verticales más delgadas
            },
            fillColor: function (rowIndex: any) {
              return (rowIndex % 2 === 0) ? '#EAEAEA' : null;
            }
          }
        }
      ],
      styles: {
        tableHeader: {
          bold: true,
          fontSize: 8,
          color: 'black'
        },

        // Otros estilos según sea necesario
      }
    };
  }

  /**
   *
   * Genera el listado de alumnos para cada asignatura
   *
   * @param matriculados relacion de estudiantes matriculados en un curso
   * @param curso Curso del que estamos hablando
   *
  */

  async asignaciones(asignaciones: Asignacion[], matriculados: User[], curso: Curso){



    const logoColegioOriginal = 'assets/images/logocolegio.png'; // URL de la imagen
    const logoColegio = await getImageBase64(logoColegioOriginal);
    const logoOriginal = 'assets/images/logo.png'; // URL de la imagen
    const logo = await getImageBase64(logoOriginal);

    this.def = {
      pageSize: 'LETTER',
      pageMargins: [40, 105, 40, 60], // [left, top, right, bottom]
      background: function(currentPag: any, pageSize: any) {
        return {
          canvas: [
            {
              type: 'rect',
              x: 20,
              y: 20,
              w: pageSize.width-40,
              h: pageSize.height-40,
              lineWidth: 1,
              lineColor: 'black',
            }
          ],
        };
      },
      header: function(currentPage: any, pageCount: any) {
        return {
          columns: [
            {
              image: logoColegio,
              width: 50,
              margin: [40, 30, 0, 0]
            },
            {
              stack: [
                { text: 'INSTITUTO COMERCIAL DEL PACIFICO', bold: true, fontSize: 14 },
                { text: 'Resolución No. 0602 de Agosto 28 del 2006,  Dane No. 376109006564', italics: true, fontSize: 10 },
                { text: 'Calle 2a Nº 47-3 Bellavista 2444527 - 2440306', fontSize: 10 },
                { text: 'incodelpa.com - NIT.800.158.455-9', fontSize: 10 }
              ],
              margin: [45, 30, 35, 0], // Ajusta según sea necesario
              width: 'auto'
            },
            {
              width: '*', // Usa '*' o 'auto' para que tome el espacio mínimo necesario
              stack: [
                { text: 'Asistencia', fontSize:  8},
                { text: 'Listado', bold: true, fontSize: 10 },
                { text: curso.nombre.toUpperCase(), bold: true, fontSize: 10 }
              ],
              alignment: 'center',
              margin: [0, 30, 40, 0] // Ajusta la posición del texto [left, top, right, bottom]
            }
          ],
          // Definición de los anchos de cada columna
          columnGap: 10
        };
      },

      footer: function(currentPage: any, pageCount: any) {
        return {
          columns: [
            {
              image: logo,
              width: 72, // Ajusta esto según el tamaño que necesites
              margin: [0, 15, 0, 0] // Ajusta la posición del logo [left, top, right, bottom]
            },
            {
              text: formatDate(new Date()),
              alignment: 'right',
              fontSize: 8,
              color: '#aaaaaa',
              margin: [0, 10, 0, 0] // Ajusta la posición del texto [left, top, right, bottom]
            }
          ],
          margin: [40, 0] // Márgenes generales del footer [horizontal, vertical]
        };
      },
      content: [ ],
      styles: {
        tableHeader: {
          bold: true,
          fontSize: 8,
          color: 'black'
        },

        // Otros estilos según sea necesario
      }
    };

    asignaciones.forEach((asignacion, index) => {
      // Aquí añades el título de la asignación y la tabla de alumnos correspondiente
      // Si no es la primera asignación, agrega un salto de página antes de la nueva sección
      if (index > 0) {
        this.def.content.push({ text: '', pageBreak: 'before' });
      }

      this.def.content.push(
        ...crearAsignacion(asignacion, matriculados, curso, logoColegio, logo)
      );
    });

  }




  async listadoGeneral(asignaciones: Asignacion[], matriculados: User[], curso: Curso){
    const logoColegioOriginal = 'assets/images/logocolegio.png'; // URL de la imagen
    const logoColegio = await getImageBase64(logoColegioOriginal);
    const logoOriginal = 'assets/images/logo.png'; // URL de la imagen
    const logo = await getImageBase64(logoOriginal);

    this.def = {
      pageSize: 'LETTER',
      pageMargins: [40, 105, 40, 60], // [left, top, right, bottom]
      background: function(currentPag: any, pageSize: any) {
        return {
          canvas: [
            {
              type: 'rect',
              x: 20,
              y: 20,
              w: pageSize.width-40,
              h: pageSize.height-40,
              lineWidth: 1,
              lineColor: 'black',
            }
          ],
        };
      },
      header: function(currentPage: any, pageCount: any) {
        return {
          columns: [
            {
              image: logoColegio,
              width: 50,
              margin: [40, 30, 0, 0]
            },
            {
              stack: [
                { text: 'INSTITUTO COMERCIAL DEL PACIFICO', bold: true, fontSize: 14 },
                { text: 'Resolución No. 0602 de Agosto 28 del 2006,  Dane No. 376109006564', italics: true, fontSize: 10 },
                { text: 'Calle 2a Nº 47-3 Bellavista 2444527 - 2440306', fontSize: 10 },
                { text: 'incodelpa.com - NIT.800.158.455-9', fontSize: 10 }
              ],
              margin: [45, 30, 35, 0], // Ajusta según sea necesario
              width: 'auto'
            },
            {
              width: '*', // Usa '*' o 'auto' para que tome el espacio mínimo necesario
              stack: [
                { text: 'Listado', fontSize:  8},
                { text: curso.nombre.toUpperCase(), bold: true, fontSize: 10 }
              ],
              alignment: 'center',
              margin: [0, 30, 40, 0] // Ajusta la posición del texto [left, top, right, bottom]
            }
          ],
          // Definición de los anchos de cada columna
          columnGap: 10
        };
      },

      footer: function(currentPage: any, pageCount: any) {
        return {
          columns: [
            {
              image: logo,
              width: 72, // Ajusta esto según el tamaño que necesites
              margin: [0, 15, 0, 0] // Ajusta la posición del logo [left, top, right, bottom]
            },
            {
              text: formatDate(new Date()),
              alignment: 'right',
              fontSize: 8,
              color: '#aaaaaa',
              margin: [0, 10, 0, 0] // Ajusta la posición del texto [left, top, right, bottom]
            }
          ],
          margin: [40, 0] // Márgenes generales del footer [horizontal, vertical]
        };
      },
      content: [ ],
      styles: {
        tableHeader: {
          bold: true,
          fontSize: 8,
          color: 'black'
        },

        // Otros estilos según sea necesario
      }
    };

    asignaciones.forEach((asignacion, index) => {
      // Aquí añades el título de la asignación y la tabla de alumnos correspondiente
      // Si no es la primera asignación, agrega un salto de página antes de la nueva sección
      if (index > 0) {
        this.def.content.push({ text: '', pageBreak: 'before' });
      }

      this.def.content.push(
        ...crearAsignacionGeneral(asignacion, matriculados, curso, logoColegio, logo)
      );
    });

  }



}
