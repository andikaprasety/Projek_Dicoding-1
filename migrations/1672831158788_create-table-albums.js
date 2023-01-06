/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('albums',{
        id:{
            type: 'VARCHAR(50)',
            primarkey: true,
        },
        name:{
            type:'Text',
            notNull: true,
        },
        year: {
            type: 'Number',
            notNull: true,
        },
        created_at: {
            type: 'TEXT',
            notNull: true,
        },
        updated_at: {
            type: 'TEXT',
            notNull: true,
        },
    })
};

exports.down = pgm => {
    pgm.dropTable('albums')
};
