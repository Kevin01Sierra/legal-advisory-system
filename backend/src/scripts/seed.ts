import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Repository } from 'typeorm';
import { Articulo } from '../codigo-penal/entities/articulo.entity';
import * as fs from 'fs';
import * as path from 'path';

/**
 * ═══════════════════════════════════════════════════════════════
 * SCRIPT ÚNICO DE CARGA DEL CÓDIGO PENAL COLOMBIANO
 * ═══════════════════════════════════════════════════════════════
 * 
 * Este es el ÚNICO script que necesitas ejecutar.
 * 
 * REQUISITO PREVIO:
 * - Debes tener el archivo: backend/data/codigo_penal_colombia.txt
 * - Si tienes PDF, ejecuta primero: npm run extract:pdf
 * 
 * EJECUCIÓN:
 * npm run seed
 * ═══════════════════════════════════════════════════════════════
 */

interface ArticuloData {
  numero: string;
  titulo: string;
  contenido: string;
  libro: string;
  titulo_seccion: string;
  capitulo: string;
  palabras_clave: string;
  metadata: any;
}

class SimpleParser {
  private articulos: ArticuloData[] = [];
  private currentLibro = '';
  private currentTitulo = '';
  private currentCapitulo = '';

  parse(text: string): ArticuloData[] {
    // Limpiar texto
    const cleanText = text
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n');

    // Dividir en líneas
    const lines = cleanText.split('\n').map(l => l.trim()).filter(l => l);

    let currentArticulo: Partial<ArticuloData> | null = null;
    let contentLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Detectar estructura del documento
      if (line.match(/^LIBRO\s+(PRIMERO|SEGUNDO)/i)) {
        this.currentLibro = line;
        continue;
      }

      if (line.match(/^TITULO\s+[IVXLCDM]+/i)) {
        this.currentTitulo = line;
        if (i + 1 < lines.length && !lines[i + 1].match(/^(CAPITULO|Artículo)/i)) {
          this.currentTitulo += ' - ' + lines[i + 1];
          i++;
        }
        continue;
      }

      if (line.match(/^CAPITULO\s+/i)) {
        this.currentCapitulo = line;
        if (i + 1 < lines.length && !lines[i + 1].match(/^Artículo/i)) {
          this.currentCapitulo += ' - ' + lines[i + 1];
          i++;
        }
        continue;
      }

      // Detectar inicio de artículo: "Artículo 123. Título del artículo."
      const artMatch = line.match(/^Artículo\s+(\d+)[°º]?\.\s+(.+)/i);
      
      if (artMatch) {
        // Guardar artículo anterior
        if (currentArticulo && contentLines.length > 0) {
          currentArticulo.contenido = contentLines.join(' ').trim();
          this.saveArticulo(currentArticulo as ArticuloData);
        }

        // Nuevo artículo
        const titulo = artMatch[2].replace(/\.$/, '').trim();
        currentArticulo = {
          numero: `Artículo ${artMatch[1]}`,
          titulo: titulo,
          contenido: '',
          libro: this.currentLibro,
          titulo_seccion: this.currentTitulo,
          capitulo: this.currentCapitulo,
          palabras_clave: '',
          metadata: {},
        };
        
        contentLines = [];
        continue;
      }

      // Acumular contenido del artículo
      if (currentArticulo && !line.match(/^(LIBRO|TITULO|CAPITULO)/i)) {
        contentLines.push(line);
      }
    }

    // Guardar último artículo
    if (currentArticulo && contentLines.length > 0) {
      currentArticulo.contenido = contentLines.join(' ').trim();
      this.saveArticulo(currentArticulo as ArticuloData);
    }

