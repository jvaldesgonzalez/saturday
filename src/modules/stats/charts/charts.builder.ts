import { PieBarChart } from 'src/shared/modules/stats/charts/bar.chart';

export class ChartsBuilder {
  public makePieBar(): PieBarChart {
    return new PieBarChart();
  }
}
