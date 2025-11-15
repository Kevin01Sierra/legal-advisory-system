import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message, MessageRole } from './entities/message.entity';
import { GeminiService } from '../gemini/gemini.service';
import { VectorDbService } from '../vector-db/vector-db.service';
import { ResponseDto } from './dto/response.dto';
import { QueryDto } from './dto/query.dto';

@Injectable()
export class LegalChatService {
  private readonly logger = new Logger(LegalChatService.name);

  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private geminiService: GeminiService,
    private vectorDbService: VectorDbService,
  ) {}

  /**
   * Procesa una consulta legal usando RAG
   */
  async processQuery(
    userId: string,
    queryDto: QueryDto,
  ): Promise<ResponseDto> {
    const startTime = Date.now();

    try {
      // 1. Obtener o crear conversación
      let conversation: Conversation | null = null;
      if (queryDto.conversationId) {
        conversation = await this.conversationRepository.findOne({
          where: { id: queryDto.conversationId, userId },
          relations: ['messages'],
        });

        if (!conversation) {
          throw new NotFoundException('Conversación no encontrada');
        }
      } else {
        // Crear nueva conversación
        conversation = this.conversationRepository.create({
          userId,
          titulo: queryDto.query.substring(0, 100),
        });
        await this.conversationRepository.save(conversation);
      }

      // 2. Guardar mensaje del usuario
      const userMessage = this.messageRepository.create({
        conversationId: conversation.id,
        role: MessageRole.USER,
        content: queryDto.query,
      });
      await this.messageRepository.save(userMessage);

      // 3. Búsqueda RAG - Recuperar artículos relevantes
      const relevantArticles = await this.vectorDbService.buscarArticulosRelevantes(
        queryDto.query,
        5,
      );

      this.logger.log(
        `📚 Recuperados ${relevantArticles.length} artículos relevantes`,
      );

      // 4. Generar respuesta con Gemini usando contexto
      const response = await this.geminiService.generateResponse(
        queryDto.query,
        relevantArticles.map((art) => ({
          numero: art.numero,
          titulo: art.titulo,
          contenido: art.contenido,
        })),
      );

      // 5. Guardar respuesta del asistente
      const processingTime = Date.now() - startTime;
      const assistantMessage = this.messageRepository.create({
        conversationId: conversation.id,
        role: MessageRole.ASSISTANT,
        content: response,
        metadata: {
          articulosCitados: relevantArticles.map((art) => art.numero),
          confidenceScore: relevantArticles.length > 0 ? 0.85 : 0.5,
          processingTime,
        },
      });
      await this.messageRepository.save(assistantMessage);

      // 6. Construir respuesta
      const responseDto: ResponseDto = {
        conversationId: conversation.id,
        messageId: assistantMessage.id,
        response,
        articulosCitados: relevantArticles.map((art) => ({
          numero: art.numero,
          titulo: art.titulo,
          contenido: art.contenido,
        })),
        metadata: {
          confidenceScore: relevantArticles.length > 0 ? 0.85 : 0.5,
          processingTime,
          modelUsed: 'gemini-2.5-flash',
        },
      };

      this.logger.log(
        `✅ Consulta procesada en ${processingTime}ms para conversación ${conversation.id}`,
      );

      return responseDto;
    } catch (error) {
      this.logger.error('❌ Error al procesar consulta:', error);
      throw error;
    }
  }

  /**
   * Obtener historial de una conversación
   */
  async getConversationHistory(userId: string, conversationId: string) {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId, userId },
      relations: ['messages'],
      order: { messages: { createdAt: 'ASC' } },
    });

    if (!conversation) {
      throw new NotFoundException('Conversación no encontrada');
    }

    return conversation;
  }

  /**
   * Listar todas las conversaciones de un usuario
   */
  async getUserConversations(userId: string) {
    return this.conversationRepository.find({
      where: { userId, isActive: true },
      order: { updatedAt: 'DESC' },
    });
  }

  /**
   * Eliminar una conversación
   */
  async deleteConversation(userId: string, conversationId: string) {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId, userId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversación no encontrada');
    }

    conversation.isActive = false;
    await this.conversationRepository.save(conversation);

    return { message: 'Conversación eliminada exitosamente' };
  }
}