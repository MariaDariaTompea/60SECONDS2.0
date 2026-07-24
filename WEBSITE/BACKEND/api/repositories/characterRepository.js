const db = require("../database/dbContext");
const { Op } = require('sequelize')

class characterRepository
{
    constructor(db)
    {
        this.characterItem = db.characterItem;
    }

    async getAllCharacter(search) {
        const options = { where: { type: 'character' } }

        if (search) {
        options.where.name = { [Op.like]: `%${search}%` }
        }

        const characters = await db.characterItem.findAll(options)

        characters.forEach(character => {
        if (character && character.photo && character.photoType) {
            const characterMimeType = character.photoType || 'image/jpeg'
            const base64Image = Buffer.from(character.photo).toString('base64')
            character.photo = `data:${characterMimeType};base64,${base64Image}`
        }
        })

        return characters
    }

    async getCharacter(id) {
        const character = await db.characterItem.findOne({
        where: { id: id, type: 'character' }
        })

        if (!character) {
        return null
        }

        const result = character.toJSON()

        if (result.photo && result.photoType) {
        const base64Image = Buffer.from(result.photo).toString('base64')
        result.photo = `data:${result.photoType};base64,${base64Image}`
        }

        if (typeof result.data === 'string') {
        result.data = JSON.parse(result.data)
        }

        return result
    }

    async getNames() {
        const entries = await db.characterItem.findAll({
        attributes: ['id', 'name', 'mention', 'type']
        })

        return entries.map(e => ({
        id: e.id,
        name: e.name,
        mention: e.mention,
        type: e.type,
        }))
    }
}

module.exports = new characterRepository(db);