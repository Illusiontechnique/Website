import { LowpassCombFilter } from "../component/filter/LowpassCombFilter";
import { deepMerge } from "../core/util/Defaults";
import { optionsFromArguments } from "../core/util/Defaults";
import { Noise } from "../source/Noise";
import { Instrument } from "./Instrument";
/**
 * Karplus-String string synthesis.
 * @example
 * const plucky = new Tone.PluckSynth().toDestination();
 * plucky.triggerAttack("C4", "+0.5");
 * plucky.triggerAttack("C3", "+1");
 * plucky.triggerAttack("C2", "+1.5");
 * plucky.triggerAttack("C1", "+2");
 * @category Instrument
 */
export class PluckSynth extends Instrument {
    constructor() {
        super(optionsFromArguments(PluckSynth.getDefaults(), arguments));
        this.name = "PluckSynth";
        const options = optionsFromArguments(PluckSynth.getDefaults(), arguments);
        this._noise = new Noise({
            context: this.context,
            type: "pink"
        });
        this.attackNoise = options.attackNoise;
        this._lfcf = new LowpassCombFilter({
            context: this.context,
            dampening: options.dampening,
            resonance: options.resonance,
        });
        this.resonance = options.resonance;
        this.release = options.release;
        this._noise.connect(this._lfcf);
        this._lfcf.connect(this.output);
    }
    static getDefaults() {
        return deepMerge(Instrument.getDefaults(), {
            attackNoise: 1,
            dampening: 4000,
            resonance: 0.7,
            release: 1,
        });
    }
    /**
     * The dampening control. i.e. the lowpass filter frequency of the comb filter
     * @min 0
     * @max 7000
     */
    get dampening() {
        return this._lfcf.dampening;
    }
    set dampening(fq) {
        this._lfcf.dampening = fq;
    }
    triggerAttack(note, time) {
        const freq = this.toFrequency(note);
        time = this.toSeconds(time);
        const delayAmount = 1 / freq;
        this._lfcf.delayTime.setValueAtTime(delayAmount, time);
        this._noise.start(time);
        this._noise.stop(time + delayAmount * this.attackNoise);
        this._lfcf.resonance.cancelScheduledValues(time);
        this._lfcf.resonance.setValueAtTime(this.resonance, time);
        return this;
    }
    /**
     * Ramp down the [[resonance]] to 0 over the duration of the release time.
     */
    triggerRelease(time) {
        this._lfcf.resonance.linearRampTo(0, this.release, time);
        return this;
    }
    dispose() {
        super.dispose();
        this._noise.dispose();
        this._lfcf.dispose();
        return this;
    }
}
//# sourceMappingURL=PluckSynth.js.map
