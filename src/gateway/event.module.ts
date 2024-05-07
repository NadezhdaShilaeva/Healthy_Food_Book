import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [EventGateway],
})
export class EventModule {}