exports.up = knex => knex.schema.createTable("tags", table => {
  table.increments("id");
  table.text("name").notNullable();
  table.integer("user_id").references("id").inTable("users");
  table.integer("note_id").references("id").inTable("movieNotes").onDelete("CASCADE"); //se a nota for deletadas as tags vinculadas a ela também serão
  
});

exports.down = knex => knex.schema.dropTable("tags");