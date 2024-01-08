import { Knex } from 'knex';

const TABLE_NAME = 'assigned_projects';


/**
 * Create table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.bigIncrements();
    table
    .bigInteger('project_id')
    .unsigned()
    .notNullable()
    .references('id')
    .inTable('projects');

    table
    .bigInteger('assigned_to')
    .unsigned()
    .notNullable()
    .references('id')
    .inTable('users');

    table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
      
    table.timestamp('updated_at').nullable();
    
    table
      .bigInteger('updated_by')
      .unsigned()
      .references('id')
      .inTable('users')
      .nullable();
  });
}

/**
 * Drop table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE_NAME);
}