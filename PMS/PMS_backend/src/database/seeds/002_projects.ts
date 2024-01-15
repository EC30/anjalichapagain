import { Knex } from 'knex';

const TABLE_NAME = 'projects';

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
          name: 'Clinic Management System',
          description: 'Description for Project 1',
          deadline: new Date('2024-01-28T23:59:59.999Z'),
          status: false,
          priority: 'High',
          image: 'src/uploads/default.jpg',
          created_at: new Date(),
          assigned_by: 1,
        },        
        {
          name: 'Hospital Management System',
          description: 'Description for Project 2',
          deadline: new Date('2024-01-21T23:59:59.999Z'),
          status: false,
          priority: 'Medium',
          image: 'src/uploads/default.jpg',
          created_at: new Date(),
          assigned_by: 2,
        },
        {
          name: ' Frontend Project',
          description: 'Description for Project 3',
          deadline: new Date('2024-12-31T23:59:59.999Z'),
          status: false,
          priority: 'Low',
          image: 'src/uploads/default.jpg',
          created_at: new Date(),
          assigned_by: 3,
        },
        {
          name: ' Backend Project',
          description: 'Description for Project 4',
          deadline: new Date('2024-02-02T23:59:59.999Z'),
          status: false,
          priority: 'High',
          image: 'src/uploads/default.jpg',
          created_at: new Date(),
          assigned_by: 4,
        },
        {
          name: 'Game Using Javascript',
          description: 'Description for Project 5',
          deadline: new Date('2024-02-10T23:59:59.999Z'),
          status: false,
          priority: 'Medium',
          image: 'src/uploads/default.jpg',
          created_at: new Date(),
          assigned_by: 5,
        },
        {
          name: 'Task Management System',
          description: 'Description for Project 6',
          deadline: new Date('2024-03-01T23:59:59.999Z'),
          status: false,
          priority: 'High',
          image: 'src/uploads/default.jpg',
          created_at: new Date(),
          assigned_by: 6,
        },
        {
          name: 'Leapfrog technology',
          description: 'Description for Project 7',
          deadline: new Date('2024-04-28T23:59:59.999Z'),
          status: false,
          priority: 'Low',
          image: 'src/uploads/default.jpg',
          created_at: new Date(),
          assigned_by: 1,
        },
        {
          name: 'HTML and CSS project',
          description: 'Description for Project 8',
          deadline: new Date('2024-12-31T23:59:59.999Z'),
          status: false,
          priority: 'Medium',
          image: 'src/uploads/default.jpg',
          created_at: new Date(),
          assigned_by: 2,
        },
        {
          name: 'Nursing Project',
          description: 'Description for Project 9',
          deadline: new Date('2024-01-17T23:59:59.999Z'),
          status: false,
          priority: 'High',
          image: 'src/uploads/default.jpg',
          created_at: new Date(),
          assigned_by: 3,
        },
        {
          name: 'Airline Project',
          description: 'Description for Project 10',
          deadline: new Date('2024-05-19T23:59:59.999Z'),
          status: false,
          priority: 'Low',
          image: 'src/uploads/default.jpg',
          created_at: new Date(),
          assigned_by: 4,
        }

      ]);
    });
}