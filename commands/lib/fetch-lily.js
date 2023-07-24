import {config} from "../../config.js";
import sharp from "sharp";

const catchPromiseErr = (response) => {
    if(!response.ok) {
        throw new Error("RENDERING_ERROR")
    }
    return response
}
const createRequestParams = (lily, ext) => {
    return {
        method: "POST",
        body: toFormEncoded({lilypond_text: lily, extension: ext}),
        headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}
    };
}
const toFormEncoded = (params) => Object.keys(params).map((key) => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
}).join('&');

export const fetchLilyRenders = async (lily) => {
    const pngBytesPromise = fetch(config.endpoint, createRequestParams(lily, "png"))
        .then(catchPromiseErr)
        .then(response => response.arrayBuffer())
        .then(buffer => sharp(buffer).extend({
            top: 100, bottom: 100, left: 100, right: 100,
            background: { r: 255, g: 255, b: 255, alpha: 255 }
        }).toBuffer())
        .then(buf => ({attachment: buf, name: 'output.png'}))

    const mp3BytesPromise = fetch(config.endpoint, createRequestParams(lily, "mp3"))
        .then(catchPromiseErr)
        .then(response => response.body)
        .then(buf => ({attachment: buf, name: 'output.mp3'}));

    return await Promise.all([mp3BytesPromise, pngBytesPromise]);
}