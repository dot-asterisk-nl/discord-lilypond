import {templates} from "../templates/lily-templates.js";
import {confirmButtons} from "../../buttons.js";
import {fetchLilyRenders} from "./fetch-lily.js";

const logLily = (user, code) => {
    const logMessage = `[${new Date().toISOString()}] User: ${user.username}(${user.id})\n`
        + "-----\n"
        + code + "\n"
        + "-----\n"
    console.log(logMessage)
}

const startLoadingMessageInterval = async (interaction) => {
    const baseMessage = "_Rendering_ 🎵 ";
    await interaction.reply(baseMessage)

    let dots = 0;
    return setInterval(() => {
        dots = (dots + 1) % 4
        interaction.editReply(baseMessage + ".".repeat(dots))
    }, 500);
}

const handleError = async (e, interaction) => {
    console.error(e)
    if(e.message === "RENDERING_ERROR"){
        await interaction.editReply({
            content:
                ":warning: Error! Your lilypond code is invalid, has an unsupported `\\version` or took longer than 5 seconds to generate.\n" +
                "You can use <https://hacklily.org> or install [Frescobaldi](<https://www.frescobaldi.org/download>) to check your code."
        })
    } else {
        await interaction.editReply({content: ":warning: **Internal Server Error**"})
    }
}

const processConfirmButtons = async (interaction, buttons) => {
    try{
        const collectorFilter = i => i.user.id === interaction.user.id;
        const confirmation = await buttons.awaitMessageComponent({ time: 60_000, filter: collectorFilter });
        if (confirmation.customId === 'confirm') {
            await confirmation.update({ content: ` `, components: [] });
        } else if (confirmation.customId === 'delete') {
            await interaction.deleteReply()
        }
    } catch(e){
        // Thrown by awaitMessageComponent on timeout
        await interaction.editReply({components: []})
    }
}

export const renderLily = async (interaction, code, full) => {

    const loadingMessageInterval = await startLoadingMessageInterval(interaction);
    logLily(interaction.user, code)
    const lily = !full ? templates.lilySimple(code) : templates.lilyFull(code);

    try {
        const files = await fetchLilyRenders(lily);
        clearInterval(loadingMessageInterval);
        const buttons = await interaction.editReply({content: "", files, components: [confirmButtons]});
        await processConfirmButtons(interaction, buttons);
    } catch (e) {
        clearInterval(loadingMessageInterval);
        await handleError(e, interaction);
    }
}
