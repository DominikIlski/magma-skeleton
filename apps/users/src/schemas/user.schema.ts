import { AbstractDocument, validateEmail, validateName } from '@app/common';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';

@Schema({ versionKey: false })
export class User extends AbstractDocument {
  @Prop({ validate: validateName })
  name: string;

  @Prop({ unique: true, validate: validateEmail })
  email: string;

  @Prop()
  @Exclude()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
