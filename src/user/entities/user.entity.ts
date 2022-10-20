import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { hashSync } from 'bcrypt';
import { Exclude } from 'class-transformer';

export enum UserRole {
  ADMIN = 'admin',
  AUTHOR = 'author',
  READERS = 'readers',
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
    enum: UserRole,
    default: UserRole.READERS,
  })
  role: UserRole;

  @CreateDateColumn()
  currentAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @BeforeInsert()
  getEncryptionPassword() {
    if (!this.password) return;
    this.password = hashSync(this.password, 10);
  }
}
