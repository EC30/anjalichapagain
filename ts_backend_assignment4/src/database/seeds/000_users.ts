import { Knex } from 'knex';
import UserModel from '../../models/user';

const TABLE_NAME = 'users';

/**
 * Delete existing entries and seed values for table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export function seed(knex: Knex): Promise<void> {
  return knex(TABLE_NAME)
    .del()
    .then(() => {
      return knex(TABLE_NAME).insert([
        {
          username: 'user1',
          password: '$2b$10$Qu77JL1eQ6ukpzYwfqM6kelneCL3L.z432m4DyJxE5Sr6nPukYZge',
          refresh_token: '49e91f12-ce02-4fbd-9780-fc2a62f739e0',
        },
        {
          username: 'user2',
          password: '$2b$10$Qu77JL1eQ6ukpzYwfqM6kelneCL3L.z432m4DyJxE5Sr6nPukYZge',
          refresh_token: '49e91f12-ce02-4fbd-9780-fc2a62f739e0',
        }
      ]);
    });
}