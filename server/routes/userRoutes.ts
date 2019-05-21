import { NextFunction, Request, Response, Router } from 'express';
import { Types } from 'mongoose';

import UserS from '../models/user';
import { randomBytes } from '../security/utils';
import { sessionStorage } from 'server/security/session-storage';
import { User } from 'src/app/model/user';


class UserRoutes {

	private _router: Router = Router();

	constructor() {
		this.routes();
	}

	private async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    await UserS.find({})
      .then((users) => {
        if (users) {
          res.status(201).json(users);
          return next();
        } else {
          res.status(401).json({
            message: 'Data not found',
            name: 'NoDataError'
          });
          return next();
        }
      })
      .catch((err) => {
        res.status(401).json({
          message: err.message,
          name: err.name
        });
        return next();
      });
	}

  private getUserBySession(req: Request, res: Response) {
    const sessionId = req.cookies["SESSIONID"];
    const user = sessionStorage.findUserBySessionId(sessionId);
    if (user)  {
      res.status(200).json(user);
    } else {
      res.sendStatus(204)
    }
  }

	private async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    if (Types.ObjectId.isValid(id)) {
      await UserS.findById(id)
        .then((user) => {
          if (user) {
            res.status(201).json(user);
            return next();
          } else {
            res.status(401).json({
              message: 'Data not found',
              name: 'NoDataError'
            });
            return next();
          }
        })
        .catch((err) => {
          res.status(401).json({
            message: err.message,
            name: err.name
          });
          return next();
        });
      } else {
        res.status(401).json({
          message: 'Incorrect Id format',
          name: 'IncorrectFormatError'
        });
        return next();
      }
	}

  private async getUserByEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email } = req.params;
    const e = new String(email);
    if (e instanceof String) {
      await UserS.findOne({email: e})
        .then((user) => {
          if (user) {
            res.status(201).json(user);
            return next();
          } else {
            res.status(401).json({
              message: 'Data not found',
              name: 'NoDataError'
            });
            return next();
          }
        })
        .catch((err) => {
          res.status(401).json({
            message: err.message,
            name: err.name
          });
          return next();
        });
      } else {
        res.status(401).json({
          message: 'Incorrect email format',
          name: 'IncorrectFormatError'
        });
        return next();
      }
	}

	private async postUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    let isValidUser: boolean = false;
    const {
			firstName,
			lastName,
			email,
      password } = req.body;

		const user = new UserS({
			firstName: firstName,
			lastName: lastName,
			email: email,
			password: password
    });
		await user.validate((err) => {
			if (err) {
        res.status(401).json({
          message: err.message,
          name: err.name
        });
        return next();
			} else {
        isValidUser = true;
      }
    });
    if (isValidUser) {
      await user.save()
        .then((user) => {
          if (user) {
            const sessionId = randomBytes(32).then(bytes => bytes.toString('hex'));
            const _id = user.id;
            const user1: User = {_id: _id, email: email};
            sessionStorage.createSession(sessionId, user1);
            res.cookie("SESSIONID", sessionId, {httpOnly: true});
            res.status(201).json(user);
            return next();
          } else {
            res.status(401).json({
              message: 'Data not found',
              name: 'NoDataError'
            });
            return next();
          }
        })
        .catch((err) => {
          res.status(401).json({
            message: err.message,
            name: err.name
          });
          return next();
        });
    } else { // Not necessary
      res.status(401).json({
        message: 'Data invalid',
        name: 'InvalidDataError'
      });
      return next();
    }
	}

	private async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    if (Types.ObjectId.isValid(id)) {
      await UserS.findByIdAndDelete(id)
        .then((user) => {
          if (user) {
            //
            return next();
          } else {
            //
            return next();
          }
        })
        .catch((err) => {
          res.status(401).json({
            message: err.message,
            name: err.name
          });
          return next();
        });
    } else {
      res.status(401).json({
        message: 'Incorrect Id format',
        name: 'FormatIncorrectError'
      });
      return next();
    }
	}

	private async putUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    if (Types.ObjectId.isValid(id)) {
      await UserS.findOneAndUpdate({_id: id}, {$set: ''}, {new: true})
        .then((user) => {
          if (user) {
            //
            return next();
          } else {
            //
            return next();
          }
        })
        .catch((err) => {
          res.status(401).json({
            message: err.message,
            name: err.name
          });
          return next();
        });
    } else {
      res.status(401).json({
        message: 'Incorrect Id format',
        name: 'FormatIncorrectError'
      });
      return next();
    }
	}

  private login(req: Request, res: Response) {
    const sessionId = req.cookies['SESSIONID'];
    res.clearCookie('SESSIONID');
    res.sendStatus(200);
  }

  private logout(req: Request, res: Response) {
    const sessionId = req.cookies['SESSIONID'];
    sessionStorage.destroySession(sessionId);
    res.clearCookie('SESSIONID');
    res.sendStatus(200);
  }

	private routes() {
    this._router.route('/api/user')
			.get(this.getUsers)
      .post(this.postUser);
    this._router.route('/api/user/session')
      .get(this.getUserBySession);
		this._router.route('/api/user/:id')
      .get(this.getUserById)
			.delete(this.deleteUser)
      .put(this.putUser);
    this._router.route('/api/user/getby/:email')
      .get(this.getUserByEmail);
    this._router.route('/api/user/login')
      .post(this.login);
    this._router.route('/api/user/logout')
      .post(this.logout);
	}

	get router(): Router {
		return this._router;
	}

}

export default new UserRoutes();
