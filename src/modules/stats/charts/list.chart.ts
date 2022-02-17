import { ApiResponseProperty } from '@nestjs/swagger';
import { ChartType } from './enum/chart-type.enum';

class ListChartEntries {
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty()
  value: number;
  @ApiResponseProperty()
  expectation: number;
}

export class ListChartJSON {
  @ApiResponseProperty()
  type: string;
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty({ type: [ListChartEntries] })
  values: ListChartEntries[];
}

export class ListChart {
  private brand = ChartType.List;
  private name: string;
  private entries: ListChartEntries[] = [];

  public withName(name: string): this {
    this.name = name;
    return this;
  }

  public addEntries(entries: ListChartEntries[]): this {
    this.entries.push(...entries);
    return this;
  }

  public build(): ListChartJSON {
    return {
      type: this.brand as string,
      name: this.name,
      values: this.entries,
    };
  }
}
