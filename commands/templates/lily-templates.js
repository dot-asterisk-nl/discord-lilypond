export const templates = {
    lilySimple: (c) => `\\include "lilypond-book-preamble.ly"

\\score { 
    \\relative c' {
    ${c}
    }
    \\layout{}
    \\midi{}
}
`, lilyFull: (c) => `\\include "lilypond-book-preamble.ly" \n${c}\n`
}