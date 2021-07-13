import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Task } from 'src/app/models/task';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  user: User = new User()
  newTask: Task = new Task()

  loading: boolean = true

  reloadCanceled: HTMLButtonElement
  reloadDone: HTMLButtonElement
  reloadTodo: HTMLButtonElement

  constructor(private users: UserService,
              private snack: MatSnackBar) { }

  ngOnInit() {
    this.users.logged().subscribe((res: any) => {
      if(res != 'not logged in') this.user = res
      this.loading = false
    })
  }

  dialog(message) {
    this.snack.open(message, '', {duration: 4000})
  }

  handleTaskSaved(saved) {
    this.dialog('Tarea guardada')
    this.reloadTodo.click()
    this.newTask = new Task()
  }

  handleTodoState(loading) {
    this.loading = loading
    if(!loading) {
      if(this.reloadCanceled) this.reloadCanceled.click()
      if(this.reloadDone) this.reloadDone.click()
    }
  }

}
