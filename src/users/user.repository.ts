import { EntityRepository, Repository, FindManyOptions } from 'typeorm';
import { User } from './entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    paginate(query: FindManyOptions<User>): Promise<[User[], number]> {
        return this.findAndCount(query);
    }
}
