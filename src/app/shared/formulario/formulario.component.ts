import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Entity } from 'src/app/model/entity';

interface ColumnConfig {
  key: string;
  displayName: string;
  type?: 'text' | 'textarea' | 'select' | 'date' | 'email' | 'number' | 'hidden';
  value?: any;
  options?: {value: string, displayValue: string}[];
  required?: boolean;
  changevalue?: boolean;
}

interface FormConfig {
  columns: ColumnConfig[];
  endpoint: string;
  id: string;
}

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit, OnChanges {
  @Output() event = new EventEmitter
  @Input() config!: FormConfig;
  @Input() entityData!: Entity;
  @Input() message!: string;
  @Input() msg!: string;
  @Input() success: boolean = true;
  @Input() loading: boolean = false;
  public form!: FormGroup;


  constructor(
    private fb: FormBuilder
    ) {}

  ngOnInit(): void {
    this.form = this.createGroup();
  }
  ngOnChanges(changes: SimpleChanges): void {
    // Verifica si entityData ha cambiado
    if (changes['entityData']) {
      // Si entityData ha cambiado, reconstruye el formulario con los nuevos datos
      const prevValue = changes['entityData'].previousValue;
      const currentValue = changes['entityData'].currentValue;

      // Opcional: Puedes agregar lógica adicional para verificar si realmente necesitas reconstruir el formulario
      // Por ejemplo, solo reconstruir si los datos realmente han cambiado
      if (prevValue !== currentValue) {
        this.form = this.createGroup();
      }
    }
  }
  createGroup(): FormGroup {
    const group = this.fb.group({});
    if (this.config && this.config.columns) {
      this.config.columns.forEach(col => {
        const initialValue = this.entityData ? this.entityData[col.key] : '';
        let validators = col.required ? [Validators.required] : [];

        if (col.type === 'email') {
          validators.push(Validators.email);
        }
        let control = this.fb.control(initialValue, validators);

        if (col.type === 'date') {
          control.setValue(initialValue ? new Date(initialValue).toISOString().substring(0, 10) : ''); // Formato de fecha 'YYYY-MM-DD'
        }

        group.addControl(col.key, control);

      });
    }
    return group;
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.event.emit(this.form.value)
    }
  }

  onSelectChange(event: Event, key: string): void {
    const target = event.target as HTMLSelectElement; // Asertión de tipo
    const value = target.value;
    if (value) {
      if (this.config.columns.find(col => col.key === key)?.changevalue) {
        // Aquí puedes manejar el valor cambiado como desees
        this.event.emit({data: value})
      }
    }
  }


}
