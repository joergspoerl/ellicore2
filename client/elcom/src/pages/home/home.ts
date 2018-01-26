import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { single, multi} from './data'
import { WapiProvider } from '../../providers/wapi/wapi'
import { clearInterval } from 'timers';

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
  source_id = 1;
  limit = 120;
  limit_list = [60, 120, 360, 1200, 3600]

  interval = null
  source = [];

  constructor(
    public navCtrl: NavController,
    public wapi: WapiProvider,
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

  loadChart() {
    this.wapi.getData(this.level,this.source_id,this.limit).subscribe(data => {
      console.log("getData:", data);

      let dataArray = data as Array<Array<string>>;

      let da = dataArray.map((v,i) => {
        return { 
          name: new Date(v[0]),// i.toString(),//v[0], 
          value: parseFloat(v[1]) }
        });

      console.log("da", da)

      this.multi[0].series = da
      this.multi = [...this.multi];  // copy array

      console.log("multi", this.multi)

      this.startTimer();
    });
  
  }

  startTimer() {
    var wait;
    if (this.level == 0) wait = 1
    if (this.level == 1) wait = 10
    if (this.level == 2) wait = 60 * 60
    
    setTimeout(() => {
      this.loadChart();
    }, wait * 1000 );
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
    this.startTimer();
  }

  ionViewDidLeave() {
    console.log("ionViewDidLeave()")
    clearInterval(this.interval)
  }


  onSelect(event) {
    console.log(event);
  }

}
