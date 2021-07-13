import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task } from 'src/app/models/task';
import { User } from 'src/app/models/user';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {

  @Input() type: string = 'todo'
  @Input() user: User

  @Output() loading = new EventEmitter<boolean>()
  @Output() reload = new EventEmitter<HTMLButtonElement>()

  tasklist: Task[] = []
  selectedTask: Task = new Task()

  clientNames: any = {
    '01': 'Juan Pérez',
    '02': 'Roberto López'
  }
  propertyTitles: any = {
    '01': 'Casa en Chapalita',
    '02': 'Departamento en El Sauz',
    '03': 'Casa en Providencia'
  }

  openForm: ElementRef
  confirmDelete: ElementRef

  actions: any = {
    call: 'Llamar',
    wa: 'Enviar mensaje',
    email: 'Enviar correo',
    properties: 'Buscar propiedades'
  }
  icons: any = {
    call: 'phone-call',
    wa: 'whatsapp',
    email: 'envelope',
    properties: 'search-marker'
  }

  constructor(private tasks: TaskService) { }

  ngOnInit() {
    this.loading.emit(true)
    this.load()
  }

  ngAfterViewInit() {
    const button = document.createElement('button')
    button.addEventListener('click', () => {this.load()})
    this.reload.emit(button)
  }

  load() {
    if(this.type == 'todo') {
      this.tasks.todo().subscribe((res: any) => {
        const now = new Date()
        this.tasklist = res.map(task => {
          const date = new Date(task.date)
          task.expired = date.getTime() < now.getTime()
          return task
        })
        this.loading.emit(false)
      })
    } else {
      this.tasks.state(this.type).subscribe((res: []) => {
        this.tasklist = res
      })
    }
  }

  complete(task) {
    this.loading.emit(true)
    task.done = false
    task.canceled = true
    this.tasks.update(task).subscribe(res => {
      this.load()
    })
  }

  cancel(task) {
    this.loading.emit(true)
    task.canceled = false
    task.done = true
    this.tasks.update(task).subscribe(res => {
      this.load()
    })
  }

  editTask(task) {
    this.selectedTask = {...task}
    this.openForm.nativeElement.click()
  }

  deleteTask(task) {
    this.selectedTask = task
    this.confirmDelete.nativeElement.click()
  }

  handleDeleteTask(confirm) {
    this.loading.emit(true)
    this.tasks.delete(this.selectedTask._id).subscribe((res: any) => {
      this.tasklist = this.tasklist.filter(task => task._id != res._id)
      this.loading.emit(false)
    })
  }

}
