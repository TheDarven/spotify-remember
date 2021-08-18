const { FunctionalException } = require('../../exception/custom-exceptions')
const { Context } = require('../models/index')

const ERROR_GET_CONTEXT = 'Erreur lors de la récupération du context.';
const ERROR_CREATE_CONTEXT = 'Erreur lors de la création du context.';

async function getContext() {
    try {
        return await Context.findOne({ where: { id: 1 } });
    } catch (e) {
        throw new FunctionalException(ERROR_GET_CONTEXT, 500)
    }
}

async function isContextExisting() {
    return await getContext() !== null;
}

async function updateLastFetch(date) {
    if (await isContextExisting()) {
        return await Context.update({ last_fetch: date }, { where: { id: 1 }});
    } else {
        return await Context.create({ last_fetch: date })
    }
}

async function createContext() {
    try {
        return await Context.create({ last_fetch: new Date() });
    } catch (e) {
        throw new FunctionalException(`${ERROR_CREATE_CONTEXT}`, 500)
    }
}

async function createContextIfNotExist() {
    if (await isContextExisting()) {
        return await getContext();
    }
    return await createContext();
}

module.exports = { getContext, updateLastFetch, createContext, createContextIfNotExist }