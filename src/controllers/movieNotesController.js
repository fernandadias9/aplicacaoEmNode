const knex = require("../database/knex");
const AppError = require('../utils/appError');

class MovieNotesController {
  async create(request, response) {
    const { title, description, rating, tags } = request.body;
    const { user_id } = request.params;

    try {
      // Verificar se o rating está dentro do intervalo válido (1 a 5)
      if (rating < 1 || rating > 5) {
          throw new AppError('O rating deve ser entre 1 e 5', 400); // Lança um erro se estiver fora do intervalo
      }

      const [note_id] = await knex("movieNotes").insert({
          title, 
          description,
          rating,
          user_id
      });

      response.status(201).json({ note_id });

      const tagsInsert = tags.map(name => {
        return {
          note_id,
          name, 
          user_id
        }
      });
  
      await knex("tags").insert(tagsInsert);
  
      response.json();
  } catch (error) {
      // Se ocorrer algum erro durante a execução da função, ele será capturado aqui
      if (error instanceof AppError) {
          response.status(error.statusCode).json({ error: error.message });
      } else {
          // Se for um erro desconhecido, envie uma resposta genérica de erro
          response.status(500).json({ error: 'Ocorreu um erro durante a criação da nota' });
      }
  }    
  }

  async show(request, response) {
    const { id } = request.params;

    const note = await knex("movieNotes").where({ id }).first();
    const tags = await knex("tags").where({ note_id: id }).orderBy("name");

    return response.json({
      ...note,
      tags,
      links
    });
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("movieNotes").where({ id }).delete();

    return response.json();
  }

  async list(request, response) {
    const { title, user_id, tags } = request.query;
    let notes;

    if (tags) {
      const filterTags = tags.split(',').map(tag => tag.trim());
      
      notes  = await knex("tags")
      .select([
        "notes.id",
        "notes.title",
        "notes.user_id"
      ])
      .where("notes.user_id", user_id)
      .whereLike("notes.title", `%${title}%`)
      .whereIn("name", filterTags)
      .innerJoin("notes", "notes.id", "tags.note_id")
      .orderBy("notes.title");
    } else {
      notes  = await knex("movieNotes")
      .where({ user_id })
      .whereLike("title", `%${title}%`)
      .orderBy("title");
    }

    const userTags = await knex("tags").where({ user_id });

    /* pega o array notes e transforma em outro array (notesWithTags através do map()) cuja cada nota será percorrida e filtrada a tag (cujo id do usuário corresponda ao user_id (userTags)) da mesma através do filter(), passando como filtro que o note_id da tag seja igual ao id da note e com isso construindo um novo array(noteTags)  */
    const notesWithTags = notes.map(note => { 
      const noteTags = userTags.filter(tag => tag.note_id === note.id);

      return {
        ...note,
        tags: noteTags
      }
    })

    return response.json(notesWithTags);
  }
}

module.exports = MovieNotesController;