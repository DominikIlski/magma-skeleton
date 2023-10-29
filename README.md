<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).



# IMPORTANT NOTES
`openssl rand -base64 756 > ./data/replica.key`

`import 'source-map-support/register';`

```
var admin = db.getSiblingDB('admin');
admin.auth('root', 'root');
```

```
db.users.findOne()
```



```


interface ISortOption<TDocument extends AbstractDocument> {
  field: keyof TDocument;
  order: SortOrder;
}

interface ILastDocOnThePage<TDocument extends AbstractDocument> {
  _id: Types.ObjectId;
  sortFieldValue?: TDocument[keyof TDocument];
}

interface IPaginationResult<TDocument extends AbstractDocument> {
  paginatedQuery: FilterQuery<TDocument>;
  findLastDoc: (items: TDocument[]) => ILastDocOnThePage<TDocument> | null;
}


private generatePaginationQuery(
    query: FilterQuery<TDocument>,
    sortOptions?: ISortOption<TDocument>,
    lastDocOnPrevPage?: ILastDocOnThePage<TDocument>,
  ): IPaginationResult<TDocument> {
    const sortField = sortOptions?.field ?? null;

    const findLastDoc = (
      items: TDocument[],
    ): ILastDocOnThePage<TDocument> | null => {
      if (items.length === 0) {
        return null;
      }
      const lastItem = items[items.length - 1];
      if (sortField == null) {
        return { _id: lastItem._id };
      }
      const lastSortFiledValue = lastItem[sortField];
      return { _id: lastItem._id, [sortField]: lastSortFiledValue };
    };



    if (!lastDocOnPrevPage) {
      return { paginatedQuery: query, findLastDoc: findLastDoc };
    }

    let paginatedQuery: FilterQuery<TDocument> = { ...query };

    if (sortOptions == null || !sortField) {
      const querySelector: QuerySelector<Types.ObjectId> = {
        $gt: lastDocOnPrevPage._id,
      };
      paginatedQuery._id = querySelector;
      return { paginatedQuery, findLastDoc: findLastDoc };
    }

    const sortOrderOperator: keyof QuerySelector<TDocument> =
      sortOptions.order === SortOrder.ASC ? '$gt' : '$lt';


    const sortingFilterOrder: QuerySelector<TDocument[keyof TDocument]> = {
      [sortOrderOperator]: lastDocOnPrevPage.sortFieldValue,
    };

    const sortingFilter: FilterQuery<TDocument> = {};
    sortingFilter[sortField] = sortingFilterOrder;

    const paginationHelper: FilterQuery<TDocument> = {
      $and: [
        {
          [sortField as keyof TDocument]:
            lastDocOnPrevPage[sortField as keyof typeof lastDocOnPrevPage],
        },
        { _id: { [sortOrderOperator]: lastDocOnPrevPage._id } },
      ],
    } as FilterQuery<TDocument>;

    const paginationQuery: FilterQuery<TDocument>[] = [
      sortingFilter,
      paginationHelper,
    ];

    if (paginatedQuery.$or == null) {
      paginatedQuery.$or = paginationQuery;
    } else {
      paginatedQuery = { $and: [query, { $or: paginationQuery }] };
    }
    return { paginatedQuery, findLastDoc: findLastDoc };
  }
```