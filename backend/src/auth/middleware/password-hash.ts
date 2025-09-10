import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';

@Injectable()
export class PasswordHash implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const plainTextPassword = req.body['password'];
    const salt = bcrypt.genSaltSync(10);
    req.body['password'] = bcrypt.hashSync(plainTextPassword.password, salt);

    next();
  }
}
