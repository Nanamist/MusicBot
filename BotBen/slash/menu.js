const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageActionRow, MessageButton, MessageSelectMenu, Message } = require('discord.js');
const { MessageEmbed } = require("discord.js")
const { QueryType } = require("discord-player")
const fs = require("fs");





module.exports = {
    data: new SlashCommandBuilder()
        .setName("menu")
        .setDescription("Help to chouse playlst"),
    run: async ({ client, interaction }) => {
        if (!interaction.member.voice.channel) return interaction.editReply("You need to be in a VC to use this command")
        const queue = await client.player.createQueue(interaction.guild)
        if (!queue.connection) await queue.connect(interaction.member.voice.channel)
        let embed = new MessageEmbed()

        let number = JSON.parse(fs.readFileSync('count.json', 'utf8'));
        var count = number[0].bebra
        number[0].bebra = count+1;
        fs.writeFile('count.json', JSON.stringify(number, null, 2), (err) => {
            if (err) console.error(err)
        });
        //const queue = client.player.getQueue(interaction.guildId)
        //if (!queue) return await interaction.editReply("I can just add songs yet!")

        let object = JSON.parse(fs.readFileSync('playlist.json', 'utf8'));
        
        options = []

        for (let i = 0; i < object.length; i++) {
            options.push({
                label: `${i+1}`+"."+`${object[i].lable}`,
                description: `${object[i].description}`,
                value: `${i}`
            });
        }

        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('songs'+count)
                    .setPlaceholder('Choose a song')
                    .addOptions(options)
        );
        const knopka = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('primary')
                    .setLabel('Skip>>>')
                    .setStyle('PRIMARY'),
        );
                
        interaction.editReply({ content: 'It is menu!' + count, components: [row, knopka] });
        client.on('interactionCreate', async interaction => {

            if (!interaction.isSelectMenu()) return;
            
            if (interaction.customId === 'songs' + count) {
                //if (!queue.connection) await queue.connect(interaction.member.voice.channel);
                const place = interaction.values;
                const url = object[place].url
                const result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_VIDEO
                })
                if (result.tracks.length === 0)
                    return interaction.editReply("No results")

                const song = result.tracks[0]
                await queue.addTrack(song)
                client.channels.cache.get('992790330535587964').send(interaction.customId)
                embed
                    .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                    .setThumbnail(song.thumbnail)
                    .setFooter({ text: `Duration: ${song.duration}` })
                if (!queue.playing) await queue.play()
                await client.channels.cache.get('992790330535587964').send({
                    embeds: [embed]
                })
            };
            if (interaction.customId === 'primary') {
                const queue = client.player.getQueue(interaction.guildId)

                if (!queue) return await interaction.editReply("There are no songs in the queue")

                const currentSong = queue.current
                client.channels.cache.get('992790330535587964').send(interaction.customId)
                queue.skip()
                await client.channels.cache.get('992790330535587964').send({
                    embeds: [
                        new MessageEmbed().setDescription(`${currentSong.title} has been skipped!`).setThumbnail(currentSong.thumbnail)
                    ]
                })
            };
                
        }
        );
	},
}