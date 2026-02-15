import { Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Entity } from 'src/app/model/entity';
import { CrudService } from 'src/app/service/crud.service';
@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.css']
})
export class DatatableComponent implements OnInit, OnChanges {
  @Input() config: any;
  @Input() data: Entity[] = [];
  @Input() loading: boolean = false;
  @Output() event = new EventEmitter
  @Output() toggleEvent = new EventEmitter<any>()

  @Input() message!: string;
  @Input() success: boolean = true;


  public displayedData: Entity[] = [];

  public itemParaEliminar: Entity | null = null;
  public mensajeRespuesta: string = '';
  public codigoRespuesta: number | null = null;


  allData: Entity[] = []; // Datos completos para paginación
  sizePagina: number = 10;
  paginaActual: number = 1;
  numeroPaginas: number = 0;

  /**
   *
   * @param router
   */

  constructor(
    public router: Router,
    private crudService: CrudService<Entity>
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && changes['data'].currentValue) {
      // Aquí usamos la notación de corchetes para acceder a 'data'
      this.displayedData = [...changes['data'].currentValue];
      this.calcularPaginacion();
    }
  }
  getNestedPropertyValue(item: any, path: string): any {
    return path.split('.').reduce((obj, key) => obj && obj[key], item);
  }
  loadData() {

  }

  calcularPaginacion(): void {
    this.numeroPaginas = Math.ceil(this.allData.length / this.sizePagina);
    this.cambiarPagina(this.paginaActual);
  }
  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina < 1 || nuevaPagina > this.numeroPaginas) return;
    this.paginaActual = nuevaPagina;
    const inicio = (this.paginaActual - 1) * this.sizePagina;
    const fin = inicio + this.sizePagina;
    this.displayedData = this.allData.slice(inicio, fin);
  }
  filtrarDatos(event: Event): void {
    const valor = (event.target as HTMLInputElement).value.toLowerCase();
    if (!valor) {
      this.allData = [...this.data];
    } else {
      this.allData = this.data.filter(item =>
        this.config.columns.some((column: any) => {
          const itemValue = item[column.key].toString().toLowerCase();
          return itemValue.includes(valor);
        })
      );
    }
    this.calcularPaginacion();
  }


  cancelarEliminar(): void {
    this.itemParaEliminar = null;
  }





  // Puedes incluir un método para manejar la respuesta del servidor
  // después de que se confirme la eliminación.
  manejarRespuesta(codigo: number, mensaje: string): void {
    this.codigoRespuesta = codigo;
    this.mensajeRespuesta = mensaje;
    setTimeout(() => this.mensajeRespuesta = '', 3000); // Limpiar mensaje después de 3 segundos
  }


  mostrarMensajeRespuesta(): void {
    setTimeout(() => {
      this.mensajeRespuesta = '';
    }, 3000); // Oculta el mensaje después de 5 segundos
  }
  simularRespuestaServidor(): number {
    // Simula una respuesta del servidor con una pequeña probabilidad
    const respuestas = [204, 401, 0];
    return respuestas[Math.floor(Math.random() * respuestas.length)];
  }



  // CRUD
  agregar() {
    this.router.navigate([this.config.actions.add])
  }
  ver(item: any) {
    this.router.navigate([this.config.actions.view + item.id])
  }
  editar(item: any) {
    this.router.navigate([this.config.actions.edit + item.id])
  }
  eliminar(item: Entity): void {
    this.itemParaEliminar = item;
  }
  confirmarEliminar(): void {
    if (this.itemParaEliminar) {
      this.event.emit(this.itemParaEliminar.id)
      this.itemParaEliminar = null;
      /*
      this.crudService.delete(this.config.endpoint, this.itemParaEliminar.id).subscribe({
        next: (res: any) => {
          this.data = this.data.filter(r => r !== this.itemParaEliminar);
          this.allData = [...this.data];
          this.calcularPaginacion();
          this.mostrarMensajeRespuesta();
          this.itemParaEliminar = null; // Opcional, resetear después de emitir
        },
        error: (error) => {
          console.error('Error al obtener los roles:', error);
          this.itemParaEliminar = null; // Opcional, resetear después de emitir
        }
      });
      */

    }
  }
  onToggleEstado(item: any) {
    this.toggleEvent.emit(item);
  }

  gettime() {
    return Math.random() * 1000
  }


}
