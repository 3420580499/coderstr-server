import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentService } from 'src/comment/comment.service';
import { TagService } from 'src/tag/tag.service';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/posts.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    private readonly tagService: TagService,
    private readonly commentService: CommentService,
  ) {}

  async create(createPostDto: any, user: User) {
    console.log(user);
    console.log(createPostDto);
    const tags = await this.tagService.findByIds(createPostDto.tags);
    const post = this.postsRepository.create({
      ...createPostDto,
      author: user,
      tags: tags,
    });
    return await this.postsRepository.save(post);
  }

  findAll() {
    return `This action returns all posts`;
  }

  async findOne(id: number) {
    const result = await this.postsRepository
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.tags', 'tag')
      .leftJoinAndSelect('posts.author', 'author')
      .leftJoinAndSelect('posts.comments', 'comment')
      .leftJoinAndSelect('posts.sort', 'sort')
      .where('posts.id=:id', { id })
      .getOne();
    const newComments = [];
    for (const item of result.comments) {
      const result = await this.commentService.findOne(item.id);
      newComments.push(result);
    }
    result.comments = newComments;
    return result;
  }
  // 查询指定评论post_id文章的回复评论
  // async findOneByPostId(id: number) {
  //   const result = await this.postsRepository
  //     .createQueryBuilder('posts')
  //     .leftJoinAndSelect('posts.tags', 'tag')
  //     .leftJoinAndSelect('posts.author', 'author')
  //     .leftJoinAndSelect('posts.comments', 'comment')
  //     .where('posts.id=:id', { id })
  //     .getOne();
  //   const newComments = [];
  //   for (const item of result.comments) {
  //     const result = await this.commentService.findOne(item.id);
  //     newComments.push(result);
  //   }
  //   result.comments = newComments;
  //   return result;
  // }

  async update(id: number, updatePostDto: any) {
    const tags = await this.tagService.findByIds(updatePostDto.tags);
    const post = this.postsRepository.create({
      ...updatePostDto,
      tags,
      id: String(id),
    });
    return await this.postsRepository.save(post);
    // return await this.postsRepository
    //   .createQueryBuilder('post')
    //   .update()
    //   .set({ ...updatePostDto, tags })
    //   .where('post.id=:id', { id })
    //   .execute();
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
