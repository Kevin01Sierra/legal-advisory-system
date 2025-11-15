import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LegalChatService } from './legal-chat.service';
import { QueryDto } from './dto/query.dto';

@Controller('legal-chat')
@UseGuards(JwtAuthGuard)
export class LegalChatController {
  constructor(private readonly legalChatService: LegalChatService) {}

  @Post('query')
  async processQuery(@Request() req, @Body() queryDto: QueryDto) {
    return this.legalChatService.processQuery(req.user.id, queryDto);
  }

  @Get('conversations')
  async getConversations(@Request() req) {
    return this.legalChatService.getUserConversations(req.user.id);
  }

  @Get('conversations/:id')
  async getConversationHistory(@Request() req, @Param('id') id: string) {
    return this.legalChatService.getConversationHistory(req.user.id, id);
  }

  @Delete('conversations/:id')
  async deleteConversation(@Request() req, @Param('id') id: string) {
    return this.legalChatService.deleteConversation(req.user.id, id);
  }
}