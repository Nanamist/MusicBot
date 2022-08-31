const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const fs = require("fs");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("add")
        .setDescription("Add song for a playlist")
        .addStringOption((option) =>
            option.setName("place").setDescription("Place of song in playlst").setRequired(true))
        .addStringOption((option) => 
            option.setName("url").setDescription("Set here url of song").setRequired(true))
        .addStringOption((option) => 
            option.setName("lable").setDescription("Set here lable of song").setRequired(true))
        .addStringOption((option) => 
            option.setName("description").setDescription("Set here descrption of song").setRequired(true)),

    run: async ({ client, interaction }) => {
        let place1 = interaction.options.getString("place")
        let place = place1-1
        let url = interaction.options.getString("url")
        let lable = interaction.options.getString("lable")
        let description = interaction.options.getString("description")
        let object = JSON.parse(fs.readFileSync('playlist.json', 'utf8'));

        if (place < 0) {
            await interaction.editReply(place + "is undefined")
        } else if (place > object.length) {
            object.push({
                "url": url,
                "lable": lable,
                "description": description,
            })
            fs.writeFile('playlist.json', JSON.stringify(object, null, 2), (err) => {
                if (err) console.error(err)
            });
            await interaction.editReply("New slot added & playlist succefuly updated")
        }else {
            object[place].url = url;
            object[place].lable = lable;
            object[place].description = description;

            fs.writeFile('playlist.json', JSON.stringify(object, null, 2), (err) => {
                if (err) console.error(err)
            });
            await interaction.editReply("Playlist succefuly updated")
        }
    },
}