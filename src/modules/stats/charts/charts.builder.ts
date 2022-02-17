import { ListChart } from './list.chart';
import { PieBarChart } from './pie-bar.chart';

export class ChartsBuilder {
  public makePieBar(): PieBarChart {
    return new PieBarChart();
  }

  public makeList(): ListChart {
    return new ListChart();
  }
}
