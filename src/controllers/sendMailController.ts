import {Response, Request} from 'express';
import {getCustomRepository} from 'typeorm';
import {resolve} from 'path';
import * as Yup from 'yup'; 

import UserRepository from '../repositories/userRepository';
import SurveyRepository from '../repositories/surveysRepository';
import SurveyUserRepository from '../repositories/surveyUserRepository';

import SendMailService from '../services/sendMailService';
import AppError from '../errors/AppError';


class SendMailController {
  async execute(request: Request, response: Response) {
    const {email, survey_id} = request.body;

    const schema = Yup.object().shape({
      email: Yup.string().email().required("O email do usuário é obrigatório para o envio da pesquisa"),
      survey_id: Yup.string().uuid().required("O id da pesquisa é obrigatório para o envio da pesquisa")
    })

    try {
      await schema.validate(request.body, {abortEarly: false});
    } catch(err) {
      throw new AppError(err); 
    }

    const userRepository = await getCustomRepository(UserRepository);
    const surveyRepository = await getCustomRepository (SurveyRepository);
    const surveyUserRepository = await getCustomRepository (SurveyUserRepository);

    const user = await userRepository.findOne({email});

    if (!user) {
      throw new AppError("User does not exists");
    }

    const survey = await surveyRepository.findOne({id: survey_id});

    if (!survey) {
      throw new AppError("Survey user does not exists"); 
    }

    const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");  

    const surveyUser = await surveyUserRepository.findOne({
      where: {
        user_id: user.id,
        value: null
      },
      relations: ["user", "survey"]
    });

    const body = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      id: "",
      link: process.env.URL_MAIL
    }

    if (surveyUser) {
      body.id = surveyUser.id;
      await SendMailService.execute(user.email, survey.title, body, npsPath);
      return response.status(201).json(surveyUser);
    }

    const newSurveyUser = await surveyUserRepository.create({
      user_id: user.id,
      survey_id: survey.id,
    });

    await surveyUserRepository.save(newSurveyUser);
    body.id = newSurveyUser.id;
    await SendMailService.execute(user.email, survey.title, body, npsPath);

    return response.status(201).json(newSurveyUser);
  }
}

export default SendMailController;