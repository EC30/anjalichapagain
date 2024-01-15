import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';
const TABLE_NAME = 'users';

export function seed(knex: Knex): Promise<void> {
  return knex(TABLE_NAME)
    .del()
    .then(() => {
      return knex(TABLE_NAME).insert([
        {
          username: 'first123',
          fullname: 'Anjali Chapagain',
          email: 'first123@gmail.com',
          password: '$2b$10$ZfzQcehVZaHABgM9V2IwD.2k2KoeS34n6xs4od5y/QLo6Ccym3p..',
          refresh_token: uuidv4()
        },
        {
          username: 'user456',
          fullname: 'John Doe',
          email: 'john.doe@example.com',
          password: '$2b$10$ZfzQcehVZaHABgM9V2IwD.2k2KoeS34n6xs4od5y/QLo6Ccym3p..',
          refresh_token: uuidv4()
        },
        {
          username: 'awesomeUser',
          fullname: 'Jane Smith',
          email: 'jane.smith@example.com',
          password: '$2b$10$ZfzQcehVZaHABgM9V2IwD.2k2KoeS34n6xs4od5y/QLo6Ccym3p..',
          refresh_token: uuidv4()
        },
        {
          username: 'devGuy87',
          fullname: 'Alex Developer',
          email: 'alex.dev@example.com',
          password: '$2b$10$ZfzQcehVZaHABgM9V2IwD.2k2KoeS34n6xs4od5y/QLo6Ccym3p..',
          refresh_token: uuidv4()
        },
        {
          username: 'projectManager',
          fullname: 'Emma Manager',
          email: 'emma.manager@example.com',
          password: '$2b$10$ZfzQcehVZaHABgM9V2IwD.2k2KoeS34n6xs4od5y/QLo6Ccym3p..',
          refresh_token: uuidv4()
        },
        {
          username: 'testUser',
          fullname: 'Test Tester',
          email: 'test.tester@example.com',
          password: '$2b$10$ZfzQcehVZaHABgM9V2IwD.2k2KoeS34n6xs4od5y/QLo6Ccym3p..',
          refresh_token: uuidv4()
        }
      ]);
    });
}
