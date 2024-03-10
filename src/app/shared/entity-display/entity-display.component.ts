import { Component, Input, OnInit } from '@angular/core';
import { Entity } from 'src/app/model/entity';
import { CrudService } from 'src/app/service/crud.service'; // Asegúrate de que la ruta sea correcta
import { Observable } from 'rxjs';

export interface ColumnConfig {
  key: string;
  displayName: string;
}

export interface EntityConfig {
  id: number | string;
  endpoint: string;
  columns: ColumnConfig[];
  actions: { [action: string]: string };
}

@Component({
  selector: 'app-entity-display',
  templateUrl: './entity-display.component.html',
  styleUrls: ['./entity-display.component.css']
})
export class EntityDisplayComponent implements OnInit {
  @Input() config!: EntityConfig;
  @Input() entityData!: Entity;
  //public entityData$!: Observable<Entity[]>;

  constructor(private crudService: CrudService<Entity>) {}

  async ngOnInit() {
    //await this.loadEntityData();
  }

  loadEntityData(): void {
    // Asume que el servicio devuelve un array, pero solo nos interesa el primer elemento
    //this.entityData$ = this.crudService.read(this.config.endpoint, { id: this.config.id });
  }
}
