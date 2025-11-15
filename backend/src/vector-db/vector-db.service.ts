import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Articulo } from '../codigo-penal/entities/articulo.entity';

/**
 * Servicio de Base de Datos Vectorial
 * Implementación simplificada usando búsqueda por similitud de texto
 * Para producción, se recomienda usar FAISS, Chroma o pgvector
 */
@Injectable()
export class VectorDbService implements OnModuleInit {
  private readonly logger = new Logger(VectorDbService.name);
  private articulosIndexados: Articulo[] = [];

  constructor(
    @InjectRepository(Articulo)
    private articuloRepository: Repository<Articulo>,
  ) {}

  async onModuleInit() {
    await this.indexarArticulos();
  }

  /**
   * Indexa todos los artículos en memoria para búsqueda rápida
   */
  private async indexarArticulos() {
    try {
      this.articulosIndexados = await this.articuloRepository.find();
      this.logger.log(
        `✅ ${this.articulosIndexados.length} artículos indexados`,
      );
    } catch (error) {
      this.logger.error('❌ Error al indexar artículos:', error);
    }
  }

  /**
   * Busca artículos relevantes usando similitud de texto
   * Implementación básica - en producción usar embeddings y FAISS
   */
  async buscarArticulosRelevantes(
    query: string,
    topK: number = 5,
  ): Promise<Articulo[]> {
    const queryLower = query.toLowerCase();
    const queryWords = queryLower
      .split(/\s+/)
      .filter((word) => word.length > 3);

    // Calcular score de relevancia para cada artículo
    const scored = this.articulosIndexados.map((articulo) => {
      let score = 0;
      const articuloText = `${articulo.titulo} ${articulo.contenido} ${articulo.palabras_clave}`.toLowerCase();

      // Puntuación por palabras clave exactas
      queryWords.forEach((word) => {
        const count = (articuloText.match(new RegExp(word, 'g')) || []).length;
        score += count * 2;
      });

      // Bonus si aparece la frase completa
      if (articuloText.includes(queryLower)) {
        score += 10;
      }

      // Bonus por título
      if (articulo.titulo.toLowerCase().includes(queryLower)) {
        score += 15;
      }

      return { articulo, score };
    });

    // Ordenar por score y devolver top K
    const topResults = scored
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map((item) => item.articulo);

    this.logger.log(
      `🔍 Encontrados ${topResults.length} artículos relevantes para: "${query}"`,
    );

    return topResults;
  }

  /**
   * Búsqueda híbrida: combina búsqueda semántica con filtros
   */
  async busquedaHibrida(
    query: string,
    filters?: {
      titulo_seccion?: string;
      capitulo?: string;
      tipo_delito?: string;
    },
  ): Promise<Articulo[]> {
    let resultados = await this.buscarArticulosRelevantes(query, 10);

    // Aplicar filtros si se proporcionan
    if (filters) {
      resultados = resultados.filter((art) => {
        if (filters.titulo_seccion && art.titulo_seccion !== filters.titulo_seccion) {
          return false;
        }
        if (filters.capitulo && art.capitulo !== filters.capitulo) {
          return false;
        }
        if (
          filters.tipo_delito &&
          art.metadata?.tipo_delito !== filters.tipo_delito
        ) {
          return false;
        }
        return true;
      });
    }

    return resultados.slice(0, 5);
  }

  /**
   * Reindexar cuando se agregan nuevos artículos
   */
  async reindexar() {
    await this.indexarArticulos();
  }
}