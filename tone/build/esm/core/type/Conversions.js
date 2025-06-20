/**
 * Equal power gain scale. Good for cross-fading.
 * @param  percent (0-1)
 */
export function equalPowerScale(percent) {
    const piFactor = 0.5 * Math.PI;
    return Math.sin(percent * piFactor);
}
/**
 * Convert decibels into gain.
 */
export function dbToGain(db) {
    return Math.pow(10, db / 20);
}
/**
 * Convert gain to decibels.
 */
export function gainToDb(gain) {
    return 20 * (Math.log(gain) / Math.LN10);
}
/**
 * Convert an interval (in semitones) to a frequency ratio.
 * @param interval the number of semitones above the base note
 * @example
 * Tone.intervalToFrequencyRatio(0); // 1
 * Tone.intervalToFrequencyRatio(12); // 2
 * Tone.intervalToFrequencyRatio(-12); // 0.5
 */
export function intervalToFrequencyRatio(interval) {
    return Math.pow(2, (interval / 12));
}
/**
 * The Global [concert tuning pitch](https://en.wikipedia.org/wiki/Concert_pitch) which is used
 * to generate all the other pitch values from notes. A4's values in Hertz.
 */
let A4 = 440;
export function getA4() {
    return A4;
}
export function setA4(freq) {
    A4 = freq;
}
/**
 * Convert a frequency value to a MIDI note.
 * @param frequency The value to frequency value to convert.
 * @example
 * Tone.ftom(440); // returns 69
 */
export function ftom(frequency) {
    return Math.round(ftomf(frequency));
}
/**
 * Convert a frequency to a floating point midi value
 */
export function ftomf(frequency) {
    return 69 + 12 * Math.log2(frequency / A4);
}
/**
 * Convert a MIDI note to frequency value.
 * @param  midi The midi number to convert.
 * @return The corresponding frequency value
 * @example
 * Tone.mtof(69); // 440
 */
export function mtof(midi) {
    return A4 * Math.pow(2, (midi - 69) / 12);
}
//# sourceMappingURL=Conversions.js.map
