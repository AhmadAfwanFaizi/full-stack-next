exports.up = function (knex) {
  return knex.schema.createTable("posts", (table) => {
    table.increments();
    table.string("title");
    table.text("content");
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("posts");
};
