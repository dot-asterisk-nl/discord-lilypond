import {config} from "../../config.js";
import sharp from "sharp";


export class LilyWebError extends Error {
    constructor(type, message) {
        super(message);
        this.type = type;
    }

}
const catchPromiseErr = async (response) => {
    if(!response.ok) {
        throw new LilyWebError(response.headers.get('X-Error-Type'.toLowerCase()), await response.text())
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
    const pngAttachmentPromise = fetch(config.endpoint, createRequestParams(lily, "png"))
        .then(catchPromiseErr)
        .then(response => response.arrayBuffer())
        .then(buffer => sharp(buffer).extend({
            top: 100, bottom: 100, left: 100, right: 100,
            background: { r: 255, g: 255, b: 255, alpha: 255 }
        }).toBuffer())
        .then(buf => ({attachment: buf, name: 'output.png'}))

    const mp3AttachmentPromise = fetch(config.endpoint, createRequestParams(lily, "mp3"))
        .then(catchPromiseErr)
        .then(response => ({length: response.headers.get("content-length"), body: response.body}))
        .then(res => res.length > 255 ? {attachment: res.body, name: 'output.mp3'} : null)


    return await Promise.all([pngAttachmentPromise, mp3AttachmentPromise])
        .then(a => a[1] ? a : [a[0]]) // Quick maffs to exclude MP3 if too small (empty).
                                                    // The reply function only accepts valid file objects.
}