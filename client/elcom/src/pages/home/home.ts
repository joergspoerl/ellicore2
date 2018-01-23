import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { single, multi} from './data'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  single: any[];
  multi: any[];

  view: any[] = [700, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  // line, area
  autoScale = true;

  constructor(public navCtrl: NavController) {
    Object.assign(this, {single, multi})   
  }

  onSelect(event) {
    console.log(event);
  }

}
