import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinTable,
} from 'typeorm';
import { hashSync } from 'bcrypt';
import { Exclude } from 'class-transformer';
import { Post } from 'src/posts/entities/posts.entity';
import { Comment } from 'src/comment/entities/comment.entity';

export enum UserRole {
  ADMIN = 'admin',
  AUTHOR = 'author',
  READERS = 'readers',
}

export enum UserSex {
  MAN = 0,
  WOMAN = 1,
}

@Entity({
  name: 'b_user',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 80,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 80,
    nullable: true,
  })
  nickname: string;

  @Column({
    type: 'varchar',
    length: 80,
  })
  phone: string;

  @Column({
    type: 'varchar',
    length: 80,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 80,
  })
  birthDay: string;

  @Column({
    type: 'varchar',
    length: 80,
  })
  address: string;

  @Column({
    type: 'varchar',
    length: 80,
  })
  introduce: string;

  @Column({
    type: 'varchar',
    name: 'avatar_url',
    default: 'static/avatar_default/810727fdd6c178f4f3ac06be3c30657d.jpeg',
  })
  avatarUrl: string;

  // 查询的时候默认不返回该字段(select:false)
  @Column({
    type: 'varchar',
    length: 80,
    select: false,
  })
  //返回数据时不包含密码字段(加入@Exclude(),在某个接口请求方法上加入@UseInterceptors(ClassSerializerInterceptor))
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: UserSex,
    default: UserSex.MAN,
  })
  sex: UserSex;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.READERS,
  })
  role: UserRole;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @BeforeInsert()
  getEncryptionPassword() {
    if (!this.password) return;
    this.password = hashSync(this.password, 10);
  }

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @ManyToMany(() => Post, (post) => post.users)
  @JoinTable({
    name: 'post_user',
    joinColumns: [{ name: 'user_id' }],
    inverseJoinColumns: [{ name: 'post_id' }],
  })
  postss: Post[];
}
