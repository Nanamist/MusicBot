const { SlashCommandBuilder } = require("@discordjs/builders")
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("testdb")
        .setDescription("Test of database for ben"),
     run: async ({ client, interaction }) => {
         let accessData = JSON.parse(fs.readFileSync('https://dataforben.herokuapp.com/', 'utf8'));
         await interaction.editReply(accessData.length)
    }
}
