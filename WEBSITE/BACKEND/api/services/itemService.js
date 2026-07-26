const itemRepository  = require("../repositories/itemRepository");

class itemService
{
    async getAllItem(search)
    {
        return await itemRepository.getAllItem(search);
    }

    async getItem(id)
    {
        return await itemRepository.getItem(id);
    }
}

module.exports = new itemService();