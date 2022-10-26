import { Post } from 'src/posts/entities/posts.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Tree('closure-table')
export class Comment {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    type: 'mediumtext',
    default: null,
  })
  content: string;

  @Column({
    name: 'like_count',
    default: 0,
  })
  likeCount: number;

  // 不添加，取length属性
  // @Column({
  //   name: 'replay_count',
  // })
  // replayCount: number;

  // 自连接
  // @ManyToOne(() => Comment, (comment) => comment.replayComments)
  @TreeParent()
  @JoinColumn({
    name: 'replay_id',
  })
  replay: Comment;
  // 自连接
  // @OneToMany(() => Comment, (comment) => comment.replay)
  @TreeChildren()
  replayComments: Comment[];

  // 用户
  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({
    name: 'user_id',
  })
  author: User;

  //文章
  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({
    name: 'post_id',
  })
  post: Post;

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
