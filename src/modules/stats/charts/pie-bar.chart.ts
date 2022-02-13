import { ApiResponseProperty } from '@nestjs/swagger';
import { ChartType } from 'src/shared/modules/stats/charts/enums/charts.enum';

export class PieBarChartEntries {
  range: [number, number];
  values: number[];
}

class InnerValue {
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty()
  value: number;
}

class Value {
  @ApiResponseProperty()
  range: string;
  @ApiResponseProperty({ type: [InnerValue] })
  values: InnerValue[];
}

export class PieBarChartJSON {
  @ApiResponseProperty()
  type: string;
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty({ type: [Value] })
  values: Value[];
}

export class PieBarChart {
  private brand = ChartType.PieBar;
  private name: string;
  private values: PieBarChartEntries[] = [];
  private categories: string[];

  public withName(name: string): this {
    this.name = name;
    return this;
  }

  public withCategories(categories: string[]): this {
    this.categories = categories;
    return this;
  }

  public addEntries(entries: PieBarChartEntries[]): this {
    if (!this.categories) throw new Error('Categories must be setted first');
    this.values.push(...entries);
    return this;
  }

  public build(): PieBarChartJSON {
    return {
      name: this.name,
      type: this.brand as string,
      values: this.values.map((val) => {
        return {
          range: `${val.range[0]}-${val.range[1]}`,
          values: val.values.map((num, i) => {
            return {
              name: this.categories[i],
              value: num,
            };
          }),
        };
      }),
    };
  }
}
