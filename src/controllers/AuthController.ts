import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import {BaseController} from './baseController.js';
import {TYPES} from '../infrastructure/types.js';
import {IAuthService} from '../infrastructure/IAuthService.js';
import {HttpMethod} from './http-method.enum.js';
import {ILogger} from '../infrastructure/Logger/ILogger.js';

@injectable()
export class AuthController extends BaseController {
  constructor(
    @inject(TYPES.AuthService) private authService: IAuthService,
    @inject(TYPES.Logger) logger: ILogger
  ) {
    super(logger);
    this.addRoute({ path: '/login', method: HttpMethod.Post, handler: this.login });
    this.addRoute({ path: '/logout', method: HttpMethod.Post, handler: this.logout });
    this.addRoute({ path: '/check-status', method: HttpMethod.Get, handler: this.checkStatus });
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { usernameOrEmail, password } = req.body;
      const token = await this.authService.login(usernameOrEmail, password);
      return this.sendOk(res, { token });
    } catch (error) {
      return this.sendUnauthorized(res, 'Invalid credentials');
    }
  }

  async logout(req: Request, res: Response): Promise<Response> {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if(token === undefined) {
        throw new Error();
      }

      await this.authService.logout(token);
      return this.sendOk(res, { message: 'Logged out successfully' });
    } catch (error) {
      return this.sendUnauthorized(res, 'Unable to logout');
    }
  }

  async checkStatus(req: Request, res: Response): Promise<Response> {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if(token === undefined) {
        throw new Error();
      }

      const user = await this.authService.validateToken(token);
      return this.sendOk(res, user);
    } catch (error) {
      return this.sendUnauthorized(res, 'Invalid token');
    }
  }
}
