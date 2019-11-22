import React from 'react';
import Dinero, { Currency } from 'dinero.js';

const formatPrice = (amount: number, currency: Currency = 'CNY') => Dinero({ amount, currency });

export const priceUtil = {
  formatPrice,
};
