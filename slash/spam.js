const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("spam")
        .setDescription("Helps you spam")
        .addStringOption((option) =>
            option.setName("song").setDescription("Put your song here").setRequired(true))
        .addStringOption((option) =>
            option.setName("times").setDescription("How many times song will it play").setRequired(true)),
    run: async ({ client, interaction }) => {
        if (!interaction.member.voice.channel) return interaction.editReply("You need to be in a VC to use this command")

        const queue = await client.player.createQueue(interaction.guild)
        if (!queue.connection) await queue.connect(interaction.member.voice.channel)

        let url = interaction.options.getString("song")
        let times = interaction.options.getString("times")

        if (times > 100)
            return interaction.editReply("To many songs! Only 100 available!")

        let embed = new MessageEmbed()

        const result1 = await client.player.search(url, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO
        })

        if (result1.tracks.length === 0)
            return interaction.editReply("No results")

        const song1 = result1.tracks[0]
        await queue.addTrack(song1)
        embed
            .setDescription(`**[${song1.title}](${song1.url})** has been added to the Queue `+times+' times')
            .setThumbnail(song1.thumbnail)
            .setFooter({ text: `Duration: ${song1.duration}` })
        if (!queue.playing) await queue.play()
        await interaction.editReply({
            embeds: [embed]
        })

        const result = await client.player.search(url, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO
        })

        if (result.tracks.length === 0)
            return interaction.editReply("No results")

        const song = result.tracks[0]
        const func = () => queue.addTrack(song);

        Array.from({ length: times - 1 }, () => func());
    }
}