import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { PageEntity } from './page.entity';
import { PageEventType } from '../types/page-event.types';

@Entity('page_events')
export class PageEventEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  pageId!: string;

  @ManyToOne(() => PageEntity, (page) => page.events, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pageId' })
  page?: PageEntity;

  @Column({ type: 'varchar' })
  eventType!: PageEventType;

  @Column({ nullable: true })
  assetId?: string;

  @Column('simple-json', { nullable: true })
  metadata?: Record<string, unknown>;

  @CreateDateColumn()
  createdAt!: Date;
}
