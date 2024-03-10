import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, filter, distinctUntilChanged, tap } from 'rxjs/operators';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-alumno-buscar',
  templateUrl: './alumno-buscar.component.html',
  styleUrls: ['./alumno-buscar.component.css']
})
export class AlumnoBuscarComponent implements OnInit {
  @Input() loading: boolean = false
  @Input() users: User[] = [];
  @Input() placeholder= 'Buscar Alumnos'
  @Output() event = new EventEmitter
  public formsearch: FormGroup;
  showAllResults: boolean = false;

  constructor(private fb: FormBuilder) {
    this.formsearch = this.fb.group({
      buscar: ['']
    });
  }

  ngOnInit(): void {
    this.formsearch.get('buscar')!.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(term => {
        if (term.length >= 0 && term.length < 3) {
          // Si el término tiene menos de 3 letras y no está vacío, llama a otro método para limpiar

          this.removeUsers();
        }
      }),
      filter(term => term.length > 3 || term.length === 0),
    ).subscribe(term => {
      this.filterUsers(term);
    });
  }

  filterUsers(searchTerm: string) {
    this.loading = false
    this.event.emit({term: searchTerm})
  }

  removeUsers() {
    this.loading = false
    this.users =  []
  }

  toggleShowAll() {
    this.showAllResults = !this.showAllResults;
  }

  get visibleUsers() {
    // Decide aquí si mostrar todos los usuarios o solo una cantidad limitada basada en `showAllResults`
    const filteredUsers = this.users; // Reemplaza esto con tu lógica de filtrado real
    return this.showAllResults ? filteredUsers : filteredUsers.slice(0, 5);
  }

  onSelect(id: string){
    this.event.emit({user: id})
  }
}
