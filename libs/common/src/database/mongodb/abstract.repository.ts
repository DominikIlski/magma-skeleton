import { Logger, NotFoundException } from '@nestjs/common';
import { IBaseRepository } from '../../interfaces';
import {
  ClientSession,
  Connection,
  FilterQuery,
  Model,
  SaveOptions,
  Types,
} from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import { ExcludePropsByClass } from '@app/common';

export abstract class AbstractMongoDbRepository<
  TDocument extends AbstractDocument,
> implements IBaseRepository<TDocument>
{
  protected abstract readonly logger: Logger;

  constructor(
    protected readonly model: Model<TDocument>,
    private readonly connection: Connection,
  ) {}

  async startTransaction() {
    const session = await this.connection.startSession();
    session.startTransaction();
    return session;
  }

  private async commitTransaction(session: ClientSession) {
    await session.commitTransaction();
    session.endSession();
  }

  async create(
    document: ExcludePropsByClass<TDocument, AbstractDocument>,
    options?: SaveOptions,
  ): Promise<TDocument> {
    const newId = new Types.ObjectId();
    const createdDocument = new this.model({
      ...document,
      _id: newId,
    });
    const newDocument = await createdDocument.save(options);
    return newDocument.toJSON() as TDocument;
  }

  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const result = await this.model
      .findOne(filterQuery, {}, { lean: true })
      .exec();
    if (!result) {
      this.logger.warn('Document not found with querry', filterQuery);
      throw new NotFoundException('Document not found');
    }
    return result as TDocument;
  }
  async findAll(): Promise<TDocument[]>;
  async findAll(params: FilterQuery<TDocument>): Promise<TDocument[]>;
  async findAll(params?: FilterQuery<TDocument>): Promise<TDocument[]> {
    let results;
    if (params) {
      results = await this.model.find(params, {}, { lean: true }).exec();
    }

    results = await this.model.find({}, {}, { lean: true }).exec();
    return results as unknown as TDocument[];
  }

  findById(id: string): Promise<TDocument> {
    return this.findOne({ _id: id });
  }

  async update(
    id: string,
    newDocument: ExcludePropsByClass<Partial<TDocument>, AbstractDocument>,
  ): Promise<TDocument> {
    const document = await this.model
      .findOneAndUpdate({ _id: id }, newDocument, {
        lean: true,
        new: true,
      })
      .exec();
    if (!document) {
      this.logger.warn('Document not found with querry', id);
      throw new NotFoundException('Document not found');
    }
    return document as unknown as TDocument;
  }

  async delete(id: string, session?: ClientSession): Promise<boolean> {
    const result = await this.model
      .deleteOne({ _id: id })
      .session(session || null)
      .exec();
    if (!result.deletedCount) {
      this.logger.warn('Document not found with querry', id);
      throw new NotFoundException('Document not found');
    }
    return true;
  }
}
