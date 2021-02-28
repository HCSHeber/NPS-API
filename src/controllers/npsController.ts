import { Request, Response } from "express";
import { getCustomRepository, IsNull, Not } from "typeorm";
import AppError from "../errors/AppError";

import SurveyUserRepository from "../repositories/surveyUserRepository";

class NPSController {
  async execute(request: Request, response: Response) {
    const {survey_id} = request.params;

    const surveyUserRepository = await getCustomRepository(SurveyUserRepository);

    const surveysUsers = await surveyUserRepository.find({
      where: {
        survey_id,
        value: Not(IsNull())
      }
    });

    if (!surveysUsers) {
      throw new AppError("Survey user does not exists") 
    }

    const detractors = surveysUsers.filter(
      (survey) => survey.value >= 1 && survey.value <= 6
    ).length;

    const promoters = surveysUsers.filter(
      (survey) => survey.value >= 9 && survey.value <= 10
    ).length;

    const passives = surveysUsers.filter(
      (survey) => survey.value >= 7 && survey.value <= 8
    ).length;

    const totalAnswers = surveysUsers.length;

    const result = Number((((promoters - detractors) / totalAnswers) * 100).toFixed(2));

    return response.json({
      passives,
      detractors,
      promoters,
      totalAnswers,
      nps: result
    })
  };
}

export default NPSController;