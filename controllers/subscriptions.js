const Subscription = require('../db/subscription');

const subscriptionTimeout = process.env.SUBSCRIPTION_TIMEOUT;

const subscribe = async ({ email }) => {
  const existingSubscription  = await Subscription.findByEmail(email);
  if (existingSubscription) {
    return { error: 'Этот почтовый ящик уже подписан на обновления!' };
  }

  const lastSubscription = await Subscription.getLast();
  const timeDiff = lastSubscription
    ? Math.floor((Date.now() - lastSubscription.createdAt.getTime()) / 1000)
    : subscriptionTimeout;
  if (timeDiff < subscriptionTimeout) {
    return { error: 'Сработала защита от автоматической регистрации подписки. Через минутку должно заработать :)' };
  }

  const subscriptionInfo = await Subscription.create(email);
  return { subscription: subscriptionInfo };
};

module.exports = {
  subscribe,
};
