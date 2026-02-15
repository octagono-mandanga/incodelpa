import { Boletin } from 'src/app/model/boletin';
import { environment } from 'src/environments/environment.development';
/**
 * Esta Clase maneja toda la logica para generar documentos
 */

import { Asignacion } from "./asignacion";
import { Curso } from "./curso";
import { User } from "./user";
import { Consolidado } from './consolidado';
import { Listado } from './docs/listado';
import { Periodo } from './periodo';
import { Materia } from './materia';
import { ConsolidadoCurso, IAreaProcesada } from './docs/consolidadoCurso';


/** En esta sección se definen las funciones relacionadas:
 * 1. Cargar Logo Colegio
 * 2. Cargar Logo Octagono
 * 3. Base64 de una imagen
 * 2. Background página
 * 3. Encabezado (Header)
 * 4. Pie de página (Footer)
 */
async function getLogoColegio() {
  return await getImageBase64('assets/images/logocolegio.png');
}

async function getLogoOctagono() {
  return await getImageBase64('assets/images/logo.png');
}

function getImageBase64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
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

function backgroundPage(currentPag: any, pageSize: any) {
  return {
    canvas: [
      {
        type: 'rect',
        x: 20,
        y: 20,
        w: pageSize.width - 40,
        h: pageSize.height - 40,
        lineWidth: 1,
        lineColor: '#AAAAAA',
      }
    ],
  };
};

// Custom header for Puestos report matching Boletin Individual
function headerPagePuestos(logoColegio: any) {
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
        margin: [45, 30, 35, 0],
        width: 'auto'
      },
      {
        width: '*',
        stack: [
          { text: 'Reporte de', bold: true, fontSize: 12 },
          { text: 'Puestos', bold: true, fontSize: 10 },
        ],
        alignment: 'center',
        margin: [0, 30, 40, 0]
      }
    ],
    columnGap: 10,
    margin: [0, 0, 0, 10]
  };
};

function headerPage(title: string, logoColegio: any) {
  return {
    columns: [
      {
        image: logoColegio,
        width: 50,
        margin: [40, 30, 0, 0]
      },
      {
        stack: [
          { text: environment.instituto.nombre, bold: true, fontSize: 14 },
          { text: environment.instituto.resolucion, italics: true, fontSize: 10 },
          { text: environment.instituto.direccion, fontSize: 10 },
          { text: environment.instituto.web + ' ' + environment.instituto.nit, fontSize: 10 }
        ],
        margin: [45, 30, 35, 0], // Ajusta según sea necesario
        width: 'auto'
      },
      {
        width: '*', // Usa '*' o 'auto' para que tome el espacio mínimo necesario
        stack: [
          { text: title, bold: true, fontSize: 12 },
        ],
        alignment: 'center',
        margin: [0, 30, 40, 0] // Ajusta la posición del texto [left, top, right, bottom]
      }
    ],
    columnGap: 10
  };
};

function footerPage(logo: any) {
  return {
    margin: [40, 0],
    columns: [
      {
        image: logo,
        width: 72,
        alignment: 'center',
      },
      {
        text: formatDate(new Date()),
        alignment: 'right',
        fontSize: 8,
        color: '#aaaaaa',
        margin: [0, 10, 0, 0] // Ajusta la posición del texto [left, top, right, bottom]
      }
    ],
  };
};



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

function styledHead(text: any, alignment: string = 'left') {
  return {
    text: text.toString(), // Asegurarse de que el texto sea una cadena
    bold: true,
    fontSize: 9,
    color: 'black',
    alignment: alignment
  };
}

function styledCell(text: any, alignment: string = 'left') {
  return {
    text: text.toString(),
    bold: false,
    fontSize: 9,
    color: 'black',
    alignment: alignment
  };
}

function styledConsolidado(text: any) {
  return {
    text: text.toString(), // Asegurarse de que el texto sea una cadena
    bold: false,
    fontSize: 7,
    color: 'black'
  };
}

/**
 * Abrevia un nombre largo según reglas específicas para la tabla del consolidado.
 * @param nombre El texto a abreviar (ej: "Ciencias Naturales").
 * @returns El nombre abreviado (ej: "CiN").
 */
function abreviarNombre(nombre: string): string {
  if (!nombre) return '';

  // Excluir palabras cortas y comunes del conteo
  const palabrasSignificativas = nombre.split(' ').filter(p => !['y', 'e', 'o', 'u', 'de', 'la', 'los', 'las'].includes(p.toLowerCase()));

  switch (palabrasSignificativas.length) {
    case 1:
      // Una palabra: las tres primeras letras
      return palabrasSignificativas[0].substring(0, 3).toUpperCase();
    case 2:
      // Dos palabras: dos letras de la primera, una de la segunda
      return (palabrasSignificativas[0].substring(0, 2) + palabrasSignificativas[1].substring(0, 1)).toUpperCase();
    case 3:
    default:
      // Tres o más palabras: la primera letra de las primeras tres palabras
      return (palabrasSignificativas[0].charAt(0) + palabrasSignificativas[1].charAt(0) + palabrasSignificativas[2].charAt(0)).toUpperCase();
  }
}

