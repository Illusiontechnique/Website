import { ToneAudioNode } from "../../core/context/ToneAudioNode";
import { optionsFromArguments } from "../../core/util/Defaults";
import { Solo } from "./Solo";
import { PanVol } from "./PanVol";
import { readOnly } from "../../core/util/Interface";
import { Gain } from "../../core/context/Gain";
/**
 * Channel provides a channel strip interface with volume, pan, solo and mute controls.
 * See [[PanVol]] and [[Solo]]
 * @example
 * // pan the incoming signal left and drop the volume 12db
 * const channel = new Tone.Channel(-0.25, -12);
 * @category Component
 */
export class Channel extends ToneAudioNode {
    constructor() {
        super(optionsFromArguments(Channel.getDefaults(), arguments, ["volume", "pan"]));
        this.name = "Channel";
        const options = optionsFromArguments(Channel.getDefaults(), arguments, ["volume", "pan"]);
        this._solo = this.input = new Solo({
            solo: options.solo,
            context: this.context,
        });
        this._panVol = this.output = new PanVol({
            context: this.context,
            pan: options.pan,
            volume: options.volume,
            mute: options.mute,
            channelCount: options.channelCount
        });
        this.pan = this._panVol.pan;
        this.volume = this._panVol.volume;
        this._solo.connect(this._panVol);
        readOnly(this, ["pan", "volume"]);
    }
    static getDefaults() {
        return Object.assign(ToneAudioNode.getDefaults(), {
            pan: 0,
            volume: 0,
            mute: false,
            solo: false,
            channelCount: 1,
        });
    }
    /**
     * Solo/unsolo the channel. Soloing is only relative to other [[Channels]] and [[Solo]] instances
     */
    get solo() {
        return this._solo.solo;
    }
    set solo(solo) {
        this._solo.solo = solo;
    }
    /**
     * If the current instance is muted, i.e. another instance is soloed,
     * or the channel is muted
     */
    get muted() {
        return this._solo.muted || this.mute;
    }
    /**
     * Mute/unmute the volume
     */
    get mute() {
        return this._panVol.mute;
    }
    set mute(mute) {
        this._panVol.mute = mute;
    }
    /**
     * Get the gain node belonging to the bus name. Create it if
     * it doesn't exist
     * @param name The bus name
     */
    _getBus(name) {
        if (!Channel.buses.has(name)) {
            Channel.buses.set(name, new Gain({ context: this.context }));
        }
        return Channel.buses.get(name);
    }
    /**
     * Send audio to another channel using a string. `send` is a lot like
     * [[connect]], except it uses a string instead of an object. This can
     * be useful in large applications to decouple sections since [[send]]
     * and [[receive]] can be invoked separately in order to connect an object
     * @param name The channel name to send the audio
     * @param volume The amount of the signal to send.
     * 	Defaults to 0db, i.e. send the entire signal
     * @returns Returns the gain node of this connection.
     */
    send(name, volume = 0) {
        const bus = this._getBus(name);
        const sendKnob = new Gain({
            context: this.context,
            units: "decibels",
            gain: volume,
        });
        this.connect(sendKnob);
        sendKnob.connect(bus);
        return sendKnob;
    }
    /**
     * Receive audio from a channel which was connected with [[send]].
     * @param name The channel name to receive audio from.
     */
    receive(name) {
        const bus = this._getBus(name);
        bus.connect(this);
        return this;
    }
    dispose() {
        super.dispose();
        this._panVol.dispose();
        this.pan.dispose();
        this.volume.dispose();
        this._solo.dispose();
        return this;
    }
}
/**
 * Store the send/receive channels by name.
 */
Channel.buses = new Map();
//# sourceMappingURL=Channel.js.map
