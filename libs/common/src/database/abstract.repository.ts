import { Logger, NotFoundException } from '@nestjs/common';
import { AbstractDocument } from './abstract.schema';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  create = async (document: Omit<TDocument, '_id'>): Promise<TDocument> => {
    const createDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createDocument.save()).toJSON() as unknown as TDocument;
  };

  findOne = async (filterQuery: FilterQuery<TDocument>): Promise<TDocument> => {
    const document = await this.model
      .findOne(filterQuery)
      .lean<TDocument>(true);

    if (!document) {
      this.logger.warn(
        `Document was not found with filterQuery ${filterQuery}`,
      );
      throw new NotFoundException('Document was not found');
    }

    return document;
  };

  findOneAndUpdate = async (
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> => {
    const document = await this.model
      .findOneAndUpdate(filterQuery, update, {
        new: true,
      })
      .lean<TDocument>(true);

    if (!document) {
      this.logger.warn(
        `Document was not found with filterQuery ${filterQuery}`,
      );
      throw new NotFoundException('Document was not found');
    }

    return document;
  };

  find = async (filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> => {
    return await this.model.find(filterQuery).lean<TDocument[]>(true);
  };

  findOneAndDelete = async (
    filterQuery: FilterQuery<TDocument>,
  ): Promise<TDocument> => {
    return await this.model.findOneAndDelete(filterQuery).lean<TDocument>(true);
  };
}
