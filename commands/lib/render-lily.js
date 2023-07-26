import {templates} from "../templates/lily-templates.js";
import {confirmButtons} from "../buttons.js";
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
    const errToReply = async (prefix, text) => {
        await interaction.followUp({content: prefix, files: [{attachment: Buffer.from(text, "utf-8"), name: "error.txt"}], ephemeral: true});
    }

    if(e.type === "LilypondException"){
        const prefix =
            ":warning: Error! Your lilypond code is invalid, has an unsupported `\\version` or took longer than 5 seconds to generate.\n" +
            "You can use <https://hacklily.org> or install [Frescobaldi](<https://www.frescobaldi.org/download>) to check your code.\n\n";

        await errToReply(prefix, e.message)
    } else if (e.type === "TimidityException") {
        const prefix =
            ":warning: Error! Could not create music from lilypond-generated midi!\n" +
            "Check if you have \\midi{} in your \\score{}. \n\n";

        await errToReply(prefix, e.message);
    } else {
        console.error(e);
        await interaction.followUp({content: ":warning: **Internal Server Error**", ephemeral: true})
    }

    await interaction.deleteReply()
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
