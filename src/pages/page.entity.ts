import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { PageEventEntity } from './page-event.entity';
import { AssetScoreBreakdown } from '../assets/asset.types';
import { MarketingAsset } from '../assets/asset.types';

@Entity('pages')
export class PageEntity {
  @PrimaryColumn()
  id!: string;

  @Column({ unique: true })
  slug!: string;

  @Column()
  firmName!: string;

  @Column('text')
  heroCopy!: string;

  @Column('text')
  metaTitle!: string;

  @Column('text')
  metaDescription!: string;

  @Column('simple-json')
  firmAttributes!: Record<string, unknown>;

  @Column('simple-json')
  selectedAssets!: MarketingAsset[];

  @Column('simple-json')
  scoringExplanations!: AssetScoreBreakdown[];

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => PageEventEntity, (event) => event.page)
  events?: PageEventEntity[];
}
