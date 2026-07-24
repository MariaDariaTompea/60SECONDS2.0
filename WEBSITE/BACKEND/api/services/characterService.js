const characterRepository  = require("../repositories/characterRepository");

class characterService
{
    async getAllCharacter(search)
    {
        return await characterRepository.getAllCharacter(search);
    }

    async getCharacter(id)
    {
        return await characterRepository.getCharacter(id);
    }

    async getNames()
    {
        return await characterRepository.getNames();
    }
}

module.exports = new characterService();