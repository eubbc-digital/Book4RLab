import {
  Component,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexMarkers,
  ApexYAxis,
  ApexXAxis,
  ApexTooltip,
} from 'ng-apexcharts';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-chart',
  templateUrl: './spectral-chart.component.html',
  styleUrls: ['./spectral-chart.component.css'],
})
export class SpectralChartComponent implements OnInit {
  public series: ApexAxisChartSeries = [];
  public chart!: ApexChart;
  public dataLabels!: ApexDataLabels;
  public markers!: ApexMarkers;
  public fill!: ApexFill;
  public yaxis!: ApexYAxis;
  public xaxis!: ApexXAxis;
  public tooltip!: ApexTooltip;

  updateStreaming: boolean = true;
  calibratedChart: boolean = false;
  tooltipEnabled: boolean = true;

  noteName: string = '';
  description: string = '';

  private receivedData = {
    message: {
      image: [],
      chart: [],
      peaks: [],
    },
  };

  constructor(
    private toast: ToastrService
  ) {
    this.initChartData();
  }

  ngOnInit(): void {
  }

  initChartData(): void {
    this.series = [
      {
        name: 'Data1',
        data: [1,3,5,2,2]
      },
    ];
    this.chart = {
      type: 'area',
      animations: {
        enabled: false,
      },
      stacked: false,
      height: 350,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true,
      },
      toolbar: {
        autoSelected: 'zoom',
      },
      events: {
      },
    };
    this.dataLabels = {
      enabled: false,
    };
    this.markers = {
      size: 0,
    };
    this.fill = {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    };
    this.yaxis = {
      labels: {
        formatter: function (val) {
          return val.toFixed(0);
        },
        style: {
          fontSize: '14px',
          fontFamily: 'Roboto, Helvetica Neue, sans-serif'
        },
      },
      title: {
        text: 'Y axis [a. u.]',
        style: {
          fontSize: '14px',
          fontFamily: 'Roboto, Helvetica Neue, sans-serif'
        },
      },
    };
    this.xaxis = {
      type: 'numeric',
      position: 'bottom',
      title: {
        text: 'X axis [a. u.]',
        offsetY: 90,
        style: {
          fontSize: '14px',
          fontFamily: 'Roboto, Helvetica Neue, sans-serif'
        },
      },
      labels: {
        formatter: function (val) {
          return parseFloat(val).toFixed(2);
        },
        style: {
          fontSize: '14px',
          fontFamily: 'Roboto, Helvetica Neue, sans-serif'
        },
      },
    };
    this.tooltip = {
      enabled: this.tooltipEnabled,
      followCursor: false,
      theme: 'dark',
      x: {
        show: false,
      },
      marker: {
        show: false,
      },
      y: {
        formatter: function (val) {
          return val.toFixed(2);
        },
      },
      style: {
        fontSize: '14px',
        fontFamily: 'Roboto, Helvetica Neue, sans-serif'
      },
    };
  }

}
