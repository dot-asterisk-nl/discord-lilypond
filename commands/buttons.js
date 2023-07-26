import {ActionRowBuilder, ButtonBuilder, ButtonStyle} from "discord.js";

const createConfirmButtons = () => {
    const confirm = new ButtonBuilder()
        .setCustomId('confirm')
        .setLabel('Confirm')
        .setStyle(ButtonStyle.Success)

    const remove = new ButtonBuilder()
        .setCustomId('delete')
        .setLabel('Delete')
        .setStyle(ButtonStyle.Danger)

    return new ActionRowBuilder().addComponents(confirm, remove);
}

export const confirmButtons = createConfirmButtons()
