import { StereoEffect } from "./StereoEffect";
import { optionsFromArguments } from "../core/util/Defaults";
import { Scale } from "../signal/Scale";
import { Signal } from "../signal/Signal";
import { FeedbackCombFilter } from "../component/filter/FeedbackCombFilter";
import { readOnly } from "../core/util/Interface";
/**
 * an array of the comb filter delay time values
 */
const combFilterDelayTimes = [1687 / 25000, 1601 / 25000, 2053 / 25000, 2251 / 25000];
/**
 * the resonances of each of the comb filters
 */
const combFilterResonances = [0.773, 0.802, 0.753, 0.733];
/**
 * the allpass filter frequencies
 */
const allpassFilterFreqs = [347, 113, 37];
/**
 * JCReverb is a simple [Schroeder Reverberator](https://ccrma.stanford.edu/~jos/pasp/Schroeder_Reverberators.html)
 * tuned by John Chowning in 1970.
 * It is made up of three allpass filters and four [[FeedbackCombFilter]].
 * JCReverb is now implemented with an AudioWorkletNode which may result on performance degradation on some platforms. Consider using [[Reverb]].
 * @example
 * const reverb = new Tone.JCReverb(0.4).toDestination();
 * const delay = new Tone.FeedbackDelay(0.5);
 * // connecting the synth to reverb through delay
 * const synth = new Tone.DuoSynth().chain(delay, reverb);
 * synth.triggerAttackRelease("A4", "8n");
 *
 * @category Effect
 */
export class JCReverb extends StereoEffect {
    constructor() {
        super(optionsFromArguments(JCReverb.getDefaults(), arguments, ["roomSize"]));
        this.name = "JCReverb";
        /**
         * a series of allpass filters
         */
        this._allpassFilters = [];
        /**
         * parallel feedback comb filters
         */
        this._feedbackCombFilters = [];
        const options = optionsFromArguments(JCReverb.getDefaults(), arguments, ["roomSize"]);
        this.roomSize = new Signal({
            context: this.context,
            value: options.roomSize,
            units: "normalRange",
        });
        this._scaleRoomSize = new Scale({
            context: this.context,
            min: -0.733,
            max: 0.197,
        });
        // make the allpass filters
        this._allpassFilters = allpassFilterFreqs.map(freq => {
            const allpass = this.context.createBiquadFilter();
            allpass.type = "allpass";
            allpass.frequency.value = freq;
            return allpass;
        });
        // and the comb filters
        this._feedbackCombFilters = combFilterDelayTimes.map((delayTime, index) => {
            const fbcf = new FeedbackCombFilter({
                context: this.context,
                delayTime,
            });
            this._scaleRoomSize.connect(fbcf.resonance);
            fbcf.resonance.value = combFilterResonances[index];
            if (index < combFilterDelayTimes.length / 2) {
                this.connectEffectLeft(...this._allpassFilters, fbcf);
            }
            else {
                this.connectEffectRight(...this._allpassFilters, fbcf);
            }
            return fbcf;
        });
        // chain the allpass filters together
        this.roomSize.connect(this._scaleRoomSize);
        readOnly(this, ["roomSize"]);
    }
    static getDefaults() {
        return Object.assign(StereoEffect.getDefaults(), {
            roomSize: 0.5,
        });
    }
    dispose() {
        super.dispose();
        this._allpassFilters.forEach(apf => apf.disconnect());
        this._feedbackCombFilters.forEach(fbcf => fbcf.dispose());
        this.roomSize.dispose();
        this._scaleRoomSize.dispose();
        return this;
    }
}
//# sourceMappingURL=JCReverb.js.map
