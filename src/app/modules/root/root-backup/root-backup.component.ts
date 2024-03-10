import { Component, OnInit } from '@angular/core';
import { Entity } from 'src/app/model/entity';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-root-backup',
  templateUrl: './root-backup.component.html',
  styleUrls: ['./root-backup.component.css']
})
export class RootBackupComponent implements OnInit {
  public loading: boolean = false;
  public downloadfile: string = ''
  public backups: any[] = [];
  countdown: number = 0;

  constructor(
    public crudService: CrudService<Entity>
  ) { }
  ngOnInit(): void {
    this.listar()
  }
  startBackup() {
    this.loading = true
    this.countdown = 10
    this.crudService.read('/root/backup').subscribe({
      next: (response) => {
        this.loading = false
        const interval = setInterval(() => {
          this.countdown--;
          // Cuando la cuenta regresiva llega a 0, limpia el intervalo
          if (this.countdown === 0) {
            clearInterval(interval);
            // Llama al método listar para cargar los archivos de backup
            this.listar();
          }
        }, 1000);
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
      }
    });
  }
  listar() {
    this.loading = true
    this.crudService.read('/root/backup/listar').subscribe({
      next: (response: any) => {
        this.backups = response.backups;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
      }
    });
  }
}
