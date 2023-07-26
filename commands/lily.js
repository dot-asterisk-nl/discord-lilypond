import {ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle} from "discord.js";
import {renderLily} from "./lib/render-lily.js";

export const renderLilySimple = async (interaction) => {
    const code = interaction.options.getString("code");
    await renderLily(interaction, code, "simple")
}
export const renderLilyFull = async (interaction) => {
    const modal = new ModalBuilder()
        .setCustomId('full-modal')
        .setTitle('🎼 Submit your LilyPond score');

    const textInput = new TextInputBuilder()
        .setCustomId('score')
        .setLabel('🎶 Your LilyPond code')
        .setStyle(TextInputStyle.Paragraph)
        .setMaxLength(4000)

    modal.addComponents(new ActionRowBuilder().addComponents(textInput))

    await interaction.showModal(modal)
    const modalInteraction = await interaction.awaitModalSubmit({time: 60_000})

    const code = modalInteraction.fields.getTextInputValue("score")
    await renderLily(modalInteraction, code, "full")

}
export const renderLilyFile = async (interaction) => {
    const attachment = interaction.options.getAttachment("file");
    const stream = attachment.attachment + "";

    const response = await fetch(stream)
    const code = await response.text()

    await renderLily(interaction, code, "file")
}