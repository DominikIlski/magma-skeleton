import { Logger, NotFoundException } from '@nestjs/common';
import { IRepository } from '../../interfaces';
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
import { NoResultError } from '@app/common/custom_errors';

export abstract class AbstractMongoDbRepository<
  TDocument extends AbstractDocument,
> implements IRepository<TDocument>
{
  protected abstract readonly logger: Logger;

  constructor(
    protected readonly model: Model<TDocument>,
    private readonly connection: Connection,
  ) {}

  private async startTransaction() {
    const session = await this.connection.startSession();
    session.startTransaction();
    return session;
  }

  private async commitTransaction(session: ClientSession) {
    await session.commitTransaction();
    session.endSession();
  }

  async runWithTransaction(
    run: () => Promise<TDocument | TDocument[]>,
    onError?: (error: Error) => void,
  ): Promise<TDocument | TDocument[]> {
    const session = await this.startTransaction();
    try {
      const result = await run();
      await this.commitTransaction(session);
      if (result) {
        return result;
      }
      throw new NoResultError();
    } catch (error) {
      await session.abortTransaction();
      if (onError) {
        onError(error);
      }
      throw error;
    }
  }

  async create(
    document: ExcludePropsByClass<TDocument, AbstractDocument>,
    options?: SaveOptions,
  ): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (
      await createdDocument.save(options)
    ).toJSON() as unknown as TDocument;
  }

  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const result = await this.model
      .findOne(filterQuery, {}, { lean: true })
      .exec();
    if (!result) {
      this.logger.warn('Document not found with querry', filterQuery);
      throw new NotFoundException('Document not found');
    }
    return result as unknown as TDocument;
  }

  async findAll(): Promise<TDocument[]> {
    const results = await this.model.find({}, {}, { lean: true }).exec();
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
        fields: Object.keys(newDocument),
      })
      .exec();
    if (!document) {
      this.logger.warn('Document not found with querry', id);
      throw new NotFoundException('Document not found');
    }
    return document as unknown as TDocument;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.deleteOne({ _id: id }).exec();
    if (!result.deletedCount) {
      this.logger.warn('Document not found with querry', id);
      throw new NotFoundException('Document not found');
    }
    return true;
  }
}
