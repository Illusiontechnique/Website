import { ToneEvent } from "./ToneEvent";
import { ToneWithContext } from "../core/context/ToneWithContext";
import { optionsFromArguments } from "../core/util/Defaults";
import { noOp } from "../core/util/Interface";
/**
 * Loop creates a looped callback at the
 * specified interval. The callback can be
 * started, stopped and scheduled along
 * the Transport's timeline.
 * @example
 * const loop = new Tone.Loop((time) => {
 * 	// triggered every eighth note.
 * 	console.log(time);
 * }, "8n").start(0);
 * Tone.Transport.start();
 * @category Event
 */
export class Loop extends ToneWithContext {
    constructor() {
        super(optionsFromArguments(Loop.getDefaults(), arguments, ["callback", "interval"]));
        this.name = "Loop";
        const options = optionsFromArguments(Loop.getDefaults(), arguments, ["callback", "interval"]);
        this._event = new ToneEvent({
            context: this.context,
            callback: this._tick.bind(this),
            loop: true,
            loopEnd: options.interval,
            playbackRate: options.playbackRate,
            probability: options.probability
        });
        this.callback = options.callback;
        // set the iterations
        this.iterations = options.iterations;
    }
    static getDefaults() {
        return Object.assign(ToneWithContext.getDefaults(), {
            interval: "4n",
            callback: noOp,
            playbackRate: 1,
            iterations: Infinity,
            probability: 1,
            mute: false,
            humanize: false
        });
    }
    /**
     * Start the loop at the specified time along the Transport's timeline.
     * @param  time  When to start the Loop.
     */
    start(time) {
        this._event.start(time);
        return this;
    }
    /**
     * Stop the loop at the given time.
     * @param  time  When to stop the Loop.
     */
    stop(time) {
        this._event.stop(time);
        return this;
    }
    /**
     * Cancel all scheduled events greater than or equal to the given time
     * @param  time  The time after which events will be cancel.
     */
    cancel(time) {
        this._event.cancel(time);
        return this;
    }
    /**
     * Internal function called when the notes should be called
     * @param time  The time the event occurs
     */
    _tick(time) {
        this.callback(time);
    }
    /**
     * The state of the Loop, either started or stopped.
     */
    get state() {
        return this._event.state;
    }
    /**
     * The progress of the loop as a value between 0-1. 0, when the loop is stopped or done iterating.
     */
    get progress() {
        return this._event.progress;
    }
    /**
     * The time between successive callbacks.
     * @example
     * const loop = new Tone.Loop();
     * loop.interval = "8n"; // loop every 8n
     */
    get interval() {
        return this._event.loopEnd;
    }
    set interval(interval) {
        this._event.loopEnd = interval;
    }
    /**
     * The playback rate of the loop. The normal playback rate is 1 (no change).
     * A `playbackRate` of 2 would be twice as fast.
     */
    get playbackRate() {
        return this._event.playbackRate;
    }
    set playbackRate(rate) {
        this._event.playbackRate = rate;
    }
    /**
     * Random variation +/-0.01s to the scheduled time.
     * Or give it a time value which it will randomize by.
     */
    get humanize() {
        return this._event.humanize;
    }
    set humanize(variation) {
        this._event.humanize = variation;
    }
    /**
     * The probably of the callback being invoked.
     */
    get probability() {
        return this._event.probability;
    }
    set probability(prob) {
        this._event.probability = prob;
    }
    /**
     * Muting the Loop means that no callbacks are invoked.
     */
    get mute() {
        return this._event.mute;
    }
    set mute(mute) {
        this._event.mute = mute;
    }
    /**
     * The number of iterations of the loop. The default value is `Infinity` (loop forever).
     */
    get iterations() {
        if (this._event.loop === true) {
            return Infinity;
        }
        else {
            return this._event.loop;
        }
    }
    set iterations(iters) {
        if (iters === Infinity) {
            this._event.loop = true;
        }
        else {
            this._event.loop = iters;
        }
    }
    dispose() {
        super.dispose();
        this._event.dispose();
        return this;
    }
}
//# sourceMappingURL=Loop.js.map
