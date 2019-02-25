import * as mongoose from 'mongoose';
import * as moment from 'moment';
import { GetTransactionOptions, IUser, GetTransactionSelector } from 'types';
import Category from '../resources/category/category.model';

export const makeID = () => mongoose.Types.ObjectId();

export const getSelector = async (
  user: IUser,
  options: GetTransactionOptions
) => {
  const { vendor, category, moreThan, lessThan, after, before } = options;
  let result: GetTransactionSelector = {};

  if (vendor) result.vendor = vendor;

  if (category) {
    const ctg = await Category.findOne({ name: category, createdBy: user._id });
    if (ctg) result.category = ctg._id;
  }

  if (moreThan || lessThan) {
    result.amount = {};
    if (moreThan) result.amount.$gte = moreThan;
    if (lessThan) result.amount.$lte = lessThan;
  }

  if (after || before) {
    result.date = {};
    if (after) result.date.$gte = moment(after).toDate();
    if (before) result.date.$lte = moment(before).toDate();
  }

  return result;
};
