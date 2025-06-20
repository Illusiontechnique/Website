import { PhaseShiftAllpass } from "../component/filter/PhaseShiftAllpass";
import { optionsFromArguments } from "../core/util/Defaults";
import { Effect } from "../effect/Effect";
import { Add } from "../signal/Add";
import { Multiply } from "../signal/Multiply";
import { Negate } from "../signal/Negate";
import { Signal } from "../signal/Signal";
import { Oscillator } from "../source/oscillator/Oscillator";
import { ToneOscillatorNode } from "../source/oscillator/ToneOscillatorNode";
/**
 * FrequencyShifter can be used to shift all frequencies of a signal by a fixed amount.
 * The amount can be changed at audio rate and the effect is applied in real time.
 * The frequency shifting is implemented with a technique called single side band modulation using a ring modulator.
 * Note: Contrary to pitch shifting, all frequencies are shifted by the same amount,
 * destroying the harmonic relationship between them. This leads to the classic ring modulator timbre distortion.
 * The algorithm will produces some aliasing towards the high end, especially if your source material
 * contains a lot of high frequencies. Unfortunatelly the webaudio API does not support resampling
 * buffers in real time, so it is not possible to fix it properly. Depending on the use case it might
 * be an option to low pass filter your input before frequency shifting it to get ride of the aliasing.
 * You can find a very detailed description of the algorithm here: https://larzeitlin.github.io/RMFS/
 *
 * @example
 * const input = new Tone.Oscillator(230, "sawtooth").start();
 * const shift = new Tone.FrequencyShifter(42).toDestination();
 * input.connect(shift);
 * @category Effect
 */
export class FrequencyShifter extends Effect {
    constructor() {
        super(optionsFromArguments(FrequencyShifter.getDefaults(), arguments, ["frequency"]));
        this.name = "FrequencyShifter";
        const options = optionsFromArguments(FrequencyShifter.getDefaults(), arguments, ["frequency"]);
        this.frequency = new Signal({
            context: this.context,
            units: "frequency",
            value: options.frequency,
            minValue: -this.context.sampleRate / 2,
            maxValue: this.context.sampleRate / 2,
        });
        this._sine = new ToneOscillatorNode({
            context: this.context,
            type: "sine",
        });
        this._cosine = new Oscillator({
            context: this.context,
            phase: -90,
            type: "sine",
        });
        this._sineMultiply = new Multiply({ context: this.context });
        this._cosineMultiply = new Multiply({ context: this.context });
        this._negate = new Negate({ context: this.context });
        this._add = new Add({ context: this.context });
        this._phaseShifter = new PhaseShiftAllpass({ context: this.context });
        this.effectSend.connect(this._phaseShifter);
        // connect the carrier frequency signal to the two oscillators
        this.frequency.fan(this._sine.frequency, this._cosine.frequency);
        this._phaseShifter.offset90.connect(this._cosineMultiply);
        this._cosine.connect(this._cosineMultiply.factor);
        this._phaseShifter.connect(this._sineMultiply);
        this._sine.connect(this._sineMultiply.factor);
        this._sineMultiply.connect(this._negate);
        this._cosineMultiply.connect(this._add);
        this._negate.connect(this._add.addend);
        this._add.connect(this.effectReturn);
        // start the oscillators at the same time
        const now = this.immediate();
        this._sine.start(now);
        this._cosine.start(now);
    }
    static getDefaults() {
        return Object.assign(Effect.getDefaults(), {
            frequency: 0,
        });
    }
    dispose() {
        super.dispose();
        this.frequency.dispose();
        this._add.dispose();
        this._cosine.dispose();
        this._cosineMultiply.dispose();
        this._negate.dispose();
        this._phaseShifter.dispose();
        this._sine.dispose();
        this._sineMultiply.dispose();
        return this;
    }
}
//# sourceMappingURL=FrequencyShifter.js.map
