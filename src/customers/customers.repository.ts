// import { CreateCustomerDto, UpdateCustomerDto } from './dto';
import { EntityRepository, Repository, FindManyOptions } from 'typeorm';
import { Customer } from './entities/customer.entity';

@EntityRepository(Customer)
export class CustomerRepository extends Repository<Customer> {

    paginate(query: FindManyOptions<Customer>): Promise<[Customer[], number]> {
        return this.findAndCount(query);
    }

    // store(createProductDto: CreateCustomerDto): Promise<Customer> {
    //     return this.create(createProductDto);
    // }

    // show(id: string): Promise<Customer> {
    //     return this.customerModel.findById(id).exec();
    // }

    // update(id: string, updateProductDto: UpdateCustomerDto): Promise<Customer> {
    //     return this.updateOne(id, updateProductDto);
    // }

    // destroy(id: string): Promise<Customer> {
    //     return this.customerModel.findByIdAndRemove(id).exec();
    // }

    // findByEmail(email: string): Promise<Customer> {
    //     return this.customerModel.findOne({ email }).select('+password').exec();
    // }

    // updateOne(conditions: any, data: any): Promise<Customer> {
    //     return this.customerModel.findOneAndUpdate(conditions, { $set: data }, { new: true }).exec();
    // }
}
