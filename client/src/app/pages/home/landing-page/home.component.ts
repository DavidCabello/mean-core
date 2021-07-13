import { Component, ElementRef, OnInit } from '@angular/core';
import AOS from 'aos';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  cards = [
    {icon: 'opiniondevalor', header: 'Opinión de valor', text: 'Ayuda a tu cliente a conocer el valor real de su inmueble en menos de 15 minutos.'},
    {icon: 'fotografiayvideo', header: 'Fotografía y video', text: 'Te conectamos con los expertos en foto y video arquitectónico.'},
    {icon: 'impuestos', header: 'Cálculo de impuestos', text: 'Ayuda a tus clientes (vendedores y compradores) a conocer un aproximado de los impuestos que deberán pagar.'},
    {icon: 'comparte', header: 'Comparte tus propiedades', text: 'Envía a tus clientes la ficha técnica de tus inmuebles por WhatsApp y correo.'},
    {icon: 'asesorialegal', header: 'Asesoría legal', text: 'Te ayudamos a verificar si la propiedad está en regla:\n\nCatastro y registro público\nCFE\nSIAPA'},
    {icon: 'colabora', header: 'Colabora', text: 'Ofrece y recibe comisiones por comercializar tu inmueble y el de otros colegas en Vilcom.'},
    {icon: 'administra', header: 'Administra tu inmobiliaria', text: 'Da seguimiento a tus asesores y clientes potenciales.'},
    {icon: 'encuentra', header: 'Encuentra la propiedad', text: 'Busca en los principales portales  inmobiliarios sin salir de Vilcom.'},
    {icon: 'marketing', header: 'Marketing 360°', text: 'Ayuda a tu cliente a vender más rápido a través de Facebook, Instagram, Google Ads y en los principales portales inmobiliarios.'},
    {icon: 'estadisticas', header: 'Estadísticas 360°', text: ''},
  ]
  table = ['Foto y video', 'Subir propiedades', 'Envío de fichas técnicas por WhatsApp y correo', 'CRM para manejo de clientes y asesores', 'Replicación de inmuebles en portales inmobiliarios', 'Crea requerimientos de inmuebles', 'Busca inmuebles en Vilcom y otros portales', 'Visualiza tareas pendiente por cliente, asesor o inmueble', 'Opinión de valor ilimitadas', 'Cálculo de impuestos vendedor (ISR) ilimitados', 'Cálculo de impuestos comprador ilimitados', 'Reporte de estadísticos de asesores', 'Reporte de estadísticos de inmuebles', 'Descuento en servicios complementarios', 'Capacitaciones']

  register: ElementRef

  loader = true

  constructor() { }

  ngOnInit() { 
    AOS.init()
  }

  ngAfterViewInit() {
    const i = setInterval(() => {
      this.loader = false
      clearInterval(i)
    }, 5000)
  }

}
