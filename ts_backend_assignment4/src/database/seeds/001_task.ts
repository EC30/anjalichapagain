import { Knex } from 'knex';

const TABLE_NAME = 'tasks';

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
          task: "Hello",
          completed: true,
          created_by: 4
        },
        {
          task: "World",
          completed: false,
          created_by: 4
        }
      ]);
    });
}