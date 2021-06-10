import { ApiResponseProperty } from '@nestjs/swagger';
import { ChartType } from './enums/charts.enum';

export class PieChartEntries {
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty()
  value: number;
}

export class PieChartJSON {
  @ApiResponseProperty()
  type: string;
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty({ type: [PieChartEntries] })
  values: PieChartEntries[];
}

export class PieChart {
  private brand = ChartType.Pie;
  private name: string;
  private values: PieChartEntries[] = [];

  public addEntries(entries: PieChartEntries[]): this {
    this.values.push(...entries);
    return this;
  }

  public withName(name: string): this {
    this.name = name;
    return this;
  }

  public build(): PieChartJSON {
    return {
      type: this.brand as string,
      name: this.name,
      values: this.values,
    };
  }
}
