import {Request, Response} from 'express';
import {getCustomRepository} from 'typeorm';
import * as Yup from 'yup';
import AppError from '../errors/AppError';
import SurveyRepository from '../repositories/surveysRepository';


class SurveyController {
  async create(request: Request, response: Response) {
    const {title, description} = request.body;

    const schema = Yup.object().shape({
      title: Yup.string().required("O titulo da pesquisa é obrigatório"),
      description: Yup.string().required("A descrição da pesquisa é obrigatória")
    })

    try {
      await schema.validate(request.body, {abortEarly: false});
    } catch (err) {
      throw new AppError(err); 
    }

    const surveyRepository = getCustomRepository(SurveyRepository);

    const survey = surveyRepository.create({
      title,
      description
    })

    await surveyRepository.save(survey);

    return response.status(201).json(survey);
  }

  async list(request: Request, response: Response) {
    const surveyRepository = getCustomRepository(SurveyRepository);

    const surveys = await surveyRepository.find();

    return response.json(surveys)
  }
}

export default SurveyController;