    return this.articulos;
  }

  private saveArticulo(articulo: ArticuloData) {
    // Limpiar y procesar
    articulo.contenido = this.cleanText(articulo.contenido);
    articulo.metadata = this.extractMetadata(articulo.titulo, articulo.contenido);
    articulo.palabras_clave = this.generateKeywords(articulo.titulo, articulo.contenido);

    this.articulos.push(articulo);
  }

  private cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/\s+\./g, '.')
      .replace(/\s+,/g, ',')
      .trim();
  }

  private extractMetadata(titulo: string, contenido: string): any {
    const metadata: any = {};

    // Extraer penas
    const penaMatch = contenido.match(/prisión de\s+[^\(]*\((\d+)\)[^\(]*a[^\(]*\((\d+)\)\s*años/i);
    if (penaMatch) {
      metadata.pena_minima = `${penaMatch[1]} años`;
      metadata.pena_maxima = `${penaMatch[2]} años`;
    }

    // Extraer multa
    const multaMatch = contenido.match(/multa de\s+(.+?)\s+salarios/i);
    if (multaMatch) {
      metadata.multa = multaMatch[1];
    }

    // Tipo de delito
    const delitos = ['homicidio', 'hurto', 'estafa', 'secuestro', 'extorsión', 'violación', 'tortura', 'terrorismo', 'peculado', 'cohecho'];
    for (const tipo of delitos) {
      if (titulo.toLowerCase().includes(tipo) || contenido.toLowerCase().includes(tipo)) {
        metadata.tipo_delito = tipo;
        break;
      }
    }

    return metadata;
  }

  private generateKeywords(titulo: string, contenido: string): string {
    const stopWords = new Set(['el', 'la', 'los', 'las', 'de', 'del', 'en', 'por', 'para', 'con', 'que', 'se', 'un', 'una']);
    const text = `${titulo} ${contenido}`.toLowerCase();
    const words = text.match(/\b[a-záéíóúñ]{4,}\b/g) || [];
    
    const freq = new Map<string, number>();
    words.forEach(w => {
      if (!stopWords.has(w)) {
        freq.set(w, (freq.get(w) || 0) + 1);
      }
    });

    return Array.from(freq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([w]) => w)
      .join(',');
  }
}

async function main() {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('  CARGA DEL CÓDIGO PENAL COLOMBIANO - LEY 599 DE 2000');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Buscar archivo TXT
  const txtPath = path.join(process.cwd(), 'data', 'codigo_penal_colombia.txt');

  if (!fs.existsSync(txtPath)) {
    console.error('❌ ERROR: No se encontró el archivo de texto');
    console.log(`\n   Buscado en: ${txtPath}`);
    console.log('\n💡 Solución:');
    console.log('   1. Si tienes el PDF:');
    console.log('      - Copia el PDF a: backend/data/codigo_penal_colombia.pdf');
    console.log('      - Ejecuta: npm run extract:pdf');
    console.log('   2. Si tienes el TXT:');
    console.log('      - Copia el TXT a: backend/data/codigo_penal_colombia.txt');
    console.log('   3. Vuelve a ejecutar: npm run seed\n');
    process.exit(1);
  }

  // Crear contexto de NestJS
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    // Obtener repositorio de TypeORM
    const articuloRepo = app.get<Repository<Articulo>>('ArticuloRepository');

    // Verificar datos existentes
    const count = await articuloRepo.count();
    if (count > 0) {
      console.log(`⚠️  Advertencia: Ya existen ${count} artículos en la base de datos`);
      console.log('🗑️  Limpiando base de datos...');
      await articuloRepo.clear();
      console.log('✅ Base de datos limpiada\n');
    }

    // Leer archivo
    console.log('📖 Leyendo archivo...');
    const text = fs.readFileSync(txtPath, 'utf-8');
    console.log(`✅ Archivo cargado (${(text.length / 1024).toFixed(2)} KB)\n`);

    // Parsear
    console.log('🔍 Analizando documento...');
    const parser = new SimpleParser();
    const articulos = parser.parse(text);

    if (articulos.length === 0) {
      console.error('❌ ERROR: No se encontraron artículos en el documento');
      console.log('\n💡 Verifica que el archivo tenga el formato correcto.');
      console.log('   Los artículos deben comenzar con: "Artículo 123. Título"\n');
      process.exit(1);
    }

    console.log(`✅ Encontrados ${articulos.length} artículos\n`);

    // Estadísticas
    const conPena = articulos.filter(a => a.metadata.pena_minima).length;
    console.log('📊 Estadísticas:');
    console.log(`   ├─ Total de artículos: ${articulos.length}`);
    console.log(`   ├─ Con pena de prisión: ${conPena}`);
    console.log(`   └─ Con palabras clave: ${articulos.filter(a => a.palabras_clave).length}\n`);

    // Guardar en BD
    console.log('💾 Guardando en PostgreSQL...');
    const batchSize = 100;
    let saved = 0;
    const startTime = Date.now();

    for (let i = 0; i < articulos.length; i += batchSize) {
      const batch = articulos.slice(i, i + batchSize);
      await articuloRepo.save(batch);
      saved += batch.length;
      
      const percent = Math.round((saved / articulos.length) * 100);
      process.stdout.write(`\r   Progreso: ${saved}/${articulos.length} (${percent}%)`);
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log(`\n\n✅ ¡Carga completada exitosamente!`);
    console.log(`   ├─ Tiempo: ${elapsed}s`);
    console.log(`   └─ Velocidad: ${(saved / parseFloat(elapsed)).toFixed(1)} artículos/s\n`);

    // Verificar
    const finalCount = await articuloRepo.count();
    console.log(`🔍 Verificación: ${finalCount} artículos en base de datos`);

    if (finalCount !== articulos.length) {
      console.warn(`   ⚠️  Se esperaban ${articulos.length} pero hay ${finalCount}`);
    }

    // Ejemplos
    console.log(`\n📝 Ejemplos de artículos cargados:\n`);
    const ejemplos = await articuloRepo.find({ take: 3 });
    
    ejemplos.forEach((art, i) => {
      console.log(`   ${i + 1}. ${art.numero} - ${art.titulo}`);
      if (art.metadata.pena_minima) {
        console.log(`      Pena: ${art.metadata.pena_minima} a ${art.metadata.pena_maxima}`);
      }
      console.log(`      ${art.contenido.substring(0, 80)}...\n`);
    });

    console.log('═══════════════════════════════════════════════════════════');
    console.log('  🎉 SISTEMA LISTO PARA USAR');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('\n📌 Próximos pasos:');
    console.log('   1. Backend:  npm run start:dev');
    console.log('   2. Frontend: cd ../frontend && npm run dev');
    console.log('   3. Abrir:    http://localhost:3000\n');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.log('\n💡 Verifica:');
    console.log('   - PostgreSQL está corriendo (docker-compose up -d)');
    console.log('   - Las credenciales en .env son correctas');
    console.log('   - El formato del archivo es correcto\n');
    process.exit(1);
  } finally {
    await app.close();
  }
}

main();