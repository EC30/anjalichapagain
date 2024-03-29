import { Knex } from 'knex';

const TABLE_NAME = 'projects';


/**
 * Create table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.bigIncrements();
    table.string('name').notNullable().unique();
    table.string('description').notNullable();
    table.dateTime('deadline').notNullable();
    table.boolean('status').notNullable().defaultTo('false');
    table.enum('priority', ['High', 'Medium', 'Low']).defaultTo('High');
    table.string('image').nullable();

    table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
    
    table
      .bigInteger('assigned_by')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');;
      
    table.timestamp('updated_at').nullable();
    
    table
      .bigInteger('updated_by')
      .unsigned()
      .references('id')
      .inTable('users')
      .nullable()
      .onDelete('CASCADE');;
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