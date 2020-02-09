// import { CreateCustomerDto, UpdateCustomerDto } from './dto';
import { Repository, UpdateResult, FindConditions, FindOneOptions, FindManyOptions, DeleteResult } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CustomerRepository } from './customers.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCustomerDto, UpdateCustomerDto } from './dto';
import { genSalt, hash } from 'bcryptjs';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class CustomersService {

    constructor(
        @InjectRepository(CustomerRepository)
        private readonly customerRepository: Repository<Customer>
    ) { }

    count(query?: FindManyOptions<Customer>): Promise<number> {
        return this.customerRepository.count(query);
    }

    paginate(query: FindManyOptions<Customer>): Promise<[Customer[], number]> {
        return this.customerRepository.findAndCount(query);
    }

    async store(createCustomerDto: CreateCustomerDto): Promise<Customer> {
        try {
            const salt = await genSalt(10);
            createCustomerDto.password = await hash(createCustomerDto.password, salt);
            const customer = await this.customerRepository.save(createCustomerDto);
            return customer;
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new HttpException({ email: 'ER_DUP_ENTRY' }, HttpStatus.UNPROCESSABLE_ENTITY);
            }
            return error;
        }
    }

    show(id: number, query?: FindOneOptions<Customer>): Promise<Customer> {
        return this.customerRepository.findOneOrFail(id, query);
    }

    update(id: number, updateCustomerDto: QueryDeepPartialEntity<Customer>): Promise<UpdateResult> {
        return this.customerRepository.update(id, updateCustomerDto);
    }

    delete(id: number): Promise<DeleteResult> {
        return this.customerRepository.delete(id);
    }

    // destroy(id: string): Promise<Customer> {
    //     return this.customerModel.findByIdAndRemove(id).exec();
    // }

    findByEmail(email: string): Promise<Customer> {
        return this.customerRepository.findOne({ where: { email }, select: ['password', 'emailVerifiedAt', 'id', 'name', 'email'] });
    }

    updateOne(conditions: FindConditions<Customer>, data: any): Promise<UpdateResult> {
        return this.customerRepository.update(conditions, data);
    }
}
