import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { single, multi} from './data'
import { WapiProvider } from '../../providers/wapi/wapi'
import { clearInterval, clearTimeout } from 'timers';
import { NgProgress } from 'ngx-progressbar';

import "rxjs/add/operator/timeout";
import "rxjs/add/operator/catch";
import { HttpResponse } from '@angular/common/http/src/response';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  single: any[];
  multi: any[];

  view: any[] = [700, 400];

  theme = "dark"
  // options
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = false;
  showXAxisLabel = false;
  xAxisLabel = 'Time';
  showYAxisLabel = false;
  yAxisLabel = 'Value';
  animations = false;
  timeline = true;

  colorScheme = {
    domain: ['#0AA454', '#010A28', '#C7B42C', '#000000']
  };

  // line, area
  autoScale = true;

  level = 0;
  level_list = [{id: 0, name: "seconds"}, {id: 1, name: "minutes"}, {id: 2, name: "hours"}]
  source_id = 1;
  limit = 120;
  limit_list = [60, 120, 360, 1200, 3600]

  timer = null
  source = [];
  httpRequestTime = 0;
  httpRequestSize = 0;

  segment = 'source'

  constructor(
    public navCtrl: NavController,
    public wapi: WapiProvider,
    public ngProgress: NgProgress,
  ) {
    //Object.assign(this, {single, multi})   
    this.multi = [
      { 
        name: "MeinTest",
        series: [ {
          name: "1", value: 1
        }]
      }
    ]
  }

  segmentChanged(event) {

  }

  loadChart() {
    this.ngProgress.start();
    let start = Date.now()
    this.wapi.getData(this.level,this.source_id,this.limit)
    .timeout(50000)
    .catch(
      (error, source) => { throw ("MyTimeout")}
    )  
    .subscribe(
      (resp:HttpResponse<Object>) => {
        this.httpRequestTime = Date.now() - start;
        this.httpRequestSize = resp.body.toString().length

        console.log("getData:", resp.body);

        let dataArray = resp.body as Array<Array<string>>;

        let da = dataArray.map((v, i) => {
          return {
            name: new Date(v[0]),// i.toString(),//v[0], 
            time: v[0], // for internal use 
            value: parseFloat(v[1])
          }
        });

        console.log("da", da)

        this.multi[0].series = da
        this.multi = [...this.multi];  // copy array

        console.log("multi", this.multi)

        this.ngProgress.done();
        this.startTimer();
      },

      error => {
        this.httpRequestTime = Date.now() - start;
        this.ngProgress.done(); 
        this.startTimer();
      })
    
  }

  loadChartDelta() {
    this.ngProgress.start();
    let start = Date.now()
    let time_from = this.multi[0].series[0].time;
    console.log(" this.multi[0].series[this.multi[0].series.length - 1]",  this.multi[0].series[this.multi[0].series.length - 1])
    console.log("time_from: ", time_from)
    this.wapi.getDelta(this.level,this.source_id,time_from,this.limit)
    .timeout(50000)
    .catch(
      (error, source) => { throw ("MyTimeout")}
    )  
    .subscribe(
      (resp:HttpResponse<Object>) => {
        this.httpRequestTime = Date.now() - start;
        this.httpRequestSize = resp.body.toString().length

        console.log("getData:", resp.body);

        let dataArray = resp.body as Array<Array<string>>;

        let da = dataArray.map((v, i) => {
          return {
            name: new Date(v[0]),// i.toString(),//v[0],
            time: v[0], // for internal use 
            value: parseFloat(v[1])
          }
        });

        console.log("da", da)

        let l = da.length
        //this.multi[0].series.unshift(da)
        //this.multi[0].series = this.multi[0].series.splice(0,l)
        this.multi = [...this.multi];  // copy array

        console.log("multi", this.multi)

        this.ngProgress.done();
        this.startTimer();
      },

      error => {
        this.httpRequestTime = Date.now() - start;
        this.ngProgress.done(); 
        this.startTimer();
      })
    
  }

  startTimer() {
    var wait;
    if (this.level == 0) wait = 5
    if (this.level == 1) wait = 10
    if (this.level == 2) wait = 60 * 60
    
    if (this.timer == null) {
      this.timer = setTimeout(() => {
        this.timer = null
        this.loadChart();
      }, wait * 1000 );
    }
  }

  loadSource() {
    this.wapi.getSource().subscribe(data => {
      console.log("getSource:", data);
      this.source = data as Array<Array<string>>;
    })
  }

  ionViewDidEnter() {
    console.log("ionViewDidEnter()")
    this.loadSource();
    this.loadChart();
    //this.startTimer();
  }

  ionViewDidLeave() {
    console.log("ionViewDidLeave()")
    clearTimeout(this.timer)
    this.timer = null;
  }


  onSelect(event) {
    console.log(event);
  }

}
