import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Task } from 'src/app/models/task';
import { User } from 'src/app/models/user';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {

  @Input() user: User = new User()
  @Input() task: Task = new Task()
  @Input() edit: boolean = false
  @Input() hideButton: boolean = false
  @Input() name: string = 'taskForm'

  @Input() clientList: any[] = []
  @Input() propertyList: any[] = []
  
  @Output() saved = new EventEmitter<Task>()
  @Output() open = new EventEmitter<ElementRef>()

  availableClients: any[] = [...this.clientList]
  availableProperties: any[] = [...this.propertyList]
  selectedClients: any = {}
  selectedProperties: any = {}
  
  today: Date = new Date()
  taskDate: Date = new Date()

  // reminder: Reminder = new Reminder()

  loading: boolean = false

  @ViewChild('closeForm', {static: false}) closeForm: ElementRef
  @ViewChild('openButton', {static: false}) openButton: ElementRef
  @ViewChild('base', {static: false}) base: ElementRef

  constructor(private tasks: TaskService) { }

  ngOnInit() {
  }

  ngOnChanges(changes) {
    if(changes.clientList && changes.clientList.firstChange) this.availableClients = [...this.clientList]
    if(changes.propertyList && changes.propertyList.firstChange) this.availableProperties = [...this.propertyList]
    if(changes.task) {
      this.taskDate = this.task.date

    }
  }

  ngAfterViewInit() {
    this.open.emit(this.openButton)
    document.body.appendChild(this.base.nativeElement)
  }

  ngOnDestroy() {
    document.body.removeChild(this.base.nativeElement)
  }

  // addClient(event, input) {
  //   const value: string = event.target.value.toLowerCase()
  //   const i = this.availableClients.findIndex(client => client.name.toLowerCase() == value)
  //   if(i != -1) {
  //     const client = this.availableClients[i]
  //     this.task.clients_ids.push(client._id)
  //     this.selectedClients[client._id] = client.name
  //     this.availableClients.splice(i, 1)
  //     input.value = ''
  //   }
  // }

  // removeClient(id) {
  //   const i = this.task.clients_ids.findIndex(client_id => client_id == id)
  //   if(i != -1) {
  //     this.task.clients_ids.splice(i, 1)
  //     delete this.selectedClients[id]
  //     const client = this.clientList.find(client => client._id == id)
  //     if(client) this.availableClients.push(client)
  //   }
  // }

  addProperty(event, input) {
    const value: string = event.target.value.toLowerCase()
    const i = this.availableProperties.findIndex(property => property.title.toLowerCase() == value)
    if(i != -1) {
      const property = this.availableProperties[i]
      this.task.properties_ids.push(property._id)
      this.selectedProperties[property._id] = property.title
      this.availableProperties.splice(i, 1)
      input.value = ''
    }
  }

  removeProperty(id) {
    const i = this.task.properties_ids.findIndex(property_id => property_id == id)
    if(i != -1) {
      this.task.properties_ids.splice(i, 1)
      delete this.selectedProperties[id]
      const property = this.propertyList.find(property => property._id == id)
      if(property) this.availableProperties.push(property)
    }
  }

  saveTask() {
    this.loading = true
    this.task.date = new Date(this.taskDate)
    if(this.edit) {
      this.tasks.update(this.task).subscribe((res: any) => {
        this.handleTaskSaved(res)
      })
    } else {
      this.task.user_id = this.user._id
      this.tasks.create(this.task).subscribe((res: any) => {
        this.handleTaskSaved(res)
      })
    }
  }

  handleTaskSaved(task) {
    this.loading = false
    if(task != 'error') {
      this.saved.emit(task)
      this.closeForm.nativeElement.click()
    }
  }

  // setReminder() {
  //   const date = new Date(this.task.date)
  //   if(this.reminder.unit == 'week') date.setDate(date.getDate() - (this.reminder.quantity * 7))
  //   else if(this.reminder.unit == 'day') date.setDate(date.getDate() - this.reminder.quantity)
  //   else if(this.reminder.unit == 'hour') date.setHours(date.getHours() - this.reminder.quantity)
  //   else date.setMinutes(date.getMinutes() - this.reminder.quantity)
  //   this.task.notify = date
  // }

}
