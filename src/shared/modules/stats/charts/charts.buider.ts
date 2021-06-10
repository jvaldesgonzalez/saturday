import { PieBarChart } from './bar.chart';
import { LinearChart } from './linear.chart';
import { ListChart } from './list.chart';
import { PieChart } from './pie-bar.chart';

export class ChartsBuilder {
  public makePie(): PieChart {
    return new PieChart();
  }

  public makePieBar(): PieBarChart {
    return new PieBarChart();
  }

  public makeLinear(): LinearChart {
    return new LinearChart();
  }

  public makeList(): ListChart {
    return new ListChart();
  }
}
