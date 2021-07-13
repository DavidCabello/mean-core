import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { TasksRoutingModule } from './tasks-routing.module';
import { BoardComponent } from './board/board.component';
import { TaskFormComponent } from './task-form/task-form.component';
import { MatInputModule, MatSnackBarModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { TaskListComponent } from './task-list/task-list.component';


@NgModule({
  declarations: [BoardComponent, TaskFormComponent, TaskListComponent],
  imports: [
    CommonModule,
    TasksRoutingModule,
    SharedModule,
    MatInputModule,
    FormsModule,
    MatSnackBarModule
  ]
})
export class TasksModule { }
