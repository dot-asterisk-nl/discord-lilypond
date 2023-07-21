import {templates} from "../templates/lily-templates.js";
import {config} from "../../config.js";
import {confirmButtons} from "../../buttons.js";

const toFormEncoded = (params) => Object.keys(params).map((key) => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
}).join('&');
const createRequestParams = (lily, ext) => {
    return {
        method: "POST",
        body: toFormEncoded({lilypond_text: lily, extension: ext}),
        headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}
    };
}
const logLily = (user, code) => {
    const logMessage = `[${new Date().toISOString()}] User: ${user.username}(${user.id})\n`
        + "-----\n"
        + code + "\n"
        + "-----\n"
    console.log(logMessage)
}

export const renderLily = async (interaction, code, full) => {
    await interaction.reply("...")

    logLily(interaction.user, code)

    let dots = 0;
    const messageInterval = setInterval(() => {
        dots = (dots + 1) % 4
        interaction.editReply("_Rendering_ 🎵 " + ".".repeat(dots))
    }, 500)
    const lily = !full ? templates.lilySimple(code) : templates.lilyFull(code);
    const catchErr = (response) => {
        console.log(response.status)
        if(!response.ok) {
            throw new Error(response.status)
        }
        return response
    }

    try {
        const pngBytes = await fetch(config.endpoint, createRequestParams(lily, "png")).then(catchErr).then(response => response.body);
        const mp3Bytes = await fetch(config.endpoint, createRequestParams(lily, "mp3")).then(catchErr).then(response => response.body);
        clearInterval(messageInterval);
        const response = await interaction.editReply({content: "", files: [{attachment: pngBytes, name: 'output.png'}, {attachment: mp3Bytes, name: 'output.mp3'}], components: [confirmButtons]});

        try{
            const confirmation = await response.awaitMessageComponent({ time: 60_000 });

            if (confirmation.customId === 'confirm') {
                await confirmation.update({ content: ` `, components: [] });
            } else if (confirmation.customId === 'delete') {
                await interaction.deleteReply()
            }
        } catch(e){
            await interaction.editReply({components: []})
        }

    } catch (e) {
        clearInterval(messageInterval);
        console.error(e)
        if(e.message === "400"){
            await interaction.editReply({content: ":warning: Error! Your lilypond code is invalid. You can use services like https://hacklily.org or install Frescobaldi."})
        } else {
            await interaction.editReply({content: ":warning: **Internal Server Error**"})
        }
    }
}
