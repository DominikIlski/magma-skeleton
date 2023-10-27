import { Logger, NotFoundException } from '@nestjs/common';
import { IRepository } from '../../interfaces';
import { Connection, FilterQuery, Model, SaveOptions, Types } from 'mongoose';
import { AbstractDocument } from './abstract.schema';

export abstract class AbstractMongoDbRepository<
  TDocument extends AbstractDocument,
> implements IRepository<TDocument>
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

  async create(
    document: Omit<TDocument, '_id'>,
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
    if (!document) {
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

  async update(id: string, entity: TDocument): Promise<TDocument> {
    const document = await this.model
      .findOneAndUpdate({ _id: id }, entity, { lean: true, new: true })
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
