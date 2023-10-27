import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaTypes, Types, now } from 'mongoose';

@Schema()
export class AbstractDocument {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

  @Prop({ default: now() })
  createdAt: Date;
}
