const clientsService = require('../services/clients.service');

async function getAll(req, res, next) {
  try {
    const clients = await clientsService.getAllClients();
    res.json(clients);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const client = await clientsService.getClientById(req.params.id);
    res.json(client);
  } catch (err) {
    next(err);
  }
}

async function getNotes(req, res, next) {
  try {
    const notes = await clientsService.getClientNotes(req.params.id);
    res.json(notes);
  } catch (err) {
    next(err);
  }
}

async function addNote(req, res, next) {
  try {
    const note = await clientsService.addClientNote(req.params.id, req.user.id, req.body.content);
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
}

async function deleteNote(req, res, next) {
  try {
    await clientsService.deleteClientNote(req.params.noteId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, getNotes, addNote, deleteNote };
