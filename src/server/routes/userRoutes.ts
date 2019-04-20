import { NextFunction, Request, Response, Router } from 'express';
import User from '../models/user';


class UserRoutes {

	private _router: Router = Router();

	constructor() {
		this.routes();
	}

	private async getUsers(req: Request, res: Response, next: NextFunction) {
		const users = await User.find({}, (err, users) => {
			if (err) {
				res.status(401).json(err);
			} else {
				res.status(201).json(users);
			}
		});
		next();
	}

	private async getUser(req: Request, res: Response, next: NextFunction) {
		const { id } = req.params;
		await User.findById(id, (err, user) => {
			if (err) {
				res.status(401).json(err);
			} else {
				res.status(201).json(user);
			}
		});
		next();
	}

	private async putUser(req: Request, res: Response, next: NextFunction) {
		const {
			firstName,
			lastName,
			email,
			password,
			cellphone,
			isSuscribedToNewspapper } = req.params;
		const user = new User({
			firstName: firstName,
			lastName: lastName,
			email: email,
			password: password,
			cellphone: cellphone,
			isSuscribedToNewspapper: isSuscribedToNewspapper
		});
		await user.validate((err) => {
			if (err) {
				res.status(401).json(err);
			}
		});
		await user.save((err, user) => {
			if (err) {
				res.status(401).json(err);
			} else {
				res.status(201).json(user);
			}
		});
		next();
	}

	private deleteUser(req: Request, res: Response, next: NextFunction) {
		next();
	}

	private postUser(req: Request, res: Response, next: NextFunction) {
		next();
	}

	private routes() {
    this._router.route('/api/user')
			.get(this.getUsers)
			.put(this.putUser);
		this._router.route('/api/user/:id')
			.get(this.getUser)
			.delete(this.deleteUser)
			.post(this.postUser);
	}

	get router(): Router {
		return this._router;
	}

}

export default new UserRoutes();
