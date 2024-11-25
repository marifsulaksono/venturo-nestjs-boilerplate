import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LogDocument = HydratedDocument<Log>;

@Schema({ timestamps: true }) // Tambahkan timestamp untuk createdAt & updatedAt
export class Log {
  @Prop()
  url: string;

  @Prop()
  method: string;

  @Prop()
  ip: string;

  @Prop({ type: Object })
  user: Record<string, any>;

  @Prop({ type: Object })
  body: Record<string, any>;

  @Prop()
  statusCode: number;

  @Prop({ type: Object })
  response: Record<string, any>;

  @Prop()
  responseTime: number;
}

export const LogSchema = SchemaFactory.createForClass(Log);
