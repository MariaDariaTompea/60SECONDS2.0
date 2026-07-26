const db = require("../database/dbContext");

class itemRepository
{
    constructor(db)
    {
        this.characterItem = db.characterItem;
    }

    async getAllItem(search) {
        const { Op } = require('sequelize')
        const options = { where: { type: 'item' } }

        if (search) {
            options.where.name = { [Op.like]: `%${search}%` }
        }

        const items = await db.characterItem.findAll(options)

        items.forEach(item => {
            if (item && item.photo && item.photoType) {
            const itemMimeType = item.photoType || 'image/jpeg'
            const base64Image = Buffer.from(item.photo).toString('base64')
            item.photo = `data:${itemMimeType};base64,${base64Image}`
            }
        })

        return items
    }

    async getItem(id) {
        const item = await db.characterItem.findOne({
            where: { id: id, type: 'item' }
        })

        if (!item) {
            return null
        }

        const result = item.toJSON()

        if (result.photo && result.photoType) {
            const base64Image = Buffer.from(result.photo).toString('base64')
            result.photo = `data:${result.photoType};base64,${base64Image}`
        }

        if (typeof result.data === 'string') {
            result.data = JSON.parse(result.data)
        }

        return result
    }
}

module.exports = new itemRepository(db);