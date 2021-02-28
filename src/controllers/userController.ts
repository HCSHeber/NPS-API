import { Request, Response } from 'express';
import {getCustomRepository} from 'typeorm';
import * as Yup from 'yup';
import AppError from '../errors/AppError';
import Userrepository from '../repositories/userRepository';


class UserController {
  async create(request: Request, response: Response) {
    const {name, email} = request.body;

    const schema = Yup.object().shape({
      name: Yup.string().required("O nome é obrigatório para o cadastro"),
      email: Yup.string().email().required("O email é obrigatório no cadastro")
    })

    try {
      await schema.validate(request.body, {abortEarly:false});
    } catch(err) {
      throw new AppError(err); 
    }


    const usersRepository = getCustomRepository(Userrepository);

    const checkUserAlreadyExists = await usersRepository.findOne({
      email
    });

    if (checkUserAlreadyExists) {
      throw new AppError("User already exists");
    }

    const user = usersRepository.create({
      name,
      email
    })

    await usersRepository.save(user);

    return response.status(201).json(user);
  }
}

export default UserController;

