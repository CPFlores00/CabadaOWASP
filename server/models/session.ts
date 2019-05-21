import { Moment } from 'moment';
import moment = require('moment');
import { User } from 'src/app/model/user';

export class Session {

    static readonly VALIDITY_MINUTES = 2;
    private validuntil: Moment;

    constructor(
        public sessionId: string,
        public user: User
    ) {
        this.validuntil = moment().add(Session.VALIDITY_MINUTES, 'minutes');
    }

    isValid() {
        return moment().diff(this.validuntil, 'minutes') <= 0;
    }

}