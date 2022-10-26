import { Post } from 'src/posts/entities/posts.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'tag',
})
export class Tag {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Post, (post) => post.tags)
  posts: Post[];

  @CreateDateColumn({
    type: 'timestamp',
    name: 'create_at',
  })
  createAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'update_at',
  })
  updateAt: Date;
}
