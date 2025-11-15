import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private genAI: GoogleGenerativeAI;
  private model;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY no está configurada');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    this.logger.log('✅ Gemini AI inicializado correctamente');
  }

  /**
   * Genera una respuesta usando RAG (Retrieval-Augmented Generation)
   */
  async generateResponse(
    userQuery: string,
    retrievedArticles: { numero: string; titulo: string; contenido: string }[],
    conversationHistory?: { role: string; content: string }[],
  ): Promise<string> {
    try {
      // Construir el contexto con los artículos recuperados
      const context = retrievedArticles
        .map(
          (art) =>
            `${art.numero} - ${art.titulo}\n${art.contenido}\n---`,
        )
        .join('\n\n');

      // Construir el prompt con instrucciones claras
      const systemPrompt = `Eres un asistente legal experto en el Código Penal Colombiano (Ley 599 de 2000). Tu función es proporcionar explicaciones claras, precisas y accesibles sobre las leyes penales colombianas.

INSTRUCCIONES:
1. Responde ÚNICAMENTE basándote en los artículos del Código Penal proporcionados
2. Explica en lenguaje claro y sencillo, evitando tecnicismos innecesarios
3. Cita siempre los artículos específicos que fundamentan tu respuesta
4. Si la información no está en los artículos proporcionados, indica que no tienes esa información
5. Mantén un tono profesional pero accesible
6. Si preguntan sobre consecuencias legales, menciona las penas establecidas

CONTEXTO LEGAL RELEVANTE:
${context}

CONSULTA DEL USUARIO:
${userQuery}

RESPUESTA:`;

      // Generar respuesta
      const result = await this.model.generateContent(systemPrompt);
      const response = result.response.text();

      this.logger.log(`✅ Respuesta generada exitosamente`);
      return response;
    } catch (error) {
      this.logger.error('❌ Error al generar respuesta con Gemini:', error);
      throw new Error('Error al procesar la consulta con IA');
    }
  }

  /**
   * Genera embeddings para búsqueda vectorial (opcional)
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const embeddingModel = this.genAI.getGenerativeModel({
        model: 'text-embedding-004',
      });
      const result = await embeddingModel.embedContent(text);
      return result.embedding.values;
    } catch (error) {
      this.logger.error('❌ Error al generar embedding:', error);
      throw error;
    }
  }
}