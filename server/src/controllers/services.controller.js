const servicesService = require('../services/services.service');

async function getAll(req, res, next) {
  try {
    const services = await servicesService.getAllServices();
    res.json(services);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const service = await servicesService.getServiceById(req.params.id);
    res.json(service);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const service = await servicesService.createService(req.body);
    res.status(201).json(service);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const service = await servicesService.updateService(req.params.id, req.body);
    res.json(service);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await servicesService.deleteService(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create, update, remove };
