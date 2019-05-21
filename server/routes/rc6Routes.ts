import { NextFunction, Request, Response, Router } from 'express';
import * as child_process from 'child_process';

class Rc6Routes {

	private _router: Router = Router();

	constructor() {
		this.routes();
	}

	private test() {
		const logOutput = (name) => (data) => console.log(`[${name}] ${data.toString()}`)

    function run() {
      const script = require('path').resolve(__dirname, './scripts/rc6.py')
      const process = child_process.spawn('py', [script]);

      process.stdout.on(
        'data',
        logOutput('stdout')
      );

      process.stderr.on(
        'data',
        logOutput('stderr')
      );
    }

    (() => {
      try {
        run()
        // process.exit(0)
      } catch (e) {
        console.error(e.stack);
        process.exit(1);
      }
    })();
	}

	private rc6Encrypt(key: any, msg: any) {
		return new Promise((resolve, reject) => {
			const script = require('path').resolve(__dirname, '../scripts/rc6.py');
			console.log(script);
			const process = child_process.spawn('py', [script, 'encrypt', key, msg]);

			const out = [];
			process.stdout.on(
				'data',
				(data) => {
					out.push(data.toString());
				}
			);

			const err = []
			process.stderr.on(
				'data',
				(data) => {
					err.push(data.toString());
				}
			);
		});
	}

	private async getEncrypt(req: Request, res: Response, next: NextFunction): Promise<void> {
		const { key, msg } = req.params;
		const script = require('path').resolve(__dirname, '../scripts/python/rc6.py');
		try {
			const process = child_process.spawn('py', [script, 'encrypt', key, msg]);

			process.stdout.on(
				'data',
				(data) => {
					res.status(201).json(data.toString());
				}
			);

			process.stderr.on(
				'data',
				(data) => {
					res.status(401).json({
						message: 'Incorrect key or msg format',
						name: 'FormatIncorrectError'
					});
				}
			);
		} catch (e) {
			res.status(401).json({
				message: e,
				name: ''
			});
		}
  }

  private async getDecrypt(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { key } = req.params;
		//
		res.status(201).json({});
	}

	private routes() {
		this._router.route('/api/rc6/encrypt/:key/:msg')
      .get(this.getEncrypt)
    this._router.route('/api/rc6/decrypt/:key')
      .get(this.getDecrypt)
	}

	get router(): Router {
		return this._router;
	}

}

export default new Rc6Routes();
