import { Knex } from 'knex';

const TABLE_NAME = 'assigned_projects';

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
          project_id: 1,
          assigned_to: 2,
          updated_by:1
        },
        {
          project_id: 2,
          assigned_to: 3,
          updated_by:2
        },
        {
          project_id: 3,
          assigned_to: 1,
          updated_by:3
        },
        {
          project_id: 4,
          assigned_to: 5,
          updated_by:4
        },
        {
          project_id: 5,
          assigned_to: 2,
          updated_by:5
        },
        {
          project_id: 6,
          assigned_to: 4,
          updated_by:6
        },
        {
          project_id: 7,
          assigned_to: 2,
          updated_by:1
        },
        {
          project_id: 8,
          assigned_to: 6,
          updated_by:2
        },
        {
          project_id: 9,
          assigned_to: 2,
          updated_by:3
        },
        {
          project_id: 10,
          assigned_to: 5,
          updated_by:4
        },
        {
          project_id: 1,
          assigned_to: 4,
          updated_by:1
        },
        {
          project_id: 2,
          assigned_to: 3,
          updated_by:2
        }
      ]);
    });
}