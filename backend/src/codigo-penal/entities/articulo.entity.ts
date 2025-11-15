import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('articulos_codigo_penal')
export class Articulo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  numero: string; // Ej: "Artículo 103"

  @Column({ length: 500 })
  titulo: string; // Ej: "Homicidio"

  @Column({ type: 'text' })
  contenido: string; // Texto completo del artículo

  @Column({ length: 200, nullable: true })
  libro: string; // Ej: "LIBRO PRIMERO"

  @Column({ length: 200, nullable: true })
  titulo_seccion: string; // Ej: "TITULO I - DELITOS CONTRA LA VIDA"

  @Column({ length: 200, nullable: true })
  capitulo: string; // Ej: "CAPITULO SEGUNDO - Del homicidio"

  @Column({ type: 'text', nullable: true })
  palabras_clave: string; // Para búsqueda: "homicidio,muerte,matar"

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    pena_minima?: string;
    pena_maxima?: string;
    tipo_delito?: string;
    agravantes?: string[];
    atenuantes?: string[];
  };

  @CreateDateColumn()
  createdAt: Date;
}