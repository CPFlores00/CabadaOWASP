import { NextFunction, Request, Response, Router } from 'express';
import { Types } from 'mongoose';
import User from '../models/user';


class UserRoutes {

	private _router: Router = Router();

	constructor() {
		this.routes();
	}

	private async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    await User.find({})
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

	private async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    if (Types.ObjectId.isValid(id)) {
      await User.findById(id)
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
      await User.findOne({email: e})
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
		const user = new User({
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
      await User.findByIdAndDelete(id)
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
      await User.findOneAndUpdate({_id: id}, {$set: ''}, {new: true})
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

	private routes() {
    this._router.route('/api/user')
			.get(this.getUsers)
			.post(this.postUser);
		this._router.route('/api/user/:id')
      .get(this.getUserById)
			.delete(this.deleteUser)
      .put(this.putUser);
    this._router.route('/api/user/getby/:email')
      .get(this.getUserByEmail);
	}

	get router(): Router {
		return this._router;
	}

}

export default new UserRoutes();
