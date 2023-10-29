import { Prop, Schema } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import { SchemaTypes, Types, now } from 'mongoose';

@Schema()
export abstract class AbstractDocument {
  @Prop({
    type: SchemaTypes.ObjectId,
  })
  @Type(() => String)
  @Transform((params) => params.obj._id)
  _id: Types.ObjectId;

  @Prop({ default: now() })
  createdAt: Date;
}
