import { Comment } from 'src/comment/entities/comment.entity';
import { Sort } from 'src/sort/entities/sort.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

enum StatusEnum {
  DRAFT = 'draft',
  RELEASE = 'release',
  APPROVED = 'approved',
  REJECTION = 'rejection',
}

@Entity({
  name: 'post',
})
export class Post {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    default: null,
  })
  title: string;

  @Column({
    default: null,
  })
  summary: string;

  @Column({
    name: 'cover_img',
    default: null,
  })
  coverImg: string;

  @Column({
    type: 'mediumtext',
    default: null,
  })
  content: string;

  @Column({
    type: 'mediumtext',
    default: null,
    name: 'content_html',
  })
  contentHtml: string;

  @Column({
    default: 0,
    name: 'read_count',
  })
  readCount: number;

  @Column({
    default: 0,
    name: 'like_count',
  })
  likeCount: number;

  @ManyToMany(() => Tag, (tag) => tag.posts)
  @JoinTable({
    name: 'post_tag',
    joinColumns: [{ name: 'post_id' }],
    inverseJoinColumns: [{ name: 'tag_id' }],
  })
  tags: Tag[];

  @ManyToOne(() => Sort, (sort) => sort.posts)
  @JoinColumn({
    name: 'sort_id',
  })
  sort: Sort;

  // 文章状态
  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.DRAFT,
  })
  status: StatusEnum;
  // 作者
  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({
    name: 'user_id',
  })
  author: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  // 发布时间(审核通过时候赋值)
  @Column({
    name: 'publish_time',
    default: null,
    type: 'timestamp',
  })
  publishTime: Date;

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
