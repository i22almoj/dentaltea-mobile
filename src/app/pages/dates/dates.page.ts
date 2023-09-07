import { Component, ViewChild } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController, NavController} from '@ionic/angular';
import { APIService, RequestResponse } from '../../services/api.service';
import { DateService } from '../../services/date.service';
import { CalendarMode, Step } from 'ionic2-calendar/calendar';
import { CalendarComponent } from 'ionic2-calendar';

export interface Event{
  id: number,
  creationTime: any,
  dateTime: any,
  description: string
}

@Component({
  selector: 'app-dates',
  templateUrl: 'dates.page.html',
  styleUrls: ['dates.page.scss']
})
export class DatesPage {
  @ViewChild(CalendarComponent, { static: false }) myCalendar:CalendarComponent;
  dates: any = null;
  eventSource = [];
  viewTitle;
  categories : any;
  cc : any;
  events = [];
  isToday:boolean = false;
  calendar = {
      mode: 'month' as CalendarMode,
      step: 30 as Step,
      locale: 'es',
      startingDayWeek: 1,
      currentDate: new Date(),
      navDate : new Date(),
      currentMonth: new Date(),
      theme: 'iOS',
      filterOpen: false,
      calendarScroll: 'horizontal',
      noEventsLabel: '',
      allDayLabel: '',
      dateFormatter: {
          formatMonthViewDay: function(date:Date) {
              return date.getDate().toString();
          },
          formatMonthViewDayHeader: function(date:Date) {
              return 'MonMH';
          },
          formatMonthViewTitle: function(date:Date) {
              return 'testMT';
          },
          formatWeekViewDayHeader: function(date:Date) {
              return 'MonWH';
          },
          formatWeekViewTitle: function(date:Date) {
              return 'testWT';
          },
          formatWeekViewHourColumn: function(date:Date) {
              return 'testWH';
          },
          formatDayViewHourColumn: function(date:Date) {
              return 'testDH';
          },
          formatDayViewTitle: function(date:Date) {
              return 'testDT';
          }
      }
  };
  customPopoverOptions = {
    
  };

  @ViewChild(CalendarComponent) calendarComponent: CalendarComponent;

  constructor(private api: APIService, private dateService: DateService, private navController:NavController, public atrCtrl: AlertController, public router: Router) {}

  ionViewWillEnter() {
    this.isLoggedIn();
    console.log('Esta página se activó nuevamente desde otra pestaña.');
  }

  isLoggedIn(){
    this.api.isLoggedIn().then(
      (loggedIn) => {
        if(!loggedIn){
          this.goLogin();
        }else{
           this.loadEvents();
        }
      }
    );
  }

  getDates(){
    return new Promise( (resolve, reject) => {
      this.dateService.getDates().then(
        (response: RequestResponse) => {
          console.log('RESULTADO: ',response);
          if(response.success){
            resolve(response.data);
          }else{
            resolve([]);
          }
          
        },
        (error) => {
          resolve([]);
        }
      )
    });
  }

  goHome(){
    this.redirect('/app/home');
  }

  goLogin(){
    this.redirect('/acceder');
  }

  openEvent(id){
    console.log('Abrir ', id);
    this.redirect('/app/citas/ver/'+id);
  }

  redirect(path){
    const navigationExtras: NavigationExtras = { replaceUrl : true };
    this.router.navigateByUrl(path, navigationExtras);
  }


  today() {
    var prev_year = this.calendar.navDate.getFullYear();
    this.calendar.currentDate = this.calendar.navDate =  new Date();
    var current_year = this.calendar.navDate.getFullYear();
    if(prev_year!=current_year)
    this.loadEvents();
  }

  next() {
    this.calendarComponent.slideNext();
    var prev_year = this.calendar.navDate.getFullYear();
    var month = this.calendar.navDate.getMonth()+1;
    var year = this.calendar.navDate.getFullYear();
    if(month>11){
      month = 0;
      year = year+1;
    }
    
    this.calendar.navDate = new Date(year, month, 1);
    var current_year = this.calendar.navDate.getFullYear();
    if(prev_year!=current_year)
    this.loadEvents();
  }

  back() {
    this.calendarComponent.slidePrev();
    var prev_year = this.calendar.navDate.getFullYear();
    var month = this.calendar.navDate.getMonth()-1;
    var year = this.calendar.navDate.getFullYear();
    if(month<0){
      month = 11;
      year = year-1;
    }
    this.calendar.navDate = new Date(year, month, 1);
    var current_year = this.calendar.navDate.getFullYear();
    if(prev_year!=current_year)
      this.loadEvents();
  }

  loadEvents(){ 
    this.eventSource = null;
    this.events = [];
    console.log('Cargando citas de nuevo');
      this.getDates().then(
        (data) => {
          console.log('done events! ' + JSON.stringify(data));
          let events = data as Array<Event>; 
          
          
          console.log('Voy a cargar de nuevo estas citas:',  data);
          for(let i=0;i<events.length;i++){  
            this.events.push({
                id: events[i].id,
                description: events[i].description,
                event_id: events[i].id,
                startTime: this.createDateTimeFromSQL(events[i].dateTime.date),
                endTime: this.createDateTimeFromSQL(events[i].dateTime.date),
                allDay: false
            });
          }
          console.log(this.events);
          
          this.eventSource = this.events;
          this.myCalendar.loadEvents();
          
          
      },
      (err) => {
        console.log('Error recogiendo datos, error:' + err);
      }
    );


  }

  createDateTimeFromSQL(sqlDate) {
    // Separar los componentes de la cadena SQL
    var dateTimeParts = sqlDate.split(' ');
    var dateParts = dateTimeParts[0].split('-');
    var timeParts = dateTimeParts[1].split(':');

    var year = parseInt(dateParts[0], 10);
    var month = parseInt(dateParts[1], 10) - 1;
    var day = parseInt(dateParts[2], 10);
    var hours = parseInt(timeParts[0], 10);
    var minutes = parseInt(timeParts[1], 10);
    var seconds = parseInt(timeParts[2], 10);

    var dateTime = new Date(year, month, day, hours, minutes, seconds);

    return dateTime;
  }


 
  /*! function for showing popup alerts*/
  async showAlert(title: string, message: string) {
    const alert = await this.atrCtrl.create({
      header: title,
      message,
      animated: true,
      buttons: ['CERRAR']
    });
    await alert.present();
  }


    
  async showNewEventForm() {
    var title = "Añadir evento";
    var message = "<div id='new-event-form'>";
    
    message += "</div>";
    const alert = await this.atrCtrl.create({
      header: title,
      message,
      animated: true,
      cssClass:'customalert eventwithphoto',
      buttons: ['CERRAR']
    });
    await alert.present();
  }

  onTimeSelected(ev) {
    console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' + (ev.events !== undefined && ev.events.length !== 0) + ', disabled: ' + ev.disabled);
  }


  eventSelected(event){
    console.log(event);
    
  }
    
  onRangeChanged(ev) {

  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
    
  }

  changeMode(mode) {
      this.calendar.mode = mode;
  }

  onEventSelected(event) {
    console.log('Evento seleccionado:' + event.startTime + '-' + event.endTime + ',' + event.title+ ',' + event.event_id);
  }

  onCurrentDateChanged(event:Date) {
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      event.setHours(0, 0, 0, 0);
      this.isToday = today.getTime() === event.getTime();
  }


  markDisabled = (date:Date) => {
      var current = new Date();
      current.setHours(0, 0, 0);
      return date < current;
  };

}

