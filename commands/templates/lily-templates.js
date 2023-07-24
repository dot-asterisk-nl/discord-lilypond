export const templates = {
    lilySimple: (c) => `
\\include "lilypond-book-preamble.ly"
\\score { 
    \\relative c' {
    \\set Score.tempoHideNote = ##t
    \\tempo 4 = 90
    ${c}
    }
    \\layout {
        indent = 0 \\mm
        line-width = 160\\mm
        line-width = #(- line-width (* mm  3.000000) (* mm 1))
    }
    \\midi{}
}
`, lilyFull: (c) => `\\include "lilypond-book-preamble.ly" \n${c}\n`
}