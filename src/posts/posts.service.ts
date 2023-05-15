import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentService } from 'src/comment/comment.service';
import { TagService } from 'src/tag/tag.service';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, StatusEnum } from './entities/posts.entity';
import getCommentsCount from '../../utils/getCommentsCount';
import { Comment } from 'src/comment/entities/comment.entity';
import { Sort } from 'src/sort/entities/sort.entity';
import { getSavenMonth } from 'utils/getSavenMonth';
import { post } from 'superagent';

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
    const sort = new Sort();
    sort.id = createPostDto.sortId;
    const post = this.postsRepository.create({
      ...createPostDto,
      author: user,
      tags: tags,
      sort,
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

  // 首页分类
  async findeOneBySortId(
    sortId: string,
    currentPage: number,
    size: number,
    rule: number,
  ) {
    type Order = 'DESC' | 'ASC';
    const rules = [
      { createAt: 'DESC' },
      { readCount: 'DESC' },
      { likeCount: 'DESC' },
    ];
    console.log(
      Object.keys(rules[rule - 1])[0],
      Object.values(rules[rule - 1])[0],
    );
    const resultArray = await this.postsRepository
      .createQueryBuilder('posts')
      .select([
        'posts.id',
        'posts.title',
        'posts.summary',
        'posts.coverImg',
        'posts.likeCount',
        'posts.readCount',
        'posts.createAt',
      ])
      .where('posts.sort_id=:sortId', { sortId })
      .andWhere('posts.status=:status', { status: StatusEnum.APPROVED })
      .leftJoinAndSelect('posts.tags', 'tag')
      .leftJoinAndSelect('posts.author', 'author')
      .leftJoinAndSelect('posts.comments', 'comment')
      .skip((currentPage - 1) * size)
      .take(size)
      .orderBy(
        `posts.${Object.keys(rules[rule - 1])[0]}`,
        `${Object.values(rules[rule - 1])[0]}` as Order,
      )
      .getMany();
    for (const post of resultArray) {
      const newComments = [];
      for (const item of post.comments) {
        const result = await this.commentService.findOne(item.id);
        newComments.push(result);
      }
      post.comments = [];
      const comment = new Comment();
      comment.count = getCommentsCount(newComments);
      post.comments.push(comment);
    }
    return resultArray;
  }

  // 分页后的 总数
  async findPageCount(
    sortId: string,
    currentPage: number,
    size: number,
    status: string,
    title: string,
  ) {
    // const resultArray = await this.postsRepository
    const queryBuilder = this.postsRepository
      .createQueryBuilder('posts')
      .select([
        'posts.id',
        'posts.title',
        'posts.summary',
        'posts.coverImg',
        'posts.likeCount',
        'posts.readCount',
        'posts.createAt',
        'posts.status',
      ]);
    if (sortId) {
      queryBuilder.andWhere('posts.sort_id=:sortId', { sortId });
    }
    if (status) {
      queryBuilder.andWhere('posts.status=:status', { status });
    }
    if (title) {
      queryBuilder.andWhere('posts.title LIKE :title', {
        title: `%${title}%`,
      });
    }
    return await queryBuilder.getCount();
  }
  // 分页 条件查询文章
  async findPagePostList(
    sortId: string,
    currentPage: number,
    size: number,
    status: string,
    title: string,
  ) {
    // const resultArray = await this.postsRepository
    const queryBuilder = this.postsRepository
      .createQueryBuilder('posts')
      .select([
        'posts.id',
        'posts.title',
        'posts.summary',
        'posts.coverImg',
        'posts.likeCount',
        'posts.readCount',
        'posts.createAt',
        'posts.status',
      ]);
    if (sortId) {
      queryBuilder.andWhere('posts.sort_id=:sortId', { sortId });
    }
    if (status) {
      queryBuilder.andWhere('posts.status=:status', { status });
    }
    if (title) {
      queryBuilder.andWhere('posts.title LIKE :title', {
        title: `%${title}%`,
      });
    }
    const resultArray = await queryBuilder
      .leftJoinAndSelect('posts.tags', 'tag')
      .leftJoinAndSelect('posts.author', 'author')
      .leftJoinAndSelect('posts.sort', 'sort')
      .skip((currentPage - 1) * size)
      .take(size)
      .getMany();
    const total = await this.findPageCount(
      sortId,
      currentPage,
      size,
      status,
      title,
    );
    return {
      list: resultArray,
      total,
    };
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
    const sort = new Sort();
    sort.id = updatePostDto.sortId;
    const post = this.postsRepository.create({
      ...updatePostDto,
      tags,
      id: String(id),
      sort,
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

  async findPostsCount(id: string) {
    const timeFilter = getSavenMonth().map((item) => {
      return {
        date: item,
      };
    });
    const result = await Promise.all(
      timeFilter.map(async (item) => {
        const postCount = await this.postsRepository
          .createQueryBuilder('post')
          .where('post.user_id=:userId', { userId: id })
          .andWhere("DATE_FORMAT(post.createAt,'%Y-%m')=:date", {
            date: item.date,
          })
          .getCount();
        const dynamicCount = await this.postsRepository
          .createQueryBuilder('post')
          .where('post.user_id=:userId', { userId: id })
          .andWhere('post.sort_id=:sortId', { sortId: 6 })
          .andWhere("DATE_FORMAT(post.createAt,'%Y-%m')=:date", {
            date: item.date,
          })
          .getCount();
        // console.log(item.date, postCount, dynamicCount);
        return {
          date: item.date,
          postCount,
          dynamicCount,
        };
      }),
    );
    return result;
  }

  async findLikeAndReadCount(id: string) {
    const likeAndRead = await Promise.all([
      this.postsRepository
        .createQueryBuilder('post')
        .select('SUM(post.readCount)', 'readCount')
        .where('post.user_id=:userId', { userId: id })
        .getRawOne(),
      this.postsRepository
        .createQueryBuilder('post')
        .select('SUM(post.likeCount)', 'likeCount')
        .where('post.user_id=:userId', { userId: id })
        .getRawOne(),
    ]);
    const postIds = await this.postsRepository
      .createQueryBuilder('post')
      .select('post.id', 'postId')
      .where('post.user_id=:userId', { userId: id })
      .getRawMany();
    const commentCount = await this.commentService.getCommentsCount(
      postIds.map((item) => {
        return item.postId;
      }),
    );
    return {
      readCount: Number(likeAndRead[0].readCount),
      likeCount: Number(likeAndRead[1].likeCount),
      commentCount,
    };
  }

  async findLikeTop(id: string) {
    return this.postsRepository
      .createQueryBuilder('post')
      .where('post.user_id=:userId', { userId: id })
      .limit(5)
      .orderBy('post.likeCount', 'DESC')
      .getMany();
  }

  async findReadTop(id: string) {
    return this.postsRepository
      .createQueryBuilder('post')
      .where('post.user_id=:userId', { userId: id })
      .limit(5)
      .orderBy('post.readCount', 'DESC')
      .getMany();
  }

  async addReadCount(id) {
    const post = await this.postsRepository
      .createQueryBuilder('post')
      .where('post.id=:id', { id })
      .getOne();
    post.readCount = ++post.readCount;
    this.postsRepository.save(post);
  }

  async checkPost(updateDto: any) {
    const post = await this.postsRepository
      .createQueryBuilder('post')
      .where('post.id=:id', { id: updateDto.postId })
      .getOne();
    //  是否是已发布未审核状态
    if (post.status === 'release') {
      if (updateDto.status) {
        post.status = updateDto.status;
      }
    }
    this.postsRepository.save(post);
  }

  async getpostContent(id) {
    const post = await this.postsRepository
      .createQueryBuilder('post')
      .where('post.id=:id', { id })
      .getOne();
    return post;
  }

  async getMyPostContent(id) {
    const post = await this.postsRepository
      .createQueryBuilder('posts')
      .where('posts.id=:id', { id })
      .leftJoinAndSelect('posts.tags', 'tag')
      .leftJoinAndSelect('posts.sort', 'sort')
      .getOne();
    return post;
  }

  // 分页 我的文章列表
  async getMyPostPageList(
    id: string,
    sortId: string,
    currentPage: number,
    size: number,
    status: string,
    title: string,
  ) {
    // const resultArray = await this.postsRepository
    const queryBuilder = this.postsRepository
      .createQueryBuilder('posts')
      .select([
        'posts.id',
        'posts.title',
        'posts.summary',
        'posts.coverImg',
        'posts.likeCount',
        'posts.readCount',
        'posts.createAt',
        'posts.status',
      ])
      .where('posts.user_id=:id', { id });
    if (sortId) {
      queryBuilder.andWhere('posts.sort_id=:sortId', { sortId });
    }
    if (status) {
      queryBuilder.andWhere('posts.status=:status', { status });
    }
    if (title) {
      queryBuilder.andWhere('posts.title LIKE :title', {
        title: `%${title}%`,
      });
    }
    const resultArray = await queryBuilder
      .leftJoinAndSelect('posts.tags', 'tag')
      .leftJoinAndSelect('posts.author', 'author')
      .leftJoinAndSelect('posts.sort', 'sort')
      .skip((currentPage - 1) * size)
      .take(size)
      .getMany();
    const total = await this.getMyPostPageListCount(
      id,
      sortId,
      currentPage,
      size,
      status,
      title,
    );
    return {
      list: resultArray,
      total,
    };
  }
  // 分页后的 总数
  async getMyPostPageListCount(
    id: string,
    sortId: string,
    currentPage: number,
    size: number,
    status: string,
    title: string,
  ) {
    // const resultArray = await this.postsRepository
    const queryBuilder = this.postsRepository
      .createQueryBuilder('posts')
      .select([
        'posts.id',
        'posts.title',
        'posts.summary',
        'posts.coverImg',
        'posts.likeCount',
        'posts.readCount',
        'posts.createAt',
        'posts.status',
      ])
      .where('posts.user_id=:id', { id });
    if (sortId) {
      queryBuilder.andWhere('posts.sort_id=:sortId', { sortId });
    }
    if (status) {
      queryBuilder.andWhere('posts.status=:status', { status });
    }
    if (title) {
      queryBuilder.andWhere('posts.title LIKE :title', {
        title: `%${title}%`,
      });
    }
    return await queryBuilder.getCount();
  }
}