/** Asistencia  con cuadross */
function crearAsignacion(asignacion: Asignacion, matriculados: User[], curso: Curso, logoColegio: any, logo: any) {

  const alumnos = matriculados.map((item, index) => {
    // Construye la fila con el nombre completo y luego agrega 10 celdas vacías.
    const primerApellido = item.alumno.primer_apellido || '';
    const segundoApellido = item.alumno.segundo_apellido || '';
    const primerNombre = item.alumno.primer_nombre || '';
    const segundoNombre = item.alumno.segundo_nombre || '';

    return [
      styledCell((index + 1)),
      styledCell((item.alumno.codigo)),
      styledCell(`${primerApellido.toUpperCase()} ${segundoApellido.toUpperCase()} ${primerNombre.toUpperCase()} ${segundoNombre.toUpperCase()}`),
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
            { text: asignacion.docente.primer_nombre.toUpperCase() + ' ' + asignacion.docente.primer_apellido.toUpperCase(), fontSize: 8, bold: true },
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
            ...Array(10).fill(styledHead(' ')) // Aplica estilos a las celdas del encabezado también
          ],
          ...alumnos
        ]
      },
      layout: {
        hLineWidth: function (i: any, node: any) {
          return 0.1; // Líneas horizontales más delgadas
        },
        vLineWidth: function (i: any, node: any) {
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
function crearAsignacionGeneral(asignacion: Asignacion, matriculados: User[], curso: Curso, logoColegio: any, logo: any) {
  const alumnos = matriculados.map((item, index) => {
    // Construye la fila con el nombre completo y luego agrega 10 celdas vacías.
    const primerApellido = item.alumno.primer_apellido || '';
    const segundoApellido = item.alumno.segundo_apellido || '';
    const primerNombre = item.alumno.primer_nombre || '';
    const segundoNombre = item.alumno.segundo_nombre || '';
    return [
      styledCell((index + 1)),
      styledCell((item.alumno.codigo)),
      styledCell(`${primerApellido.toUpperCase()} ${segundoApellido.toUpperCase()} ${primerNombre.toUpperCase()} ${segundoNombre.toUpperCase()}`),
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
            { text: asignacion.docente.primer_nombre.toUpperCase() + ' ' + asignacion.docente.primer_apellido.toUpperCase(), fontSize: 8, bold: true },
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
            ...Array(10).fill(styledHead(' ')) // Aplica estilos a las celdas del encabezado también
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



/** Asistencia  con cuadross */
function crearAsignaciones(asignacion: Asignacion, matriculados: User[], curso: Curso, logoColegio: any, logo: any, isDocente: boolean = false) {

  const alumnos = matriculados.map((item, index) => {
    // Construye la fila con el nombre completo y luego agrega 10 celdas vacías.
    const primerApellido = item.alumno.primer_apellido || '';
    const segundoApellido = item.alumno.segundo_apellido || '';
    const primerNombre = item.alumno.primer_nombre || '';
    const segundoNombre = item.alumno.segundo_nombre || '';
    return [
      styledCell((index + 1)),
      styledCell((item.alumno.alumno.codigo)),
      styledCell(`${primerApellido.toUpperCase()} ${segundoApellido.toUpperCase()} ${primerNombre.toUpperCase()} ${segundoNombre.toUpperCase()}`),
      ...Array(10).fill(styledCell(' ')), // Esto genera 10 celdas vacías
    ];
  });

  const headerColumns = [];

  // 1. Materia Column
  headerColumns.push({
    stack: [
      { text: 'Materia', fontSize: 8, color: '#aaaaaa' },
      { text: asignacion.materia.nombre.toUpperCase(), fontSize: 9, bold: true, fillColor: ['stripe45d', 'blue'] },
    ],
  });

  // 2. Docente Column (Only provided if NOT in Docente module views)
  if (!isDocente) {
    headerColumns.push({
      stack: [
        { text: 'Docente', fontSize: 8, color: '#aaaaaa' },
        { text: asignacion.docente.primer_nombre.toUpperCase() + ' ' + asignacion.docente.primer_apellido.toUpperCase(), fontSize: 8, bold: true },
      ],
    });
  }

  // 3. Curso Column
  let cursoText = curso.nombre.toUpperCase() + ' [' + curso.grado.nombre.toUpperCase() + ']';
  if (isDocente) {
    // Custom format for Docente module: "COURSE - GRADE"
    cursoText = curso.nombre.toUpperCase() + ' - ' + curso.grado.nombre.toUpperCase();
  }

  headerColumns.push({
    stack: [
      { text: 'Curso', fontSize: 8, color: '#aaaaaa' },
      { text: cursoText, fontSize: 8, bold: true },
    ],
  });


  // 4. Sede Column
  headerColumns.push({
    stack: [
      { text: 'Sede', fontSize: 8, color: '#aaaaaa' },
      { text: curso.sede.nombre.toUpperCase(), fontSize: 8, bold: true },
    ],
  });

  return [
    {
      columns: headerColumns,
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
            ...Array(10).fill(styledHead(' ')) // Aplica estilos a las celdas del encabezado también
          ],
          ...alumnos
        ]
      },
      layout: {
        hLineWidth: function (i: any, node: any) {
          return 0.1; // Líneas horizontales más delgadas
        },
        vLineWidth: function (i: any, node: any) {
          return 0.1; // Líneas verticales más delgadas
        },
        fillColor: function (rowIndex: any) {
          return (rowIndex % 2 === 0) ? '#EAEAEA' : null;
        }
      }
    }
  ]
}

function botetinAlumno(boletin: Boletin) {
  const wd = 35;
  let filasAsignaciones: any[] = [];

  boletin.areas.forEach((area: any) => {
    filasAsignaciones.push([
      {
        text: 'AREA ' + area.nombre.toUpperCase(),
        style: 'areaEtiqueta',
        colSpan: 7,
      },
      {}, {}, {}, {}, {}, {},
      { text: area.promedio['primero'] === 0 ? '' : area.promedio['primero'].toFixed(1), style: 'areaEtiqueta', alignment: 'center', bold: false },
      { text: area.promedio['segundo'] === 0 ? '' : area.promedio['segundo'].toFixed(1), style: 'areaEtiqueta', alignment: 'center', bold: false },
      { text: area.promedio['tercero'] === 0 ? '' : area.promedio['tercero'].toFixed(1), style: 'areaEtiqueta', alignment: 'center', bold: false },
      { text: area.promedio['cuarto'] === 0 ? '' : area.promedio['cuarto'].toFixed(1), style: 'areaEtiqueta', alignment: 'center', bold: false },
      { text: '', style: 'areaEtiqueta', alignment: 'center' } // Completa el colSpan con celdas vacías
    ]);
    area.materias.forEach((materia: any) => {
      let competencias = []
      if (boletin.encabezado.nombre_periodo) {
        if (materia.competencias[boletin.encabezado.nombre_periodo])
          competencias = materia.competencias[boletin.encabezado.nombre_periodo]
      }

      filasAsignaciones.push([
        {
          text: `${materia.nombre.toUpperCase()} [${materia.porcentaje}%] \n${materia.docente}`,
          margin: [0, 5, 0, 5],
          style: 'asignaturaEtiqueta',
          colSpan: 3
        },

        {}, {},

        {
          text: competencias.map((competencia: string) => `- ${competencia.toUpperCase()}`).join('\n'),
          style: 'asignaturaEtiqueta',
          colSpan: 4
        },
        {}, {}, {},

        {
          text: materia.notas['primero'] === 0 ? '' : materia.notas['primero'].toFixed(1),
          margin: [0, 5, 0, 5],
          fontSize: 11,
          bold: true,
          alignment: 'center'
        },
        {
          text: materia.notas['segundo'] === 0 ? '' : materia.notas['segundo'].toFixed(1),
          margin: [0, 5, 0, 5],
          fontSize: 11,
          bold: true,
          alignment: 'center'
        },
        {
          text: materia.notas['tercero'] === 0 ? '' : materia.notas['tercero'].toFixed(1),
          margin: [0, 5, 0, 5],
          fontSize: 11,
          bold: true,
          alignment: 'center'
        },
        {
          text: materia.notas['cuarto'] === 0 ? '' : materia.notas['cuarto'].toFixed(1),
          margin: [0, 5, 0, 5],
          fontSize: 10,
          bold: true,
          alignment: 'center'
        },
        {
          text: '',
          margin: [0, 5, 0, 5],
          fontSize: 10,
          bold: true,
          alignment: 'center'
        },
      ]);
    });
  });

  let contenido: any = [

    {
      style: 'tableExample',
      color: '#222',
      table: {
        widths: [wd, wd, wd, wd, wd, wd, wd, wd, wd, wd, wd, wd],
        body: [
          [
            { text: 'Boletin', style: 'etiqueta', colSpan: 12 },
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {}
          ],
          [
            { text: 'Codigo', style: 'grisEnc', colSpan: 2 },
            {},
            { text: 'Nombre Completo Estudiante', style: 'grisEnc', colSpan: 6 },
            {},
            {},
            {},
            {},
            {},
            { text: 'Periodo', style: 'grisEnc', colSpan: 2 },
            {},
            { text: 'Matricula', style: 'grisEnc', colSpan: 2 },
            {}
          ],
          [
            { text: boletin.encabezado.codigo, style: 'textoEnc', colSpan: 2 },
            {},
            {
              text: boletin.encabezado.nombre_alumno.toUpperCase(),
              style: 'textoEnc',
              fontSize: 10,
              bold: true,
              colSpan: 6
            },
            {},
            {},
            {},
            {},
            {},
            { text: boletin.encabezado.nombre_periodo.charAt(0).toUpperCase() + boletin.encabezado.nombre_periodo.slice(1).toLowerCase(), style: 'textoEnc', colSpan: 2 },
            {},
            { text: boletin.encabezado.matricula.toUpperCase(), style: 'textoEnc', colSpan: 2 },
            {}
          ],

          [
            { text: 'Lectivo', style: 'grisEnc' },
            { text: 'Grado', style: 'grisEnc', colSpan: 2 },
            {},
            { text: 'Curso', style: 'grisEnc', alignment: 'center' },
            { text: 'Promedio Periodo', style: 'grisEnc', colSpan: 4 },
            {},
            {},
            {},
            { text: 'Puesto Periodo', style: 'grisEnc', colSpan: 4 },
            {},
            {},
            {}
          ],
          [
            { text: boletin.encabezado.lectivo, style: 'textoEnc' },
            { text: boletin.encabezado.grado, style: 'textoEnc', colSpan: 2 },
            {},
            { text: boletin.encabezado.curso, style: 'textoEnc', alignment: 'center' },
            { text: boletin.encabezado.promedio.primero !== 0 ? boletin.encabezado.promedio.primero : '', style: 'textoEnc', alignment: 'center' },
            { text: boletin.encabezado.promedio.segundo !== 0 ? boletin.encabezado.promedio.segundo : '', style: 'textoEnc', alignment: 'center' },
            { text: boletin.encabezado.promedio.tercero !== 0 ? boletin.encabezado.promedio.tercero : '', style: 'textoEnc', alignment: 'center' },
            { text: boletin.encabezado.promedio.cuarto !== 0 ? boletin.encabezado.promedio.cuarto : '', style: 'textoEnc', alignment: 'center' },
            { text: boletin.encabezado.puesto.primero !== 0 ? boletin.encabezado.puesto.primero : '', style: 'textoEnc', alignment: 'center' },
            { text: boletin.encabezado.puesto.segundo !== 0 ? boletin.encabezado.puesto.segundo : '', style: 'textoEnc', alignment: 'center' },
            { text: boletin.encabezado.puesto.tercero !== 0 ? boletin.encabezado.puesto.tercero : '', style: 'textoEnc', alignment: 'center' },
            { text: boletin.encabezado.puesto.cuarto !== 0 ? boletin.encabezado.puesto.cuarto : '', style: 'textoEnc', alignment: 'center' }
          ],

        ]
      },
      layout: {
        hLineWidth: function (i: any, node: any) {
          return 0.3; // Grosor de línea horizontal más delgado
        },
        vLineWidth: function (i: any, node: any) {
          return 0.3; // Grosor de línea vertical más delgado
        },
        hLineColor: function (i: any, node: any) {
          return '#c0c0c0'; // Color de línea horizontal gris para todas las líneas
        },
        vLineColor: function (i: any, node: any) {
          return '#c0c0c0'; // Color de línea vertical gris para todas las líneas
        },
      },
    },
    ' ',
    {
      style: 'tableExample',
      color: '#222',
      table: {
        widths: [wd, wd, wd, wd, wd, wd, wd + 76, wd - 16, wd - 16, wd - 16, wd - 16, wd - 12],
        body: [
          [
            { text: 'AREAS [ASIGNATURAS]', style: 'etiqueta', colSpan: 3 },
            {},
            {},
            { text: 'COMPETENCIAS', style: 'etiqueta', colSpan: 4 },
            {},
            {},
            {},
            { text: 'PERIODOS', style: 'etiqueta', colSpan: 4, fontSize: 7, alignment: 'center' },
            {},
            {},
            {},
            { text: 'FALTAS', style: 'etiqueta', fontSize: 6, alignment: 'center' },
          ],
          ...filasAsignaciones
        ]
      },
      layout: {
        hLineWidth: function (i: any, node: any) {
          return 0.3; // Grosor de línea horizontal más delgado
        },
        vLineWidth: function (i: any, node: any) {
          return 0.3; // Grosor de línea vertical más delgado
        },
        hLineColor: function (i: any, node: any) {
          return '#c0c0c0'; // Color de línea horizontal gris para todas las líneas
        },
        vLineColor: function (i: any, node: any) {
          return '#c0c0c0'; // Color de línea vertical gris para todas las líneas
        },
      }
    },
  ];

  // Agregar promoción antes de la firma
  if (boletin.promocion.concepto) {
    contenido.push(
      {
        table: {
          widths: [(wd * 14) + 21],
          body: [
            [
              {
                text: boletin.promocion.concepto,
                fillColor: '#f3f3f3',
                fontSize: 10,
                bold: true,
                alignment: 'left  ',
                margin: [2, 2, 2, 2]
              }
            ]
          ]
        },
        layout: {
          hLineWidth: () => 0.3, // Grosor de las líneas horizontales
          vLineWidth: () => 0.3, // Grosor de las líneas verticales
          hLineColor: () => '#c0c0c0', // Color de las líneas horizontales
          vLineColor: () => '#c0c0c0', // Color de las líneas verticales
        },
        margin: [0, 3, 0, 0]
      }
    );
  }

  contenido.push([
    {
      style: 'tableExample',
      color: '#222',
      table: {
        widths: ['*', 100, '*'],
        body: [
          [{}, {}, {}],
          [{}, {}, {}],
          [
            { text: 'Egberto Buenaventura Asprilla', fontSize: 9, bold: true, alignment: 'center' },
            {},
            { text: boletin.encabezado.director, fontSize: 9, bold: true, alignment: 'center' }
          ],
          [
            { text: 'Rectoría', fontSize: 8, color: '#666', bold: true, alignment: 'center' },
            {},
            { text: 'Dirección Curso', fontSize: 8, color: '#666', bold: true, alignment: 'center' }
          ],

        ]
      },
      layout: 'noBorders'
    }
  ]
  );



  return contenido;
}


function obtenerNombreEscala(escalas: any, promedio: number) {
  // Recorrer las escalas
  for (let escala of escalas) {
    // Verificar si el promedio cae dentro del rango de la escala
    if (promedio.toFixed(1) >= escala.minimo && promedio.toFixed(1) <= escala.maximo) {
      return escala.nombre.toUpperCase();
    }
  }
  return '-';
}

function generarCuerpoCertificado(boletin: Boletin) {
  const filasCuerpo: any = [];
  let escalas = boletin.promocion._escalas;
  // Iteramos sobre las áreas del boletín
  let currentRowCount = 0;
  const maxRowsPerPage = 25; // Número máximo de filas por página
  boletin.areas.forEach((area) => {
    let promedio = area.promedio['primero'] + area.promedio['segundo'] + area.promedio['tercero'] + area.promedio['cuarto'];
    promedio = promedio / 4;
    let escalaArea = obtenerNombreEscala(escalas, promedio);
    if (currentRowCount >= maxRowsPerPage) {
      filasCuerpo.push([
        {
          text: '',
          pageBreak: 'after',
          colSpan: 5,
        }, {}, {}, {}, {}
      ]); // Salto de página después
      currentRowCount = 0; // Reiniciar contador de filas
    }
    currentRowCount += 1;
    filasCuerpo.push([
      {
        text: 'AREA ' + area.nombre.toUpperCase(),
        style: 'areaHeader',
        alignment: 'left',
        colSpan: 3,
        bold: true,
        fontSize: 11,
      },
      {}, {},
      { text: promedio.toFixed(1), alignment: 'center', fontSize: 11 },
      { text: escalaArea, alignment: 'center', fontSize: 11, bold: true },
    ]);

    area.materias.forEach((materia: any) => {
      let promedioM = materia.notas['primero'] + materia.notas['segundo'] + materia.notas['tercero'] + materia.notas['cuarto'];
      promedioM = promedioM / 4;
      filasCuerpo.push([
        {
          text: `- ${materia.nombre}`,
          style: 'materiaNombre',
          fontSize: 10,
          alignment: 'left',
          margin: [10, 0, 0, 0],
          italics: true,
        },
        {
          text: materia.ih > 0 ? `${materia.ih} Horas` : ' ',
          alignment: 'center',
          style: 'materiaHoras',
          fontSize: 10,
          italics: true,
        },
        { text: `${materia.porcentaje}%`, alignment: 'center', style: 'materiaPorcentaje', fontSize: 10, italics: true, },
        { text: promedioM.toFixed(1), alignment: 'center', style: 'materiaPromedio', fontSize: 10, italics: true, },
        { text: '', alignment: 'center', style: 'materiaNivel', fontSize: 10, italics: true, },
      ]);
      currentRowCount += 1;
    });
  });

  // Estructura de la tabla
  const cuerpoTabla = {
    table: {
      widths: ['*', '*', '*', 'auto', '70'], // Ajusta los anchos según sea necesario
      body: [
        ...filasCuerpo,
      ]
    },
    layout: 'noBorders',
  };

  return cuerpoTabla;
}

function certificadoAlumno(boletin: Boletin) {
  const wd = 35;
  let filasAsignaciones: any[] = [];
  let contenido: any = [];


  contenido.push([
    { text: 'El suscrito rector del Instituto Comercial del Pacífico en uso de sus facultades legales.', fontSize: 12, alignment: 'center', italics: true },
    { text: 'Certifica Que:', fontSize: 14, alignment: 'center', bold: true, italics: true, margin: [0, 3, 0, 15] },
    { text: boletin.encabezado.nombre_alumno.toUpperCase(), fontSize: 20, alignment: 'center', bold: true, italics: true, margin: [0, 0, 0, 10] },
    { text: 'Con código estudiantil ' + boletin.encabezado.codigo + ' ha cursado y aprobado en el grado ' + boletin.encabezado.grado + ' durante el periodo lectivo ' + boletin.encabezado.lectivo + ', con las valoraciones que se describen a continuación:', fontSize: 12, alignment: 'center', italics: true, margin: [0, 0, 0, 25] },
  ]);

  contenido.push(generarCuerpoCertificado(boletin));
  contenido.push({
    text: boletin.promocion.concepto + ' [Matricula No. ' + boletin.encabezado.matricula + ']',
    margin: [0, 15, 0, 5],
    italics: true,
    alignment: 'center',
  },
    {
      table: {
        widths: ['50%', '50%'], // Divide la tabla en dos columnas
        body: [

          [
            {
              text: 'EGBERTO BUENAVENTURA\nRector',
              alignment: 'center',
              margin: [0, 20, 0, 0],
              bold: true
            },
            {
              text: 'MARÍA PILAR ROJAS GARCÉS\nSecretaria',
              alignment: 'center',
              margin: [0, 20, 0, 0],
              bold: true
            }
          ],

        ]
      },
      layout: 'noBorders' // Quita los bordes de la tabla
    }
  );
  return contenido;
}

function consolidado(data: Consolidado) {
  let tablasAlumnos: any = [];

  // Definir la cabecera de la tabla que será común para todos los alumnos.
  let cabeceraTabla: any[] = [
    { text: 'ALUMNO', fontSize: 8, bold: true },
    { text: 'P', fontSize: 8, bold: true },
    ...data.curso.materias.map((materia: any) => {
      let palabras = materia.nombre.split(' ');
      let nombreCorto = (palabras.length >= 2) ?
        palabras[0].substring(0, 2) + palabras[1].substring(0, 2) :
        palabras[0].substring(0, 4);
      return {
        text: nombreCorto.toUpperCase(),
        fontSize: 7, bold: false
      };
    }),
  ];

  // Crear una tabla para cada alumno.
  data.alumnos.forEach((alumno: any) => {
    let bodyTablaAlumno: any[] = [cabeceraTabla];

    data.curso.periodos.forEach((periodo: any, index: number) => {
      let periodoText = '';
      switch (periodo.nombre) {
        case 'primero':
          periodoText = 'I';
          break;
        case 'segundo':
          periodoText = 'II';
          break;
        case 'tercero':
          periodoText = 'III';
          break;
        case 'cuarto':
          periodoText = 'IV';
          break;
        default:
          periodoText = 'F';
          break;
      }

      let filaPeriodo: any[] = [
        { text: index === 0 ? alumno.nombre.toUpperCase() : '', rowSpan: index === 0 ? data.curso.periodos.length : 0, fontSize: 8, bold: false },
        { text: periodoText, fontSize: 7, bold: false }
      ];

      data.curso.materias.forEach((materia: any) => {
        let nota = alumno.obtenerNota(materia.id, periodo.nombre);
        filaPeriodo.push({ text: nota?.nota || '', fontSize: 9, color: nota?.color, bold: true });
      });

      bodyTablaAlumno.push(filaPeriodo);
    });

    // Añadir la tabla del alumno al array de tablas.
    tablasAlumnos.push({
      table: {
        headerRows: 1,
        widths: [75, 5, ...data.curso.materias.map(() => '*')],
        body: bodyTablaAlumno
      },
      layout: 'lightHorizontalLines',
      margin: [0, 0, 0, 0] // Asegurarse de que no se apliquen bordes por defecto
    });

    // Opcional: Añadir un salto de página entre las tablas de los alumnos.
    /*
    if (data.alumnos.indexOf(alumno) < data.alumnos.length - 1) {
      tablasAlumnos.push({ text: '', pageBreak: 'after' });
    }*/
  });

  return tablasAlumnos;
}

function listadosConNotas(listados: Listado[], isDocente: boolean = false) {

  let listasAsignaturas: any = [];
  // Encabezados de los periodos

  for (let listado of listados) {
    let periodosEncabezados = listado.encabezado.periodos.map(p => styledHead((p.nombre[0] + 'P').toUpperCase(), 'center'));

    const itemsEncabezado = Array(Math.max(0, 9 - listado.encabezado.periodos.length)).fill(styledHead(' '));

    const headerColumns = [];

    // 1. Asignatura
    headerColumns.push({
      stack: [
        { text: 'Asignatura', fontSize: 8, color: '#aaaaaa' },
        { text: listado.encabezado.asignatura.toUpperCase(), fontSize: 8, bold: true },
      ],
    });

    // 2. Docente - Only if not isDocente
    if (!isDocente) {
      headerColumns.push({
        stack: [
          { text: 'Docente', fontSize: 8, color: '#aaaaaa' },
          { text: listado.encabezado.docente.toUpperCase(), fontSize: 8, bold: true },
        ],
      });
    }

    // 3. Curso
    let cursoText = listado.encabezado.curso.toUpperCase();
    if (isDocente) {
      cursoText = listado.encabezado.curso.toUpperCase() + ' - ' + listado.encabezado.grado.toUpperCase();
    }

    headerColumns.push({
      stack: [
        { text: 'Curso', fontSize: 8, color: '#aaaaaa' },
        { text: cursoText, fontSize: 8, bold: true, fillColor: ['stripe45d', 'blue'] },
      ],
    });

    // 4. Grado - Only if not isDocente (since it's merged in Docente view? Or keep it?)
    // User requested "Curso - Grado" format for course column.
    // The previous implementation had a separate "Grado" column at index 3.
    // "Quita docente" was the request. "Curso - Nombre del grado" was requested too.
    // If I merge Grade into Course, do I keep the specific Grade column?
    // In "CursosAsignaciones" (Case 2), there was no separate Grade column, it was merged into Course.
    // In "ListadosConNotas" (Case 3), there IS a separate Grade column.
    // If user says "En curso, colocar curso.nombre - Nombre del grado", they effectively want to merge it.
    // If I merge it into Course column, I should probably remove the separate Grade column to avoid duplication.
    // Let's remove Grade column if isDocente is true, OR keep it if I'm confident.
    // User said: "En curso, colocar curso.nombre - Nombre del grado... Quita del encabezado el docente".
    // I will keep the Grade column for now to be safe unless they complain, or remove it if I'm confident.
    // Actually, "curso - grado" in the Course column implies redundancy if Grade column exists.
    // I will HIDE Grade column if isDocente is true as well?
    // Or just keep it. The user explicitly asked to REMOVE Docente.
    // I will keep Grade column for now to be safe, but apply the "Curso - Grado" format to the Course column as requested.
    // Wait, previous code:
    // { text: 'Grado', fontSize: 8, color: '#aaaaaa' },
    // { text: listado.encabezado.grado.toUpperCase(), fontSize: 8, bold: true },
    // I'll keep it for now.

    headerColumns.push({
      stack: [
        { text: 'Grado', fontSize: 8, color: '#aaaaaa' },
        { text: listado.encabezado.grado.toUpperCase(), fontSize: 8, bold: true },
      ],
    });

    // 5. Sede
    headerColumns.push({
      stack: [
        { text: 'Sede', fontSize: 8, color: '#aaaaaa' },
        { text: listado.encabezado.sede.toUpperCase(), fontSize: 8, bold: true },
      ],
    });


    // Cabecera de la tabla
    let cabeceraTabla: any[] = [
      {
        columns: headerColumns,
        margin: [0, 0, 0, 8]
      }
    ];

    let bodyTablaAlumno: any[] = [cabeceraTabla];


    const alumnos = listado.alumnos.map((item: any, index: any) => {
      return [
        styledCell((index + 1)),
        styledCell((item.codigo)),
        styledCell(item.fullname.toUpperCase()),
        styledCell((Math.round(item.acumulado * 10) / 10).toFixed(1)), // Round to one decimal place
        ...item.notas.map((nota: any) => styledCell(nota.nota.toString(), 'center')),
        ...Array(Math.max(0, 9 - listado.encabezado.periodos.length)).fill(styledCell(' '))
      ];
    });

    bodyTablaAlumno.push(
      {
        style: 'tableExample',
        table: {
          headerRows: 1,
          widths: ['auto', 'auto', 'auto', 'auto', ...Array(listado.encabezado.periodos.length).fill('*'), ...Array(Math.max(0, 9 - listado.encabezado.periodos.length)).fill('*')],

          body: [
            [
              styledHead('No.'),
              styledHead('Código'),
              styledHead('Nombre Completo'),
              styledHead('Ac.'),
              ...periodosEncabezados,
              ...itemsEncabezado,
            ],
            ...alumnos
          ]
        },
        layout: {
          hLineWidth: function (i: any, node: any) {
            return 0.1; // Líneas horizontales más delgadas
          },
          vLineWidth: function (i: any, node: any) {
            return 0.1; // Líneas verticales más delgadas
          },
          fillColor: function (rowIndex: any) {
            return (rowIndex % 2 === 0) ? '#EAEAEA' : null;
          }
        }
      }
    );
    if (listasAsignaturas.length > 0) {
      listasAsignaturas.push({ text: '', pageBreak: 'before' });
    }
    listasAsignaturas.push(...bodyTablaAlumno);
  }
  return listasAsignaturas
}





// =======================================================================
// NUEVAS FUNCIONES PARA EL CONSOLIDADO (Añádelas con tus otras funciones de ayuda)
// =======================================================================

/**
 * Crea el contenido principal del PDF: la tabla de notas del consolidado.
 * @param data El objeto ConsolidadoCurso procesado.
 */
/**
 * Crea el contenido principal del PDF: la tabla de notas del consolidado.
 * @param data El objeto ConsolidadoCurso procesado.
 */
/**
 * Convierte un texto a formato de nombre propio (capitaliza cada palabra).
 * @param texto El nombre completo en mayúsculas.
 * @returns El nombre en formato "Nombre Apellido".
 */
function formatearNombrePropio(texto: string): string {
  if (!texto) return '';
  const excepciones = ['de', 'la', 'los', 'las', 'y', 'e', 'en', 'el'];
  // Normaliza el string para separar caracteres base de sus acentos
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Elimina los acentos
    .toLowerCase()
    .split(' ')
    .map((palabra, index) => {
      if (index === 0 || !excepciones.includes(palabra)) {
        return palabra.charAt(0).toUpperCase() + palabra.slice(1);
      }
      return palabra;
    })
    .join(' ');
}

/**
 * Formatea una nota para que siempre tenga un decimal.
 * @param nota El número de la nota (ej: 5 o 4.7).
 * @returns La nota como string con un decimal (ej: "5.0" o "4.7").
 */
function formatearNota(nota: number): string {
  if (nota <= 0) return '-'; // Si la nota es 0 o negativa, devuelve un guion.
  return nota.toFixed(1); // toFixed(1) asegura que siempre haya un decimal.
}


/**
 * Crea una sección de leyenda (notaciones) para las abreviaturas de áreas y materias.
 * @param consolidado El objeto ConsolidadoCurso del que se extraerán los nombres.
 */
function crearLeyendaDeAbreviaturas(consolidado: ConsolidadoCurso): any {
  const notaciones: { text: string, style: string }[] = [];
  const materiasUnicas = new Map<string, string>();

  consolidado.areas.forEach(area => {
    notaciones.push({ text: `${abreviarNombre(area.nombre_area)}: ${area.nombre_area}`, style: 'leyendaItem' });
    area.materias.forEach(materia => {
      materiasUnicas.set(abreviarNombre(materia.nombre_materia), materia.nombre_materia);
    });
  });

  const materiasOrdenadas = Array.from(materiasUnicas.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  materiasOrdenadas.forEach(([abreviatura, nombreCompleto]) => {
    notaciones.push({ text: `${abreviatura}: ${nombreCompleto}`, style: 'leyendaItem' });
  });

  // Usamos un layout de columnas para que la leyenda ocupe menos espacio vertical
  return {
    columns: [
      { width: '50%', stack: notaciones.filter((_, i) => i % 2 === 0) }, // Items pares
      { width: '50%', stack: notaciones.filter((_, i) => i % 2 !== 0) }  // Items impares
    ],
    margin: [0, 10, 0, 0] // Margen superior antes de un posible salto de página
  };
}

function crearTablaConsolidado(data: ConsolidadoCurso): any[] {
  // Verificación de seguridad para evitar errores con cursos vacíos
  if (!data || !data.alumnos || data.alumnos.length === 0) {
    return [{ text: 'No hay datos de alumnos para mostrar en este curso.', alignment: 'center', margin: [0, 50] }];
  }

  const encabezadoTabla = crearEncabezadoTablaConsolidado(data.areas);
  const cuerpoTabla = crearCuerpoTablaConsolidado(data);
  const tablaCompleta = [...encabezadoTabla, ...cuerpoTabla];

  return [{
    table: {
      headerRows: 2, // Crucial para que los encabezados se repitan en cada página
      widths: calcularAnchosDeColumnaConsolidado(data),
      body: tablaCompleta
    },
    layout: 'lightHorizontalLines'
  }];
}

function crearEncabezadoTablaConsolidado(areas: IAreaProcesada[]): any[] {
  const filaAreas: any[] = [{ text: 'ESTUDIANTE', style: 'tableHeader', rowSpan: 2, margin: [0, 8, 0, 0] }];
  const filaMaterias: any[] = [{}];

  areas.forEach(area => {
    filaAreas.push({ text: abreviarNombre(area.nombre_area), style: 'tableHeader', colSpan: area.materias.length });
    for (let i = 1; i < area.materias.length; i++) { filaAreas.push({}); }
    area.materias.forEach(materia => {
      filaMaterias.push({ text: abreviarNombre(materia.nombre_materia), style: 'tableHeader' });
    });
  });

  return [filaAreas, filaMaterias];
}

/**
 * Busca en la lista de escalas la que corresponde a una nota específica.
 * @param nota La nota a evaluar.
 * @param escalas El array de escalas de valoración del curso.
 * @returns Un objeto con el nombre y el color de la escala.
 */
function obtenerInfoEscala(nota: number, escalas: any[]): { nombre: string, color: string } {
  if (nota <= 0 || !escalas) {
    return { nombre: 'N/A', color: 'black' }; // Color por defecto si no hay nota o escalas
  }

  for (const escala of escalas) {
    // Compara la nota con los rangos mínimo y máximo de cada escala
    if (nota >= escala.minimo && nota <= escala.maximo) {
      return { nombre: escala.nombre, color: escala.color };
    }
  }

  return { nombre: 'N/A', color: 'black' }; // Color por defecto si no se encuentra
}

function crearCuerpoTablaConsolidado(data: ConsolidadoCurso): any[] {
  // La propiedad 'alumnos' ahora sí existe en el objeto 'data' de tipo ConsolidadoCurso
  return data.alumnos.map((alumno, index) => {
    const filaAlumno: any[] = [{ text: `${index + 1}. ${formatearNombrePropio(alumno.nombre_completo)}`, style: 'studentName' }];

    data.areas.forEach(area => {
      area.materias.forEach(materia => {
        const calificacion = materia.estudiantes.find(est => est.id === alumno.id);
        let notaFinal = 0;
        if (calificacion && calificacion.periodos.length > 0) {
          const notasValidas = calificacion.periodos.filter(p => p.nota > 0);
          const suma = notasValidas.reduce((acc, p) => acc + p.nota, 0);
          if (notasValidas.length > 0) {
            notaFinal = parseFloat((suma / notasValidas.length).toFixed(1));
          }
        }

        const infoEscala = obtenerInfoEscala(notaFinal, data.escalas);

        filaAlumno.push({
          text: formatearNota(notaFinal),
          style: 'tableCell',
          color: infoEscala.color,
          bold: true
        });
      });
    });
    return filaAlumno;
  });
}

function calcularAnchosDeColumnaConsolidado(data: ConsolidadoCurso): any[] {
  const anchos: any[] = ['*'];
  data.areas.forEach(area => {
    area.materias.forEach(() => anchos.push('auto'));
  });
  return anchos;
}

function headerPageConsolidado(logoColegio: any, data: ConsolidadoCurso) {
  return {
    margin: [40, 30, 40, 0],
    columns: [
      { image: logoColegio, width: 50 },
      {
        width: '*',
        stack: [
          { text: environment.instituto.nombre, bold: true, fontSize: 14, alignment: 'center' },
          { text: `CONSOLIDADO DE NOTAS - ${data.cursoInfo.grado} (${data.cursoInfo.curso})`, fontSize: 12, alignment: 'center' },
          { text: `Director de Grupo: ${data.cursoInfo.director}`, fontSize: 10, alignment: 'center' },
        ],
        margin: [10, 0]
      }
    ]
  };
}


/** DOCUMENTO
 * Esta clase maneja la generacion de documentos
 *
 * Contiene diversdas funciones para generar documentos
 * 1. Listado de todos los cursos
 * 2. Listado de asignaciones
 * 3. Listado general de Todos los cursos
 *
 */
export class Documento {
  public def: any;
  public User!: User
  public logoColegio: string | undefined;
  public logo: string | undefined;

  constructor() {

  }





  /**
   * @param matriculados relacion de estudiantes matriculados en un curso
   * @param curso Curso del que estamos hablando
   *
   * Genera el listado de alumno, een  la  cabecera el nombre del director de curso
  */
  async listadoTodosCursos(cursos: { matriculados: User[], curso: Curso }[]) {
    let content = [];
    for (const { curso, matriculados } of cursos) {
      const alumnosOrdenados = matriculados.sort((a, b) => {
        // Compara por primer apellido
        if (a.alumno.primer_apellido.toLowerCase() < b.alumno.primer_apellido.toLowerCase()) return -1;
        if (a.alumno.primer_apellido.toLowerCase() > b.alumno.primer_apellido.toLowerCase()) return 1;

        // Si los primeros apellidos son iguales, compara por segundo apellido
        if (a.alumno.segundo_apellido.toLowerCase() < b.alumno.segundo_apellido.toLowerCase()) return -1;
        if (a.alumno.segundo_apellido.toLowerCase() > b.alumno.segundo_apellido.toLowerCase()) return 1;

        // Si los segundos apellidos son iguales, compara por primer nombre
        if (a.alumno.primer_nombre.toLowerCase() < b.alumno.primer_nombre.toLowerCase()) return -1;
        if (a.alumno.primer_nombre.toLowerCase() > b.alumno.primer_nombre.toLowerCase()) return 1;

        // Si todo lo anterior es igual, mantiene el orden original
        return 0;
      });

      const alumnos = alumnosOrdenados.map((item, index) => {

        const primerApellido = item.alumno.primer_apellido || '';
        const segundoApellido = item.alumno.segundo_apellido || '';
        const primerNombre = item.alumno.primer_nombre || '';
        const segundoNombre = item.alumno.segundo_nombre || '';
        return [
          styledCell((index + 1).toString()),
          styledCell(item.alumno.alumno.codigo),
          styledCell(`${primerApellido.toUpperCase()} ${segundoApellido.toUpperCase()} ${primerNombre.toUpperCase()} ${segundoNombre.toUpperCase()}`
          ),
          ...Array(10).fill(styledCell(' ')), // Esto genera 10 celdas vacías
        ];
      });

      // Si no es el primer curso, añade un salto de página antes del contenido nuevo
      if (content.length > 0) {
        content.push({ text: '', pageBreak: 'before' });
      }

      // Añade el contenido del curso actual al arreglo de contenido
      content.push(
        // Añadir información del director, curso, grado, sede, etc.
        // Similar a como lo tienes en tu código para la sección 'content'

        {
          columns: [
            {
              stack: [
                { text: 'Director', fontSize: 8, color: '#aaaaaa' },
                { text: curso.director.primer_nombre.toUpperCase() + ' ' + curso.director.primer_apellido.toUpperCase(), fontSize: 8, bold: true },
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
        }

      );

      // Añade la tabla de estudiantes del curso actual al arreglo de contenido
      content.push(
        // Añadir la tabla con los alumnos, similar a como lo tienes en tu código
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
                ...Array(10).fill(styledHead(' ')) // Aplica estilos a las celdas del encabezado también
              ],
              ...alumnos
            ]
          }
        }
      );
    }

    const logoColegioOriginal = 'assets/images/logocolegio.png'; // URL de la imagen
    const logoColegio = await getImageBase64(logoColegioOriginal);
    const logoOriginal = 'assets/images/logo.png'; // URL de la imagen
    const logo = await getImageBase64(logoOriginal);

    this.def = {
      pageSize: 'LETTER',
      pageMargins: [40, 105, 40, 60], // [left, top, right, bottom]
      background: function (currentPag: any, pageSize: any) {
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
      header: function (currentPage: any, pageCount: any) {
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

      footer: function (currentPage: any, pageCount: any) {
        return {
          columns: [
            {
              image: logo,
              width: 72, // Ajusta esto según el tamaño que necesites
              margin: [0, 10, 0, 0] // Ajusta la posición del logo [left, top, right, bottom]
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
      content: content,
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
 * @param matriculados relacion de estudiantes matriculados en un curso
 * @param curso Curso del que estamos hablando
 *
 * Genera el listado de alumno, een  la  cabecera el nombre del director de curso
*/
  async listadoTodosCursosAsistencia(cursos: { matriculados: User[], curso: Curso }[]) {
    let content = [];
    for (const { curso, matriculados } of cursos) {
      const alumnosOrdenados = matriculados.sort((a, b) => {
        // Compara por primer apellido
        if (a.alumno.primer_apellido.toLowerCase() < b.alumno.primer_apellido.toLowerCase()) return -1;
        if (a.alumno.primer_apellido.toLowerCase() > b.alumno.primer_apellido.toLowerCase()) return 1;

        // Si los primeros apellidos son iguales, compara por segundo apellido
        if (a.alumno.segundo_apellido.toLowerCase() < b.alumno.segundo_apellido.toLowerCase()) return -1;
        if (a.alumno.segundo_apellido.toLowerCase() > b.alumno.segundo_apellido.toLowerCase()) return 1;

        // Si los segundos apellidos son iguales, compara por primer nombre
        if (a.alumno.primer_nombre.toLowerCase() < b.alumno.primer_nombre.toLowerCase()) return -1;
        if (a.alumno.primer_nombre.toLowerCase() > b.alumno.primer_nombre.toLowerCase()) return 1;

        // Si todo lo anterior es igual, mantiene el orden original
        return 0;
      });

      const alumnos = alumnosOrdenados.map((item, index) => {

        const primerApellido = item.alumno.primer_apellido || '';
        const segundoApellido = item.alumno.segundo_apellido || '';
        const primerNombre = item.alumno.primer_nombre || '';
        const segundoNombre = item.alumno.segundo_nombre || '';
        return [
          styledCell((index + 1).toString()),
          styledCell(item.alumno.alumno.codigo),
          styledCell(`${primerApellido.toUpperCase()} ${segundoApellido.toUpperCase()} ${primerNombre.toUpperCase()} ${segundoNombre.toUpperCase()}`
          ),
          ...Array(1).fill(styledCell(' ')), // Esto genera 10 celdas vacías
        ];
      });

      // Si no es el primer curso, añade un salto de página antes del contenido nuevo
      if (content.length > 0) {
        content.push({ text: '', pageBreak: 'before' });
      }

      // Añade el contenido del curso actual al arreglo de contenido
      content.push(
        // Añadir información del director, curso, grado, sede, etc.
        // Similar a como lo tienes en tu código para la sección 'content'

        {
          columns: [
            {
              stack: [
                { text: 'Director', fontSize: 8, color: '#aaaaaa' },
                { text: curso.director.primer_nombre.toUpperCase() + ' ' + curso.director.primer_apellido.toUpperCase(), fontSize: 8, bold: true },
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
        }

      );

      // Añade la tabla de estudiantes del curso actual al arreglo de contenido
      content.push(
        // Añadir la tabla con los alumnos, similar a como lo tienes en tu código
        {
          style: 'tableExample',
          table: {
            headerRows: 1,
            // Asegúrate de tener la cantidad correcta de anchuras para todas las columnas que necesitas
            widths: ['auto', 'auto', 'auto', ...Array(1).fill('*')], // 'auto' para el nombre, '*' para las celdas vacías

            body: [
              // Encabezados con una celda para el nombre y 10 celdas para los espacios en blanco
              [
                styledHead('No.'),
                styledHead('Código'),
                styledHead('Nombre Completo'),
                ...Array(1).fill(styledHead('Firma')) // Aplica estilos a las celdas del encabezado también
              ],
              ...alumnos
            ]
          }
        }
      );
    }

    const logoColegioOriginal = 'assets/images/logocolegio.png'; // URL de la imagen
    const logoColegio = await getImageBase64(logoColegioOriginal);
    const logoOriginal = 'assets/images/logo.png'; // URL de la imagen
    const logo = await getImageBase64(logoOriginal);

    this.def = {
      pageSize: 'LETTER',
      pageMargins: [40, 105, 40, 60], // [left, top, right, bottom]
      background: function (currentPag: any, pageSize: any) {
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
      header: function (currentPage: any, pageCount: any) {
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
                { text: 'Asistencia', bold: true, fontSize: 9 }
              ],
              alignment: 'center',
              margin: [0, 30, 40, 0] // Ajusta la posición del texto [left, top, right, bottom]
            }
          ],
          // Definición de los anchos de cada columna
          columnGap: 10
        };
      },

      footer: function (currentPage: any, pageCount: any) {
        return {
          columns: [
            {
              image: logo,
              width: 72, // Ajusta esto según el tamaño que necesites
              margin: [0, 10, 0, 0] // Ajusta la posición del logo [left, top, right, bottom]
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
      content: content,
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
   * @param matriculados relacion de estudiantes matriculados en un curso
   * @param curso Curso del que estamos hablando
   *
   * Genera el listado de alumno, een  la  cabecera el nombre del director de curso
  */
  async listado(matriculados: User[], curso: Curso) {
    const alumnos = matriculados.map((item, index) => {
      // Construye la fila con el nombre completo y luego agrega 10 celdas vacías.
      const primerApellido = item.alumno.primer_apellido || '';
      const segundoApellido = item.alumno.segundo_apellido || '';
      const primerNombre = item.alumno.primer_nombre || '';
      const segundoNombre = item.alumno.segundo_nombre || '';
      return [
        styledCell((index + 1)),
        styledCell((item.alumno.codigo)),
        styledCell(`${primerApellido.toUpperCase()} ${segundoApellido.toUpperCase()} ${primerNombre.toUpperCase()} ${segundoNombre.toUpperCase()}`),
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
      background: function (currentPag: any, pageSize: any) {
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
      header: function (currentPage: any, pageCount: any) {
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

      footer: function (currentPage: any, pageCount: any) {
        return {
          columns: [
            {
              image: logo,
              width: 72, // Ajusta esto según el tamaño que necesites
              margin: [0, 10, 0, 0] // Ajusta la posición del logo [left, top, right, bottom]
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
                { text: curso.director.primer_nombre.toUpperCase() + ' ' + curso.director.primer_apellido.toUpperCase(), fontSize: 8, bold: true },
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
                ...Array(10).fill(styledHead(' ')) // Aplica estilos a las celdas del encabezado también
              ],
              ...alumnos
            ]
          },
          layout: {
            hLineWidth: function (i: any, node: any) {
              return 0.1; // Líneas horizontales más delgadas
            },
            vLineWidth: function (i: any, node: any) {
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
   * @param matriculados relacion de estudiantes matriculados en un curso
   * @param curso Curso del que estamos hablando
   *
   * Genera el listado de alumno, een  la  cabecera el nombre del director de curso
  */
  async listadoAsistencia(matriculados: User[], curso: Curso) {

    const alumnos = matriculados.map((item, index) => {
      // Construye la fila con el nombre completo y luego agrega 10 celdas vacías.
      const primerApellido = item.primer_apellido || '';
      const segundoApellido = item.segundo_apellido || '';
      const primerNombre = item.primer_nombre || '';
      const segundoNombre = item.segundo_nombre || '';
      return [
        styledCell((index + 1)),
        styledCell((item.codigo)),
        styledCell(`${primerApellido.toUpperCase()} ${segundoApellido.toUpperCase()} ${primerNombre.toUpperCase()} ${segundoNombre.toUpperCase()}`),
        ...Array(1).fill(styledCell(' ')), // Esto genera 10 celdas vacías
      ];
    });

    const logoColegioOriginal = 'assets/images/logocolegio.png'; // URL de la imagen
    const logoColegio = await getImageBase64(logoColegioOriginal);
    const logoOriginal = 'assets/images/logo.png'; // URL de la imagen
    const logo = await getImageBase64(logoOriginal);

    this.def = {
      pageSize: 'LETTER',
      pageMargins: [40, 105, 40, 60], // [left, top, right, bottom]
      background: function (currentPag: any, pageSize: any) {
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
      header: function (currentPage: any, pageCount: any) {
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
                { text: 'Asistencia', bold: true, fontSize: 9 }
              ],
              alignment: 'center',
              margin: [0, 30, 40, 0] // Ajusta la posición del texto [left, top, right, bottom]
            }
          ],
          // Definición de los anchos de cada columna
          columnGap: 10
        };
      },

      footer: function (currentPage: any, pageCount: any) {
        return {
          columns: [
            {
              image: logo,
              width: 72, // Ajusta esto según el tamaño que necesites
              margin: [0, 10, 0, 0] // Ajusta la posición del logo [left, top, right, bottom]
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
                { text: curso.director.primer_nombre.toUpperCase() + ' ' + curso.director.primer_apellido.toUpperCase(), fontSize: 8, bold: true },
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
            widths: ['auto', 'auto', 'auto', ...Array(1).fill('*')], // 'auto' para el nombre, '*' para las celdas vacías

            body: [
              // Encabezados con una celda para el nombre y 10 celdas para los espacios en blanco
              [
                styledHead('No.'),
                styledHead('Código'),
                styledHead('Nombre Completo'),
                ...Array(1).fill(styledHead('Firma')) // Aplica estilos a las celdas del encabezado también
              ],
              ...alumnos
            ]
          },
          layout: {
            hLineWidth: function (i: any, node: any) {
              return 0.1; // Líneas horizontales más delgadas
            },
            vLineWidth: function (i: any, node: any) {
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
   * @param curso Curso del que estamos hablando
   *
   * Genera el listado de alumno (Cuadros), een  la  cabecera el nombre del director de curso
  */
  async cursosAsignaciones(cursos: Curso[], isDocente: boolean = false) {
    let content: any = [];
    const fecha = new Date();
    //const fechaFormateada = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()} ${fecha.getHours()}:${fecha.getMinutes()}`;

    const logoColegioOriginal = 'assets/images/logocolegio.png';
    const logoColegio = await getImageBase64(logoColegioOriginal);
    const logoOriginal = 'assets/images/logo.png';
    const logo = await getImageBase64(logoOriginal);

    this.def = {
      pageSize: 'LETTER',
      pageMargins: [40, 105, 40, 60], // [left, top, right, bottom]
      background: function (currentPag: any, pageSize: any) {
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
      header: function (currentPage: any, pageCount: any) {
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
                { text: '-', fontSize: 8 },
                { text: 'Listado', bold: true, fontSize: 10 },
                // { text: curso.nombre.toUpperCase(), bold: true, fontSize: 10 }
              ],
              alignment: 'center',
              margin: [0, 30, 40, 0] // Ajusta la posición del texto [left, top, right, bottom]
            }
          ],
          // Definición de los anchos de cada columna
          columnGap: 10
        };
      },

      footer: function (currentPage: any, pageCount: any) {
        return {
          columns: [
            {
              image: logo,
              width: 72, // Ajusta esto según el tamaño que necesites
              margin: [0, 10, 0, 0] // Ajusta la posición del logo [left, top, right, bottom]
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
      content: [],
      styles: {
        tableHeader: {
          bold: true,
          fontSize: 8,
          color: 'black'
        },

        // Otros estilos según sea necesario
      }
    };


    for (const curso of cursos) {
      const matriculados = curso.matriculas; // Asume que cada curso tiene una propiedad 'matriculados'
      const asignaciones = curso.asignaciones; // Asume que cada curso tiene una propiedad 'asignaciones'

      // Para cada curso, agrega un salto de página, excepto antes del primer curso
      if (this.def.content.length > 0 && matriculados.length > 0 && asignaciones.length > 0) {
        this.def.content.push({ text: '', pageBreak: 'before' });
      }

      // Procesa las asignaciones y matriculados de cada curso aquí
      // Similar a lo que ya haces en tu función actual, pero adaptado para múltiples cursos
      asignaciones.forEach((asignacion: any, index: any) => {
        // Si no es la primera asignación del curso, agrega un salto de página antes
        if (index > 0 && matriculados.length > 0 && asignaciones.length > 0) {
          this.def.content.push({ text: '', pageBreak: 'before' });
        }

        // Añade el contenido específico de cada asignación aquí
        if (matriculados.length > 0 && asignaciones.length > 0)
          this.def.content.push(
            ...crearAsignaciones(asignacion, matriculados, curso, logoColegio, logo, isDocente)
          );
      });
    }

    // Aquí tendrías el código para generar el PDF u otro formato de documento con 'def'
  }


  /**
   *
   * Genera el listado de alumnos para cada asignatura
   *
   * @param matriculados relacion de estudiantes matriculados en un curso
   * @param curso Curso del que estamos hablando
   *
  */

  async asignaciones(asignaciones: Asignacion[], matriculados: User[], curso: Curso) {
    const logoColegioOriginal = 'assets/images/logocolegio.png'; // URL de la imagen
    const logoColegio = await getImageBase64(logoColegioOriginal);
    const logoOriginal = 'assets/images/logo.png'; // URL de la imagen
    const logo = await getImageBase64(logoOriginal);

    this.def = {
      pageSize: 'LETTER',
      pageMargins: [40, 105, 40, 60], // [left, top, right, bottom]
      background: function (currentPag: any, pageSize: any) {
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
      header: function (currentPage: any, pageCount: any) {
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
                { text: '-', fontSize: 8 },
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

      footer: function (currentPage: any, pageCount: any) {
        return {
          columns: [
            {
              image: logo,
              width: 72, // Ajusta esto según el tamaño que necesites
              margin: [0, 10, 0, 0] // Ajusta la posición del logo [left, top, right, bottom]
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
      content: [],
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
      if (index > 0 && matriculados.length > 0 && asignacion.id) {
        this.def.content.push({ text: '', pageBreak: 'before' });
      }

      if (matriculados.length > 0 && asignacion.id)
        this.def.content.push(
          ...crearAsignacion(asignacion, matriculados, curso, logoColegio, logo)
        );
    });

  }




  async listadoGeneral(asignaciones: Asignacion[], matriculados: User[], curso: Curso) {
    const logoColegioOriginal = 'assets/images/logocolegio.png'; // URL de la imagen
    const logoColegio = await getImageBase64(logoColegioOriginal);
    const logoOriginal = 'assets/images/logo.png'; // URL de la imagen
    const logo = await getImageBase64(logoOriginal);

    this.def = {
      pageSize: 'LETTER',
      pageMargins: [40, 105, 40, 60], // [left, top, right, bottom]
      background: function (currentPag: any, pageSize: any) {
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
      header: function (currentPage: any, pageCount: any) {
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
                { text: 'Listado', fontSize: 8 },
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

      footer: function (currentPage: any, pageCount: any) {
        return {
          columns: [
            {
              image: logo,
              width: 72, // Ajusta esto según el tamaño que necesites
              margin: [0, 10, 0, 0] // Ajusta la posición del logo [left, top, right, bottom]
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
      content: [],
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



  async boletinCurso(data: any) {
    const logoColegioOriginal = 'assets/images/logocolegio.png'; // URL de la imagen
    const logoColegio = await getImageBase64(logoColegioOriginal);
    const logoOriginal = 'assets/images/logo.png'; // URL de la imagen
    const logo = await getImageBase64(logoOriginal);

    this.def = {
      pageSize: 'LETTER',
      pageMargins: [40, 105, 40, 60], // [left, top, right, bottom]
      background: function (currentPag: any, pageSize: any) {
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
      header: function (currentPage: any, pageCount: any) {
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
                { text: 'Boletin', bold: true, fontSize: 12 },
                { text: 'Individual', bold: true, fontSize: 10 },
              ],
              alignment: 'center',
              margin: [0, 30, 40, 0] // Ajusta la posición del texto [left, top, right, bottom]
            }
          ],
          // Definición de los anchos de cada columna
          columnGap: 10
        };
      },

      footer: function (currentPage: any, pageCount: any) {
        return {
          columns: [
            {
              image: logo,
              width: 72, // Ajusta esto según el tamaño que necesites
              margin: [0, 10, 0, 0] // Ajusta la posición del logo [left, top, right, bottom]
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
      content: [],
      styles: {
        tableHeader: {
          bold: true,
          fontSize: 8,
          color: 'black'
        },
        textoEnc: {
          bold: true,
          fontSize: 8,
          color: 'black'
        },
        grisEnc: {
          bold: true,
          fontSize: 8,
          color: '#666',
          fillColor: '#f5f5f5'
        },
        etiqueta: {
          bold: true,
          fontSize: 10,
          color: '#111',
          fillColor: '#f1f8ff'
        },
        areaEtiqueta: {
          bold: true,
          fontSize: 9,
          color: '#111',
          fillColor: '#f3f3f3'
        },
        asignaturaEtiqueta: {
          bold: false,
          fontSize: 9,
          color: '#111'
        },

        // Otros estilos según sea necesario
      }
    };
    //const wd = 35;
    /** ENCABEZADO */


    data.forEach((registro: any, index: number) => {
      // Aquí añades el título de la asignación y la tabla de alumnos correspondiente
      // Si no es la primera asignación, agrega un salto de página antes de la nueva sección
      if (index > 0) {
        this.def.content.push({ text: '', pageBreak: 'before' });
      }

      this.def.content.push(
        ...botetinAlumno(registro)
      );
    });


  }

  public async consolidadoCurso(data: ConsolidadoCurso): Promise<void> {
    const logoColegio = await getLogoColegio();
    const logoOctagono = await getLogoOctagono();

    this.def = {
      pageSize: 'LETTER',
      pageOrientation: 'landscape',
      pageMargins: [40, 105, 40, 60],
      background: backgroundPage,
      header: (currentPage: any, pageCount: any, pageSize: any) =>
        headerPageConsolidado(logoColegio, data),
      footer: (currentPage: any, pageCount: any) =>
        footerPage(logoOctagono),
      // ESTA ES LA LÍNEA IMPORTANTE:
      // Llama a la nueva función que entiende la estructura de 'ConsolidadoCurso'
      content: crearTablaConsolidado(data),
      styles: {
        tableHeader: { bold: true, fontSize: 8, color: 'black', alignment: 'center', fillColor: '#eeeeee' },
        tableCell: { fontSize: 8, color: 'black', alignment: 'center' },
        studentName: { fontSize: 8, color: 'black', alignment: 'left' }
      }
    };
  }

  /**
   * Construye un único PDF con múltiples consolidados de cursos.
   * @param listaDeConsolidados Un array con todos los objetos ConsolidadoCurso ya procesados.
   */
  public async consolidadosMultiplesCursos(listaDeConsolidados: ConsolidadoCurso[]): Promise<void> {
    const logoColegio = await getLogoColegio();
    const logoOctagono = await getLogoOctagono();

    // El array 'content' acumulará las tablas de todos los cursos
    const contentGeneral: any[] = [];

    listaDeConsolidados.forEach((consolidado, index) => {
      // Por cada consolidado, creamos su contenido (título + tabla)
      contentGeneral.push({
        text: `CONSOLIDADO DE NOTAS - ${consolidado.cursoInfo.grado} (${consolidado.cursoInfo.curso})`,
        fontSize: 14,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 10] // Margen inferior
      });
      contentGeneral.push(crearTablaConsolidado(consolidado)); // Reutilizamos la función que crea la tabla
      contentGeneral.push({ text: 'NOTACIONES', fontSize: 10, bold: true, alignment: 'left', margin: [0, 10, 0, 5] });
      contentGeneral.push(crearLeyendaDeAbreviaturas(consolidado));

      // Si no es el último curso, añade un salto de página
      if (index < listaDeConsolidados.length - 1) {
        contentGeneral.push({ text: '', pageBreak: 'after' });
      }
    });

    // Ahora definimos el documento completo con el contenido acumulado
    this.def = {
      pageSize: 'LETTER',
      pageOrientation: 'landscape',
      pageMargins: [40, 105, 40, 60],
      background: backgroundPage,
      // Usamos un header genérico ya que el título de cada curso está en el contenido
      header: headerPage('CONSOLIDADO GENERAL DE CURSOS', logoColegio),
      footer: footerPage(logoOctagono),
      content: contentGeneral, // Aquí va todo el contenido acumulado
      styles: {
        tableHeader: { bold: true, fontSize: 8, color: 'black', alignment: 'center', fillColor: '#eeeeee' },
        tableCell: { fontSize: 8, color: 'black', alignment: 'center' },
        studentName: { fontSize: 8, color: 'black', alignment: 'left' },
        leyendaItem: { fontSize: 8, margin: [0, 0, 0, 2] }
      }
    };
  }
  /*
    async consolidadoCurso(data: Consolidado){
      const logoColegioOriginal = 'assets/images/logocolegio.png';
      const logoColegio = await getImageBase64(logoColegioOriginal);
      const logoOriginal = 'assets/images/logo.png';
      const logo = await getImageBase64(logoOriginal);
  
      this.def = {
        pageSize: 'LETTER',
        pageMargins: [40, 105, 40, 60],
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
                  { text: 'Consolidado', bold: true, fontSize:  12},
                  { text: 'Notas', bold: true, fontSize: 10 },
                  { text: data.curso.nombre, bold: true, fontSize: 10 },
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
                margin: [0, 10, 0, 0] // Ajusta la posición del logo [left, top, right, bottom]
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
        content: [consolidado(data)],
        styles: {
          // Otros estilos según sea necesario
        },
        layout: {
          hLineWidth: () => 0,
          vLineWidth: () => 0,
          paddingLeft: () => 0,
          paddingRight: () => 0,
          paddingTop: () => 0,
          paddingBottom: () => 0,
        },
      };
  
  
  
  
  
    }
  */


  /**
   * Funcion: Listado General de Estudiantes con Notas por Asignación
   * @param data: Datos de las asignaciones
   *
   * */

  async listadoGeneralNotas(data: any, isDocente: boolean = false) {
    this.logo = await getLogoOctagono();
    this.logoColegio = await getLogoColegio();
    this.def = {
      pageSize: 'LETTER',
      pageMargins: [40, 105, 40, 60],
      background: (currentPag: any, pageSize: any) => {
        return backgroundPage(currentPag, pageSize);
      },
      header: () => {
        return headerPage('Listado con Notas', this.logoColegio);
      },
      footer: () => {
        return footerPage(this.logo);
      },
      content: [listadosConNotas(data, isDocente)],
      styles: {

      },
      layout: {
        hLineWidth: () => 0,
        vLineWidth: () => 0,
        paddingLeft: () => 0,
        paddingRight: () => 0,
        paddingTop: () => 0,
        paddingBottom: () => 0,
      },
    };
  }

  /**
   * Generador de Paz y Salvos
   * @param cursos
   */

  async pazysalvo(cursos: any[]) {
    // Cargar logos
    this.logo = await getLogoOctagono();
    this.logoColegio = await getLogoColegio();

    // Crear tarjetas de paz y salvo para cada estudiante en cada curso
    const tarjetasEstudiantes = cursos.flatMap((curso) => {
      return curso.matriculados.map((matriculado: any, index: number) => {
        // Cada vez que empieza un nuevo curso, reinicia el índice de estudiantes
        const pageBreak = (index + 1) % 3 === 0 ? 'after' : undefined;
        const estudiante = matriculado.alumno;

        return {
          margin: [0, 0, 0, 3],
          table: {
            widths: ['*'],
            body: [
              [{
                margin: [10, 10, 10, 10],
                stack: [
                  {
                    columns: [
                      {
                        image: this.logoColegio,
                        width: 50,
                        margin: [0, 0, 0, 0]
                      },
                      {
                        stack: [
                          { text: 'INSTITUTO COMERCIAL DEL PACIFICO', bold: true, fontSize: 13, alignment: 'left', margin: [10, 0, 0, 0] },
                          { text: 'Resolución No. 0602 de Agosto 28 del 2006, Dane No. 376109006564', italics: true, fontSize: 10, alignment: 'left', margin: [10, 0, 0, 0] },
                          { text: 'PAZ Y SALVO', bold: true, fontSize: 11, alignment: 'left', margin: [10, 0, 0, 0] },

                          { text: 'Lectivo ' + curso.curso.lectivo.fin.substring(0, 4), fontSize: 10, alignment: 'left', margin: [10, 0, 0, 0] },
                        ],
                        alignment: 'center',
                        width: '*'
                      }
                    ],
                    margin: [0, 0, 0, 0]
                  },
                  {
                    text: `Los suscritos funcionarios`,
                    fontSize: 10,
                    margin: [0, 0, 0, 5],
                    alignment: 'center'
                  },
                  {
                    text: `HACEMOS CONSTAR QUE:`,
                    fontSize: 12,
                    margin: [0, 0, 0, 0],
                    alignment: 'center',
                    bold: true
                  },
                  {
                    text: `${(estudiante.primer_apellido || '').toUpperCase()} ${(estudiante.segundo_apellido || '').toUpperCase()} ${(estudiante.primer_nombre || '').toUpperCase()} ${(estudiante.segundo_nombre || '').toUpperCase()} con código No. ${estudiante.nid} y matrícula en el grado ${curso.curso.nombre}, se encuentra a Paz y Salvo hasta la fecha con las dependencias cuya firma y sello aparecen a continuación:`,
                    fontSize: 10,
                    margin: [0, 10, 0, 10]
                  },
                  {
                    columns: [
                      { text: '_________________', alignment: 'center', width: '*' },
                      { text: '_________________', alignment: 'center', width: '*' },
                      { text: '_________________', alignment: 'center', width: '*' }
                    ],
                    margin: [0, 10, 0, 0]
                  },
                  {
                    columns: [
                      { text: 'Tesoreria', alignment: 'center', width: '*', fontSize: 9, color: '#9a9a9a' },
                      { text: 'Biblioteca', alignment: 'center', width: '*', fontSize: 9, color: '#9a9a9a' },
                      { text: 'Deportes', alignment: 'center', width: '*', fontSize: 9, color: '#9a9a9a' }
                    ],
                    margin: [0, 0, 0, 0]
                  },
                  {
                    columns: [
                      { text: '_________________', alignment: 'center', width: '*' },
                      { text: '_________________', alignment: 'center', width: '*' },
                      { text: '_________________', alignment: 'center', width: '*' }
                    ],
                    margin: [0, 10, 0, 0]
                  },
                  {
                    columns: [
                      { text: 'Salas', alignment: 'center', width: '*', fontSize: 9, color: '#9a9a9a' },
                      { text: 'Salón', alignment: 'center', width: '*', fontSize: 9, color: '#9a9a9a' },
                      { text: 'Otros', alignment: 'center', width: '*', fontSize: 9, color: '#9a9a9a' }
                    ],
                    margin: [0, 0, 0, 0]
                  }
                ],
                border: [true, true, true, true] // Borde alrededor del rectángulo de cada estudiante
              }]
            ]
          },
          layout: {
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            hLineColor: () => '#9a9a9a',
            vLineColor: () => '#9a9a9a',
            paddingLeft: () => 0,
            paddingRight: () => 0,
            paddingTop: () => 0,
            paddingBottom: () => 0,
          },
          pageBreak: pageBreak
        };
      });
    });


    // Definir la estructura del documento PDF
    this.def = {
      pageSize: 'LETTER',
      pageMargins: [30, 30, 30, 30],
      content: tarjetasEstudiantes,
      styles: {},
      layout: {
        hLineWidth: () => 0,
        vLineWidth: () => 0,
        paddingLeft: () => 0,
        paddingRight: () => 0,
        paddingTop: () => 0,
        paddingBottom: () => 0,
      },
    };
  }

  /**
   * Generador de Certificados de Estudio
   * @param data
   */

  async certificadoPromocion(data: any[]) {
    const logoColegioOriginal = 'assets/images/logocolegio.png'; // URL de la imagen
    const logoColegio = await getImageBase64(logoColegioOriginal);
    const logoOriginal = 'assets/images/logo.png'; // URL de la imagen
    const logo = await getImageBase64(logoOriginal);

    this.def = {
      pageSize: 'LETTER',
      pageMargins: [40, 105, 40, 60], // [left, top, right, bottom]
      background: function (currentPag: any, pageSize: any) {
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
      header: function (currentPage: any, pageCount: any) {
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
                { text: 'Certificación', bold: true, fontSize: 12 },
                { text: 'Estudiante', bold: true, fontSize: 10 },
              ],
              alignment: 'center',
              margin: [0, 30, 40, 0] // Ajusta la posición del texto [left, top, right, bottom]
            }
          ],
          // Definición de los anchos de cada columna
          columnGap: 10
        };
      },

      footer: function (currentPage: any, pageCount: any) {
        return {
          columns: [
            {
              image: logo,
              width: 72, // Ajusta esto según el tamaño que necesites
              margin: [0, 10, 0, 0] // Ajusta la posición del logo [left, top, right, bottom]
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
      content: [],
      styles: {
        tableHeader: {
          bold: true,
          fontSize: 8,
          color: 'black'
        },
        textoEnc: {
          bold: true,
          fontSize: 8,
          color: 'black'
        },
        grisEnc: {
          bold: true,
          fontSize: 8,
          color: '#666',
          fillColor: '#f5f5f5'
        },
        etiqueta: {
          bold: true,
          fontSize: 10,
          color: '#111',
          fillColor: '#f1f8ff'
        },
        areaEtiqueta: {
          bold: true,
          fontSize: 9,
          color: '#111',
          fillColor: '#f3f3f3'
        },
        asignaturaEtiqueta: {
          bold: false,
          fontSize: 9,
          color: '#111'
        },

        // Otros estilos según sea necesario
      }
    };
    //const wd = 35;
    /** ENCABEZADO */


    data.forEach((registro: any, index: number) => {
      // Aquí añades el título de la asignación y la tabla de alumnos correspondiente
      // Si no es la primera asignación, agrega un salto de página antes de la nueva sección
      if (index > 0) {
        this.def.content.push({ text: '', pageBreak: 'before' });
      }

      this.def.content.push(
        ...certificadoAlumno(registro)
      );


    });

  }






















  // Shared Helpers
  private fmt(val: any) {
    if (val === undefined || val === null || val === '') return '-';
    let num = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(num)) return '-';
    // Round to max 3 decimal places
    num = Math.round(num * 1000) / 1000;
    let s = num.toString();
    if (s.indexOf('.') === -1) {
      s += '.0';
    }
    return s;
  }

  private getColor(val: any, escalas: any[]) {
    if (val === undefined || val === null || val === '') return 'white';
    let num = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(num)) return 'white';

    // 1. Try exact match
    let scale = escalas.find(e => num >= e.minimo && num <= e.maximo);
    if (scale) return scale.color;

    // 2. Try truncated to 1 decimal
    let truncated = Math.floor(num * 10) / 10;
    scale = escalas.find(e => truncated >= e.minimo && truncated <= e.maximo);
    if (scale) return scale.color;

    return 'white';
  }

  private buildGradeCell(puesto: any, val: any, escalas: any[], isBold: boolean = false) {
    if (val === undefined || val === null || val === '') {
      return { text: '-', alignment: 'center', fontSize: 8, bold: isBold };
    }
    const color = this.getColor(val, escalas);
    const formattedVal = this.fmt(val);

    if (formattedVal === '-') {
      return { text: '-', alignment: 'center', fontSize: 8, bold: isBold };
    }

    return {
      columns: [
        { width: '*', text: '' },
        { width: 'auto', text: `${puesto} (`, fontSize: 8, bold: isBold, margin: [0, 1, 0, 0] },
        {
          width: 9,
          margin: [0, 3, 0, 0],
          canvas: [
            {
              type: 'rect',
              x: 2.5, y: -1.5,
              w: 5, h: 5,
              lineWidth: 0.5,
              lineColor: '#acacac',
              color: color
            }
          ]
        },
        { width: 'auto', text: formattedVal, fontSize: 8, bold: true, margin: [0, 1, 0, 0] },
        { width: 'auto', text: ')', fontSize: 8, bold: isBold, margin: [0, 1, 0, 0] },
        { width: '*', text: '' }
      ]
    };
  }

  private buildSummaryTable(rankingList: any[], escalas: any[]) {
    if (!rankingList || rankingList.length === 0) return null;

    const headers = [
      { text: 'Puesto', style: 'tableHeader', alignment: 'center', fillColor: '#eeeeee', width: 50 },
      { text: 'Estudiante', style: 'tableHeader', alignment: 'left', fillColor: '#eeeeee', width: '*' },
      { text: 'Promedio', style: 'tableHeader', alignment: 'center', fillColor: '#eeeeee', width: 80 }
    ];

    const rows: any[] = [];
    const sortedList = [...rankingList].sort((a: any, b: any) => b.promedio - a.promedio);

    sortedList.forEach((entry: any) => {
      const gradeCell = this.buildGradeCell('', entry.promedio, escalas, false);

      // Adapted cell for summary (dot + grade only)
      const summaryGradeCell = gradeCell.columns ? {
        columns: [
          { width: '*', text: '' },
          {
            width: 9,
            margin: [0, 3, 0, 0],
            canvas: [
              { type: 'rect', x: 2.5, y: -1.5, w: 3, h: 3, lineWidth: 0.5, lineColor: '#dedede', color: this.getColor(entry.promedio, escalas) }
            ]
          },
          { width: 'auto', text: this.fmt(entry.promedio), fontSize: 9, bold: true, margin: [0, 1, 0, 0] },
          { width: '*', text: '' }
        ]
      } : { text: '-', alignment: 'center' };

      rows.push([
        { text: entry.puesto.toString(), alignment: 'center', fontSize: 9 },
        { text: `${entry.alumno.primer_apellido} ${entry.alumno.segundo_apellido || ''} ${entry.alumno.primer_nombre} ${entry.alumno.segundo_nombre || ''}`, fontSize: 9 },
        summaryGradeCell
      ]);
    });

    return {
      marginBottom: 20,
      table: {
        headerRows: 1,
        widths: headers.map(h => h.width),
        body: [headers, ...rows]
      },
      layout: 'lightHorizontalLines'
    };
  }

  private buildCourseHeader(curso: any) {
    const fontSize = 7;
    return {
      style: 'tableExample',
      table: {
        widths: ['15%', '35%', '15%', '35%'],
        body: [
          [
            { text: 'CURSO:', bold: true, fillColor: '#eeeeee', fontSize: fontSize },
            { text: (curso.nombre || '').toUpperCase(), fontSize: fontSize },
            { text: 'NIVEL:', bold: true, fillColor: '#eeeeee', fontSize: fontSize },
            { text: (curso.lectivo?.nivel?.nombre || '').toUpperCase(), fontSize: fontSize }
          ],
          [
            { text: 'GRADO:', bold: true, fillColor: '#eeeeee', fontSize: fontSize },
            { text: (curso.grado?.nombre || '').toUpperCase(), fontSize: fontSize },
            { text: 'SEDE:', bold: true, fillColor: '#eeeeee', fontSize: fontSize },
            { text: (curso.sede?.nombre || '').toUpperCase(), fontSize: fontSize }
          ],
          [
            { text: 'DIRECTOR:', bold: true, fillColor: '#eeeeee', fontSize: fontSize },
            { text: `${curso.director?.primer_nombre || ''} ${curso.director?.primer_apellido || ''}`.toUpperCase(), colSpan: 3, fontSize: fontSize },
            {}, {}
          ]
        ]
      },
      layout: 'lightHorizontalLines',
      marginBottom: 10
    };
  }

  public async puestosMultiplesCursos(coursesResults: any[], escalas: any[], detailed: boolean = false): Promise<void> {
    const logoColegio = await getLogoColegio();

    this.def = {
      pageSize: 'LETTER',
      pageMargins: [40, 105, 40, 60],
      background: backgroundPage,
      header: (currentPage: any, pageCount: any, pageSize: any) =>
        headerPagePuestos(logoColegio),
      content: [],
      styles: {
        header: { fontSize: 18, bold: true, alignment: 'center', margin: [0, 0, 0, 10] },
        subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
        tableHeader: { bold: true, fontSize: 10, color: 'black' }
      }
    };

    coursesResults.forEach((item, index) => {
      const { curso, ranking } = item;

      // 1. Title (Smaller font, first)
      this.def.content.push({
        text: `RANKING GENERAL PROMEDIO`,
        style: 'header',
        fontSize: 10,
        marginBottom: 5,
        marginTop: index > 0 ? 0 : 5 // Adjust top margin if needed
      });

      // 2. Course Header (Detailed Info Box, Uppercase, Small Font)
      this.def.content.push(this.buildCourseHeader(curso));

      // Add Table
      if (ranking.general || (ranking.total && ranking.total.length > 0)) {
        let table;
        if (detailed && ranking.periodos) {
          table = this.buildDetailedRankingTable(item.periodos || [], ranking, escalas);
        } else {
          table = this.buildSummaryTable(ranking.total || ranking.general, escalas);
        }

        if (table) {
          this.def.content.push(table);
        }
      } else {
        this.def.content.push({ text: 'Sin alumnos con notas registradas.', alignment: 'center', margin: [0, 20] });
      }

      // Add Page Break if not last
      if (index < coursesResults.length - 1) {
        this.def.content.push({ text: '', pageBreak: 'after' });
      }
    });

  }

  private buildDetailedRankingTable(periodos: any[], rankingData: any, escalas: any[]) {
    // Logic extracted/adapted from puestosCurso to build detailed table per subject
    // Identify active periods across the data to know which columns to show
    // However, we are passed a specific 'rankingData' for this subject.
    // rankingData structure from Curso.calcularRankingGeneral: { periodos: [ {periodo: 'Name', data: [...]}, ... ], general: [...] }

    const activePeriodos = periodos.filter((p: any) => {
      const pData = rankingData.periodos.find((rp: any) => rp.periodo === p.nombre);
      return pData && pData.data && pData.data.length > 0;
    });

    const headers = [
      { text: 'Estudiante', style: 'tableHeader', alignment: 'left', fillColor: '#eeeeee' }
    ];

    const widths: any[] = ['*'];

    activePeriodos.forEach((p: any) => {
      headers.push({ text: p.nombre.toUpperCase(), style: 'tableHeader', alignment: 'center', fillColor: '#eeeeee' });
      widths.push(50);
    });

    headers.push({ text: 'GENERAL', style: 'tableHeader', alignment: 'center', fillColor: '#e0e0e0' });
    widths.push(50);

    const studentMap = new Map();
    const addStudent = (stu: any) => {
      if (!studentMap.has(stu.id)) {
        studentMap.set(stu.id, stu);
      }
    };

    activePeriodos.forEach((p: any) => {
      const pData = rankingData.periodos.find((rp: any) => rp.periodo === p.nombre);
      if (pData) {
        pData.data.forEach((entry: any) => addStudent(entry.alumno));
      }
    });
    const generalList = rankingData.total || rankingData.general;
    if (generalList) {
      generalList.forEach((entry: any) => addStudent(entry.alumno));
    }

    const rows: any[] = [];
    const sortedStudents = Array.from(studentMap.values()).sort((a: any, b: any) =>
      (a.primer_apellido + a.primer_nombre).localeCompare(b.primer_apellido + b.primer_nombre)
    );

    sortedStudents.forEach((student: any) => {
      const row: any[] = [
        { text: `${student.primer_apellido} ${student.segundo_apellido || ''} ${student.primer_nombre} ${student.segundo_nombre || ''}`, fontSize: 8 }
      ];

      activePeriodos.forEach((p: any) => {
        const pData = rankingData.periodos.find((rp: any) => rp.periodo === p.nombre);
        const entry = pData ? pData.data.find((e: any) => e.alumno.id === student.id) : null;
        const val = entry ? (entry.nota || entry.promedio) : null;
        row.push(this.buildGradeCell(entry ? entry.puesto : '', val, escalas, false));
      });

      const gEntry = generalList ? generalList.find((e: any) => e.alumno.id === student.id) : null;
      const gVal = gEntry ? (gEntry.nota || gEntry.promedio) : null;
      row.push(this.buildGradeCell(gEntry ? gEntry.puesto : '', gVal, escalas, true));

      rows.push(row);
    });

    return {
      marginBottom: 20,
      table: {
        headerRows: 1,
        widths: widths,
        body: [headers, ...rows]
      },
      layout: 'lightHorizontalLines'
    };
  }


  public async puestosCurso(data: any, escalas: any[]): Promise<void> {
    const logoColegio = await getLogoColegio();
    const logoOctagono = await getLogoOctagono();

    const buildTable = (title: string, periodos: any[], rankingData: any) => {
      const activePeriodos = periodos.filter((p: any) => {
        const pData = rankingData.periodos.find((rp: any) => rp.periodo === p.nombre);
        return pData && pData.data && pData.data.length > 0;
      });

      if (activePeriodos.length === 0 && (!rankingData.total && !rankingData.general)) return null;

      const headers = [
        { text: 'Estudiante', style: 'tableHeader', alignment: 'left', fillColor: '#eeeeee' }
      ];

      const widths: any[] = ['*'];

      activePeriodos.forEach((p: any) => {
        headers.push({ text: p.nombre.toUpperCase(), style: 'tableHeader', alignment: 'center', fillColor: '#eeeeee' });
        widths.push(50);
      });

      headers.push({ text: 'GENERAL', style: 'tableHeader', alignment: 'center', fillColor: '#e0e0e0' });
      widths.push(50);

      const studentMap = new Map();
      const addStudent = (stu: any) => {
        if (!studentMap.has(stu.id)) {
          studentMap.set(stu.id, stu);
        }
      };

      activePeriodos.forEach((p: any) => {
        const pData = rankingData.periodos.find((rp: any) => rp.periodo === p.nombre);
        if (pData) {
          pData.data.forEach((entry: any) => addStudent(entry.alumno));
        }
      });
      const generalList = rankingData.total || rankingData.general;
      if (generalList) {
        generalList.forEach((entry: any) => addStudent(entry.alumno));
      }

      const rows: any[] = [];
      const sortedStudents = Array.from(studentMap.values()).sort((a: any, b: any) =>
        (a.primer_apellido + a.primer_nombre).localeCompare(b.primer_apellido + b.primer_nombre)
      );

      sortedStudents.forEach((student: any) => {
        const row: any[] = [
          { text: `${student.primer_apellido} ${student.segundo_apellido || ''} ${student.primer_nombre} ${student.segundo_nombre || ''}`, fontSize: 8 }
        ];

        activePeriodos.forEach((p: any) => {
          const pData = rankingData.periodos.find((rp: any) => rp.periodo === p.nombre);
          const entry = pData ? pData.data.find((e: any) => e.alumno.id === student.id) : null;
          const val = entry ? (entry.nota || entry.promedio) : null;
          row.push(this.buildGradeCell(entry ? entry.puesto : '', val, escalas, false));
        });

        const gEntry = generalList ? generalList.find((e: any) => e.alumno.id === student.id) : null;
        const gVal = gEntry ? (gEntry.nota || gEntry.promedio) : null;
        row.push(this.buildGradeCell(gEntry ? gEntry.puesto : '', gVal, escalas, true));

        rows.push(row);
      });

      return {
        marginBottom: 10,
        table: {
          headerRows: 1,
          widths: widths,
          body: [headers, ...rows]
        },
        layout: 'lightHorizontalLines'
      };
    };

    // Extract distinct periods from data.general.periodos to know columns.
    // They are already sorted in data.general.periodos because we did that in the Component.
    const allPeriodosRaw = data.general.periodos.map((p: any) => ({ nombre: p.periodo }));


    const content: any[] = [];

    // 0. Summary Table (First Page)
    if (data.general.total) {
      const summaryTable = this.buildSummaryTable(data.general.total, escalas);
      if (summaryTable) {
        content.push({ text: 'RANKING GENERAL PROMEDIO', style: 'header', marginBottom: 10 });
        content.push(summaryTable);
        content.push({ text: '', pageBreak: 'after' });
      }
    }

    // 1. General Table
    const tableGeneral = buildTable("GENERAL", allPeriodosRaw, data.general);
    if (tableGeneral) {
      content.push({ text: 'CONSOLIDADO GENERAL PUESTOS', style: 'header', marginBottom: 5 });
      content.push(tableGeneral);
    }

    // 2. Subjects
    data.asignaturas.forEach((asig: any) => {
      // asig has { materia: "Name", periodos: [...], general: [...] }
      // format for buildTable expects { periodos: [...], total: asig.general }
      const asigData = {
        periodos: asig.periodos, // Array of {periodo, orden, data}
        total: asig.general
      };

      const tableSubject = buildTable(asig.materia, allPeriodosRaw, asigData);

      if (tableSubject) {
        content.push({ text: `ASIGNATURA: ${asig.materia.toUpperCase()}`, style: 'subheader', marginTop: 10, marginBottom: 2 });
        content.push(tableSubject);
      }
    });

    this.def = {
      pageSize: 'LETTER',
      pageMargins: [40, 105, 40, 60],
      background: backgroundPage,
      header: function (currentPage: any, pageCount: any) {
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
                { text: 'Ranking', bold: true, fontSize: 9 },

              ],
              alignment: 'center',
              margin: [0, 30, 40, 0] // Ajusta la posición del texto [left, top, right, bottom]
            }
          ],
          // Definición de los anchos de cada columna
          columnGap: 10
        };
      },

      footer: function (currentPage: any, pageCount: any) {
        return {
          columns: [
            {
              image: logoOctagono,
              width: 72, // Ajusta esto según el tamaño que necesites
              margin: [0, 10, 0, 0] // Ajusta la posición del logo [left, top, right, bottom]
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
      content: content,
      styles: {
        header: { bold: true, fontSize: 12, color: 'black' },
        subheader: { bold: true, fontSize: 10, color: '#444' },
        tableHeader: { bold: true, fontSize: 8, color: 'black', fillColor: '#eeeeee' }
      }
    };
  }

}
