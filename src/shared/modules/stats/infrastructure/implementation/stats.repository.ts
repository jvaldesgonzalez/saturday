import { IStatsRepository } from '../interfaces/stats.repository.interface';
import * as faker from 'faker';
import { ChartsBuilder } from '../../charts/charts.buider';
import { GetHostStatsResponse } from '../../types/responses/get-host-stats.response';
import { GetEventStatsResponse } from '../../types/responses/get-event-stats.response';
import { GetResumeByHostResponse } from '../../types/responses/get-host-stats-resume';

export class StatsRepository implements IStatsRepository {
  async getHostStats(_hostId: string): Promise<GetHostStatsResponse> {
    return {
      events: [
        new ChartsBuilder()
          .makeList()
          .withName('Bla Bla')
          .addEntries([
            {
              name: 'La avioneta de mi amigoa',
              value: 289,
              expectation: 895,
            },
            {
              name: 'EFE Full night',
              expectation: 1089,
              value: 898,
            },
            {
              name: 'Viernes de cangrejo',
              value: 235,
              expectation: 1089,
            },
            {
              name: 'LALALAND',
              value: 465,
              expectation: 2685,
            },
          ])
          .build(),
      ],
      audience: [
        new ChartsBuilder()
          .makePieBar()
          .withName('Sexo y edad')
          .withCategories(['Mujeres', 'Hombres', 'Non-Binary'])
          .addEntries([
            {
              range: [18, 20],
              values: [10, 50, 30],
            },
            {
              range: [20, 25],
              values: [200, 400, 36],
            },
            {
              range: [25, 30],
              values: [150, 160, 200],
            },
            {
              range: [30, 40],
              values: [300, 160, 3.0],
            },
            {
              range: [40, 60],
              values: [40, 20, 0],
            },
          ])
          .build(),
      ],
      sells: [
        new ChartsBuilder()
          .makeLinear()
          .withName('Seguidores')
          .withPercent(34)
          .withTotal(885)
          .addEntries([
            {
              datetime: new Date('2021-02-01T09:00:29.344Z'),
              value: 56.0,
            },
            {
              datetime: new Date('2021-02-02T09:00:29.344Z'),
              value: 14.0,
            },
            {
              datetime: new Date('2021-02-03T09:00:29.344Z'),
              value: 32.0,
            },
            {
              datetime: new Date('2021-02-04T09:00:29.344Z'),
              value: 100.0,
            },
            {
              datetime: new Date('2021-02-05T09:00:29.344Z'),
              value: 75.0,
            },
            {
              datetime: new Date('2021-02-06T09:00:29.344Z'),
              value: 34.0,
            },
            {
              datetime: new Date('2021-02-07T09:00:29.344Z'),
              value: 56.0,
            },
            {
              datetime: new Date('2021-02-08T09:00:29.344Z'),
              value: 14.0,
            },
            {
              datetime: new Date('2021-02-09T09:00:29.344Z'),
              value: 32.0,
            },
            {
              datetime: new Date('2021-02-10T09:00:29.344Z'),
              value: 100.0,
            },
            {
              datetime: new Date('2021-02-11T09:00:29.344Z'),
              value: 75.0,
            },
            {
              datetime: new Date('2021-02-12T09:00:29.344Z'),
              value: 34.0,
            },
            {
              datetime: new Date('2021-02-13T09:00:29.344Z'),
              value: 56.0,
            },
            {
              datetime: new Date('2021-02-14T09:00:29.344Z'),
              value: 14.0,
            },
            {
              datetime: new Date('2021-02-15T09:00:29.344Z'),
              value: 32.0,
            },
            {
              datetime: new Date('2021-02-16T09:00:29.344Z'),
              value: 100.0,
            },
            {
              datetime: new Date('2021-02-17T09:00:29.344Z'),
              value: 75.0,
            },
            {
              datetime: new Date('2021-02-18T09:00:29.344Z'),
              value: 34.0,
            },
            {
              datetime: new Date('2021-02-19T09:00:29.344Z'),
              value: 56.0,
            },
            {
              datetime: new Date('2021-02-20T09:00:29.344Z'),
              value: 14.0,
            },
            {
              datetime: new Date('2021-02-21T09:00:29.344Z'),
              value: 32.0,
            },
            {
              datetime: new Date('2021-02-22T09:00:29.344Z'),
              value: 100.0,
            },
            {
              datetime: new Date('2021-02-23T09:00:29.344Z'),
              value: 75.0,
            },
            {
              datetime: new Date('2021-02-24T09:00:29.344Z'),
              value: 34.0,
            },
          ])
          .build(),
      ],
    };
  }

  async getEventStats(_eventId: string): Promise<GetEventStatsResponse> {
    const chart = new ChartsBuilder()
      .makePieBar()
      .withName('Sexo y edad')
      .withCategories(['Mujeres', 'Hombres', 'Non-Binary'])
      .addEntries([
        {
          range: [18, 20],
          values: [10, 50, 30],
        },
        {
          range: [20, 25],
          values: [200, 400, 36],
        },
        {
          range: [25, 30],
          values: [150, 160, 200],
        },
        {
          range: [30, 40],
          values: [300, 160, 3.0],
        },
        {
          range: [40, 60],
          values: [40, 20, 0],
        },
      ])
      .build();
    return {
      tickets: {
        price: '160 CUC',
        total: 300,
        sold: 150,
      },
      reachability: chart,
      usersInterested: chart,
      timesShared: chart,
      event: {
        category: faker.name.jobArea(),
        name: faker.name.title(),
        multimedia: [{ type: 'image', url: faker.image.nightlife() }],
        id: faker.datatype.uuid(),
        occurrencesDate: [faker.date.future(0)],
        collaborators: [],
        place: {
          name: faker.address.streetName(),
          address: faker.address.streetAddress(),
          latitude: faker.address.latitude(),
          longitude: faker.address.longitude(),
        },
        description: [
          {
            header: 'Descripcion',
            body: faker.lorem.paragraphs(2),
            inline: false,
          },
        ],
      },
    };
  }

  async getResumeByHost(_hostId: string): Promise<GetResumeByHostResponse> {
    return {
      followers: {
        since: faker.date.recent(10),
        data: `${faker.datatype.number()}`,
        variation: faker.datatype.number({ min: -100, max: 100 }),
      },
      incomingMoney: {
        since: faker.date.recent(15),
        data: `${faker.datatype.number()}`,
        variation: faker.datatype.number({ min: -100, max: 100 }),
      },
    };
  }
}
