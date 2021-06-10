import { ApiResponseProperty } from '@nestjs/swagger';
import { ChartType } from './enums/charts.enum';

class LinearChartEntries {
  @ApiResponseProperty()
  datetime: Date;
  @ApiResponseProperty()
  value: number;
}

export class LinearChartJSON {
  @ApiResponseProperty()
  type: string;
  @ApiResponseProperty()
  tableName: string;
  @ApiResponseProperty()
  percent: number;
  @ApiResponseProperty()
  isIncreasing: boolean;
  @ApiResponseProperty()
  totalValue: number;
  @ApiResponseProperty({ type: [LinearChartEntries] })
  values: LinearChartEntries[];
}

export class LinearChart {
  private brand = ChartType.Linear;
  private name: string;
  private percent: number;
  private total: number;
  private entries: LinearChartEntries[] = [];

  public withName(name: string): this {
    this.name = name;
    return this;
  }

  public withPercent(percent: number): this {
    this.percent = percent;
    return this;
  }

  public withTotal(total: number): this {
    this.total = total;
    return this;
  }

  public addEntries(entries: LinearChartEntries[]): this {
    this.entries.push(...entries);
    return this;
  }

  public build(): LinearChartJSON {
    return {
      type: this.brand as string,
      tableName: this.name,
      percent: Math.abs(this.percent),
      isIncreasing: this.percent > 0,
      totalValue: this.total,
      values: this.entries,
    };
  }
}
