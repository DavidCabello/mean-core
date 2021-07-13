import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.scss']
})
export class SimulatorComponent implements OnInit {

  register: ElementRef
  billing = {
    period: 'Mensual',
    quantity: 1
  }
  total: number = 0
  period = {
    Mensual: 1,
    Semestral: 6,
    Anual: 12
  }
  discount = {
    Mensual: 0,
    Semestral: 0.025,
    Anual: 0.05
  }
  labels = {
    Mensual: 'mes',
    Semestral: 'semestre',
    Anual: 'año'
  }
  totalDiscount = 0
  totalLabel = 'mes'

  constructor() { }

  ngOnInit() {
    this.calculate()
  }

  calculate() {
    this.totalDiscount = (this.billing.quantity <= 10 ? 0 : this.billing.quantity <= 20 ? 2.5 : 5) + this.discount[this.billing.period] * 100
    const base = 399 * this.period[this.billing.period]
    const baseDiscount = base * this.discount[this.billing.period]
    const discount = this.billing.quantity <= 10 ? 0 : this.billing.quantity <= 20 ? 0.025 * base : 0.05 * base
    this.total = base * this.billing.quantity - baseDiscount - (discount * this.billing.quantity)
    this.totalLabel = this.billing.quantity == 1 ? this.labels[this.billing.period] : this.billing.period == 'Mensual' ? 'meses' : this.labels[this.billing.period] + 's'
  }

  updatePeriod(period) {
    this.billing.period = period
    this.calculate()
  }

  signup() {
    sessionStorage.setItem('billing', JSON.stringify(this.billing))
    this.register.nativeElement.click()
  }

}
