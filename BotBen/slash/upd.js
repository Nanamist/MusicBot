const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const fs = require("fs");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("del")
        .setDescription("Add song for a playlist")
        .addStringOption((option) =>
            option.setName("place").setDescription("Place of song in playlst").setRequired(true)),
 run: async ({ client, interaction }) => {
     let place1 = interaction.options.getString("place")
     let place = place1 - 1
     let object = JSON.parse(fs.readFileSync('playlist.json', 'utf8'));

     if (place < 0) {
         await interaction.editReply(place + "is undefined")
     } else if(object.length < 11) {
         await interaction.editReply("The minimum of songs has been reached")
     } else {
         object.splice(place, 1)
         fs.writeFile('playlist.json', JSON.stringify(object, null, 2), (err) => {
             if (err) console.error(err)
         });
         await interaction.editReply("Song succefuly deleted")
     }
    }
}