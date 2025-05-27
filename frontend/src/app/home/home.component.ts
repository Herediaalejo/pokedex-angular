import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';

export interface MiModelo {
  username: string;
  password: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatPaginatorModule, MatTableModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = ['username', 'password'];
  dataSource: MatTableDataSource<MiModelo> | any;
  sort: any;
  paginator: any;
  constructor(private router: Router, private apiService: ApiService) {}

  async ngOnInit(): Promise<void> {
    this.apiService.getData().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    console.log(this.dataSource);
  }
  volver() {
    this.router.navigate(['/login']);
  }

  irPokedex() {
    this.router.navigate(['/pokedex']);
  }
}
