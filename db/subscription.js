const uuid = require('uuidv4').default;

const { Subscription } = require('.');

const SubscriptionQuery = {
  findByEmail: email => Subscription.findOne({ email }),

  getLast: () => Subscription.find({}, {
    sort: { createdAt: -1 },
    limit: 1,
  }).then((subscritions) => {
    if (!subscritions.length) {
      return null;
    }

    return subscritions[0];
  }),

  create: email => Subscription.insert({
    email,
    createdAt: new Date(),
    pass: uuid(),
  }),

  delete: ({ email, pass }) => Subscription.remove({ email, pass }),
};

module.exports = SubscriptionQuery;
