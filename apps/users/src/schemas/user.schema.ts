import { AbstractDocument, validateEmail, validateName } from '@app/common';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class User extends AbstractDocument {
  @Prop({ validate: validateName })
  name: string;

  @Prop({ unique: true, validate: validateEmail })
  email: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
