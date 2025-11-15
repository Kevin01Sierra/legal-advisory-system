import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LegalChatService } from './legal-chat.service';
import { LegalChatController } from './legal-chat.controller';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { GeminiModule } from '../gemini/gemini.module';
import { VectorDbModule } from '../vector-db/vector-db.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, Message]),
    GeminiModule,
    VectorDbModule,
  ],
  controllers: [LegalChatController],
  providers: [LegalChatService],
})
export class LegalChatModule {}