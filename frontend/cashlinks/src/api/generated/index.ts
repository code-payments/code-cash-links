export * from './account/v1';
export * as Common from './common/v1';
export * as Contact from './contact/v1';
export * from './currency/v1';
export * from './invite/v2';
export * from './messaging/v1';
export * from './phone/v1';
export * from './push/v1';
export * from './support/v1';
export * from './transaction/v2';
export * from './user/v1';

import { Account } from './account/v1';
import { ContactList } from './contact/v1';
import { Currency } from './currency/v1';
import { Invite } from './invite/v2';
import { Messaging } from './messaging/v1';
import { PhoneVerification } from './phone/v1';
import { Push } from './push/v1';
import { Support } from './support/v1';
import { Transaction } from './transaction/v2';
import { Identity } from './user/v1';
import { MicroPayment } from './micropayment/v1';

const Services = {
    Account,
    ContactList,
    Currency,
    Invite,
    Messaging,
    PhoneVerification,
    Push,
    Support,
    Transaction,
    Identity,
    MicroPayment,
}

export {
   Services 
}