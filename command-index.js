import {SlashCommandBuilder} from "discord.js";
import {renderLilyFile, renderLilyFull, renderLilySimple} from "./commands/lily.js";
import {getInfo, getTemplates} from "./commands/info.js";

const createCommand = (name, description, commandBuilderFunction, command) => {
    return {
        name,
        description,
        slashCommand: commandBuilderFunction(new SlashCommandBuilder().setName(name).setDescription(description)),
        command
    }
}
const EmptyCommandBuilderFunction = (cb) => cb;

export const commandIndex = [
    createCommand(
        'lily-simple',
        "Returns lilypond image & music from a simple LilyPond string, e.g. `c8 b c1`",
        (cb) => cb
            .addStringOption(option =>
               option
                .setName("code")
                .setDescription("The code given")
                .setRequired(true)
            ),
        renderLilySimple
    ),
    createCommand(
        'lily-full',
        "Returns lilypond image & music from more elaborate LilyPond functions like `\\score`",
        EmptyCommandBuilderFunction,
        renderLilyFull
    ),
    createCommand(
        'lily-file',
        "Returns lilypond image & music from a .ly file",
        (cb) => cb
            .addAttachmentOption(option =>
                option
                    .setName("file")
                    .setDescription("The .ly file")
                    .setRequired(true)
                ),
        renderLilyFile
    ),
    createCommand(
        'help',
        "Gets bot info and other help.",
        EmptyCommandBuilderFunction,
        getInfo
    ),
    createCommand(
        'templates',
        "Gets template information.",
        EmptyCommandBuilderFunction,
        getTemplates
    )
];