import { Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/posts/entities/posts.entity';
import { User } from 'src/user/entities/user.entity';
import {
  DataSource,
  getManager,
  getRepository,
  getTreeRepository,
  Repository,
  TreeRepository,
} from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: TreeRepository<Comment>,
  ) {}

  async create(createCommentDto: any, user: User) {
    // 判断是否传入replay_id(传入了，表示是回复别人的评论)（没传，表示是回复一个文章的评论）
    const post = new Post();
    // 是否传文章postId,(传入了，表示是回复文章)（没传，表示是回复别人的评论）
    post.id = createCommentDto.postId;
    if (createCommentDto.replayId) {
      const parent = await this.commentRepository
        .createQueryBuilder('comment')
        .where('comment.id=:id', { id: createCommentDto.replayId })
        .getOne();

      const comment = this.commentRepository.create({
        ...createCommentDto,
        replay: parent,
        author: user,
      });
      this.commentRepository.save(comment);
    } else {
      const result = this.commentRepository.create({
        ...createCommentDto,
        post,
        author: user,
      });
      console.log(result);
      await this.commentRepository.save(result);
    }
  }

  findAll() {
    return `This action returns all comment`;
  }

  // async findOne(id: number) {
  //   // return await this.commentRepository
  //   //   .createQueryBuilder('comment')
  //   //   .innerJoinAndSelect('comment.replayComments', 'replay_comment')
  //   //   // .leftJoinAndSelect('comment.author', 'author')
  //   //   // .leftJoinAndSelect('replay_comment.replayComments', 'replay__comment')
  //   //   // .leftJoinAndSelect('replay_comment.author', '_author')
  //   //   // .leftJoinAndSelect('replay__comment.replayComments', 'replay___comment')
  //   //   // .leftJoinAndSelect('replay__comment.author', '__author')
  //   //   .where('comment.id=:id', { id: String(id) })
  //   //   .getOne();

  //   // const parent = new Comment();
  //   // parent.content = '2';
  //   // await this.commentRepository.save(parent);
  //   // const children = new Comment();
  //   // children.content = '3';
  //   // children.replay = parent;
  //   // return this.commentRepository.save(children);

  //   const parent = await this.commentRepository
  //     .createQueryBuilder('comment')
  //     .where('comment.id=:id', { id: '7' })
  //     .getOne();
  //   console.log(parent);
  //   // return await this.commentRepository
  //   //   .createDescendantsQueryBuilder('comment', 'commentClosure', parent)
  //   //   .getMany();
  //   // console.log(this.commentRepository);
  //   return await this.commentRepository.findTrees();
  //   // return await getManager().getTreeRepository(Comment).findTrees();
  // }

  // 评论id
  async findOne(id: number) {
    // 查询评论中所有根节点以及嵌套的子节点
    // return await this.commentRepository.findTrees();

    // 查询指定评论id，他和他子类的数据
    const parent = await this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.id=:id', { id })
      .getOne();
    // 返回parentCategory的所有直接子类别（及其嵌套类别）
    // return await this.commentRepository.findDescendantsTree(parent);

    // 正确的格式！！！
    return await this.commentRepository
      .createDescendantsQueryBuilder('comment', 'comment_closure', parent)
      .leftJoinAndSelect('comment.author', 'author')
      .leftJoinAndSelect('comment.replay', 'repair_comment')
      .leftJoinAndSelect('repair_comment.author', '_author')
      .getMany();
  }
  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
