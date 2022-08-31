const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const fs = require("fs");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("change")
        .setDescription("Change songs in playlist")
        .addStringOption((option) =>
            option.setName("place1").setDescription("First song").setRequired(true))
        .addStringOption((option) =>
            option.setName("place2").setDescription("Second song").setRequired(true)),
    run: async ({ client, interaction }) => {
        let place1 = interaction.options.getString("place1")
        let place2 = interaction.options.getString("place2")
        let Fplace = place1 - 1
        let Splace = place2 - 1
        let object = JSON.parse(fs.readFileSync('playlist.json', 'utf8'));

        if (Fplace || Splace < 0) {
            await interaction.editReply("Undefined")
        } else if (Fplace || Splace > object.length - 1) {
            await interaction.editReply("Undefined")
        } else {
            [object[Fplace], object[Splace]] = [object[Splace], object[Fplace]];
            fs.writeFile('playlist.json', JSON.stringify(object, null, 2), (err) => {
                if (err) console.error(err)
            });
            await interaction.editReply("Playlist succefuly updated")
        }
}
}