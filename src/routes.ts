import {Router} from 'express';

import UserController from './controllers/userController';
import SurveyController from './controllers/surveyController';
import SendMailController from './controllers/sendMailController';
import AnswerController from './controllers/answerController';
import NPSController from './controllers/npsController';

const router = Router();

const userController = new UserController();
const surveyController = new SurveyController();
const sendMailController = new SendMailController();
const answerController = new AnswerController();
const npsController = new NPSController();

router.post('/users', userController.create)

router.post('/surveys', surveyController.create)
router.get('/surveys', surveyController.list)

router.post('/mail', sendMailController.execute);

router.get('/answers/:value', answerController.execute);

router.get('/nps/:survey_id', npsController.execute);



export default router;