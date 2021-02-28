import { Request, Response} from 'express';
import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import SurveyUserRepository from '../repositories/surveyUserRepository';

class AnswerController {
  async execute(request: Request, response: Response ) {
    const {value} = request.params;
    const {u: surveyUser} = request.query; 

    const surveyUserRepository = getCustomRepository(SurveyUserRepository);

    const surveyUserIsValid = await surveyUserRepository.findOne({id: String(surveyUser)});

    if (!surveyUserIsValid) {
      throw new AppError("Survey user does not exists") 
    }

    surveyUserIsValid.value = Number(value);

    await surveyUserRepository.save(surveyUserIsValid);

    return response.json(surveyUserIsValid);
  }
}

export default AnswerController;