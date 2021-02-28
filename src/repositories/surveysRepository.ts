import { EntityRepository, Repository} from 'typeorm';
import Survey from "../models/surveys";

@EntityRepository(Survey)
class SurveyRepository extends Repository<Survey> {}

export default SurveyRepository;