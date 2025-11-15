export class ResponseDto {
  conversationId: string;
  messageId: string;
  response: string;
  articulosCitados: {
    numero: string;
    titulo: string;
    contenido: string;
  }[];
  metadata: {
    confidenceScore: number;
    processingTime: number;
    modelUsed: string;
  };
}