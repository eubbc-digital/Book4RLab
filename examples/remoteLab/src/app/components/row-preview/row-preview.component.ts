import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import config from '../../../config.json';
import * as moment from 'moment';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexAnnotations,
  ApexMarkers,
  ApexFill,
  ApexYAxis,
  ApexTooltip,
} from 'ng-apexcharts';

@Component({
  selector: 'app-row-preview',
  templateUrl: './row-preview.component.html',
  styleUrls: ['./row-preview.component.css'],
})
export class RowPreviewComponent implements OnInit {
  @ViewChild('calibrated-chart') calibratedChart!: ChartComponent;

  public series: ApexAxisChartSeries = [];
  public chart!: ApexChart;
  public dataLabels!: ApexDataLabels;
  public markers!: ApexMarkers;
  public fill!: ApexFill;
  public yaxis!: ApexYAxis;
  public xaxis!: ApexXAxis;
  public annotations!: ApexAnnotations;
  public tooltip!: ApexTooltip;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dialogRef: MatDialogRef<RowPreviewComponent>
  ) {}

  dateFormat: string = 'MMMM Do YYYY, h:mm:ss a';
  yellowLine: number = 0;
  redLine: number = 0;

  ngOnInit(): void {
    this.initializeCalibratedChart();
  }

  initializeCalibratedChart(): void {
    this.series = [
      {
        name: 'Calibrated chart',
        data: [],
      },
    ];
    this.chart = {
      type: 'area',
      animations: {
        enabled: false,
      },
      stacked: false,
      height: 180,
      zoom: {
        enabled: false,
        autoScaleYaxis: false,
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
          fontSize: '12px',
        },
      },
      title: {
        text: 'Intensity [a. u.]',
        style: {
          fontSize: '12px',
        },
      },
    };
    this.xaxis = {
      type: 'numeric',
      title: {
        text: 'Wavelength [nm]',
        style: {
          fontSize: '12px',
        },
      },
      labels: {
        formatter: function (val) {
          return parseFloat(val).toFixed(2);
        },
        style: {
          fontSize: '12px',
        },
      },
    };
    this.annotations = {
      xaxis: [
      ],
      points: [
      ],
    };
  }

  close(): void {
    this.dialogRef.close();
  }

  getImageSrc(image: number[] | undefined): string {
    return image
      ? 'data:image/png;base64,' + btoa(String.fromCharCode.apply(null, image))
      : '';
  }

  getFormattedDate(date: any): string {
    return moment(date).format(this.dateFormat);
  }
}
