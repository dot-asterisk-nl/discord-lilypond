import versionJSON from "../package.json" assert { type: 'json' }
import {templates} from "./templates/lily-templates.js";
import {commandIndex} from "../command-index.js";
export const getInfo = async (interaction) => {
    const info =
        `This bot is running [discord-lilypond](<https://github.com/dot-asterisk-nl/discord-lilypond>) version ${versionJSON.version}! 😎\n\n`
    +   `For more information on how to use LilyPond please visit the [website](<https://lilypond.org>).\n\n`
    +   `Commands:\n${commandIndex.map(c => `\`/${c.name}\` - ${c.description}`).join("\n")}`;
    await interaction.reply({content: info, ephemeral: true});
}

export const getTemplates = async (interaction) => {
    let reply = "📜 ***Templates***:\n";

    reply += Object.keys(templates)
        .map(key => {
            const template = templates[key];
            return "-----\n"
            + "**Template Name**: " + key + "\n"
            + "**Template**:\n" + template(`%**{📜 CODE GOES HERE}**`)
            + "-----\n"
        }).reduce((p,n) => p + n, "");

    await interaction.reply({content: reply, ephemeral: true});
}