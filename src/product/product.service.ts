import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto, UpdateProductDto } from './product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private repo: Repository<Product>,
  ) {}

  create(dto: CreateProductDto) {
    const product = this.repo.create(dto);
    return this.repo.save(product);
  }

  async findAll(query: any) {
    const { search, minPrice, maxPrice, sortBy, order, page = 1, limit = 10 } = query;

    const qb = this.repo.createQueryBuilder('product');

    
    if (search) {
      qb.where('product.title LIKE :s OR product.description LIKE :s', {
        s: `%${search}%`,
      });
    }


    if (minPrice) qb.andWhere('product.price >= :minPrice', { minPrice });
    if (maxPrice) qb.andWhere('product.price <= :maxPrice', { maxPrice });

    
    if (sortBy) {
      qb.orderBy(`product.${sortBy}`, order === 'DESC' ? 'DESC' : 'ASC');
    }

    
    qb.skip((page - 1) * limit).take(limit);

    return qb.getMany();
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  async update(id: number, dto: UpdateProductDto) {
    const product = await this.repo.findOneBy({ id });
    if (!product) throw new NotFoundException('Product not found');

    Object.assign(product, dto);
    return this.repo.save(product);
  }

  delete(id: number) {
    return this.repo.delete(id);
  }

  async duplicate(id: number) {
    const product = await this.repo.findOneBy({ id });
    if (!product) throw new NotFoundException('Product not found');

    const newProduct = this.repo.create({
      title: product.title,
      description: product.description,
      price: product.price,
    });

    return this.repo.save(newProduct);
  }
}
