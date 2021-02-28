import { EntityRepository, Repository} from 'typeorm';
import User from "../models/user";

@EntityRepository(User)
class Userrepository extends Repository<User> {}

export default Userrepository;