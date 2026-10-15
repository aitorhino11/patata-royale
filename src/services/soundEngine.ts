/**
 * Web Audio API Sound Synthesizer for Hot Potato Royale
 * Completely self-contained, tension-building dynamic audio engine.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;

  private isMuted: boolean = false;
  private masterVolume: number = 0.8;
  private sfxVolume: number = 0.85;
  private musicVolume: number = 0.7;

  private tensionInterval: number | null = null;
  private currentBpm: number = 90;
  private beatStep: number = 0;
  private sizzleNode: AudioBufferSourceNode | null = null;
  private sizzleGain: GainNode | null = null;

  private micStream: MediaStream | null = null;
  private micAnalyser: AnalyserNode | null = null;
  private micDataArray: Uint8Array<ArrayBuffer> | null = null;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.masterVolume;
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.sfxVolume;
      this.sfxGain.connect(this.masterGain);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = this.musicVolume;
      this.musicGain.connect(this.masterGain);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setVolumes(master: number, sfx: number, music: number) {
    this.masterVolume = master;
    this.sfxVolume = sfx;
    this.musicVolume = music;

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : master, this.ctx.currentTime);
    }
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(sfx, this.ctx.currentTime);
    }
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(music, this.ctx.currentTime);
    }
  }

  public toggleMute(muted?: boolean) {
    this.isMuted = muted !== undefined ? muted : !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  // --- Dynamic Tension Music / Beat loop ---
  public startTensionMusic(bpm: number = 100) {
    this.initContext();
    this.stopTensionMusic();
    this.currentBpm = bpm;
    this.scheduleNextBeat();
  }

  public updateTensionBpm(bpm: number) {
    this.currentBpm = Math.min(280, Math.max(60, bpm));
  }

  private scheduleNextBeat() {
    if (!this.ctx) return;
    const intervalMs = (60 / this.currentBpm) * 1000;

    this.playTensionTick(this.beatStep % 4 === 0);
    this.beatStep++;

    this.tensionInterval = window.setTimeout(() => {
      this.scheduleNextBeat();
    }, intervalMs);
  }

  public stopTensionMusic() {
    if (this.tensionInterval) {
      clearTimeout(this.tensionInterval);
      this.tensionInterval = null;
    }
    this.beatStep = 0;
    this.stopSizzle();
  }

  private playTensionTick(isDownbeat: boolean) {
    if (!this.ctx || !this.musicGain) return;
    const now = this.ctx.currentTime;

    // Sub-bass thud
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = isDownbeat ? 'sine' : 'triangle';

    const baseFreq = isDownbeat ? 65 : 120;
    // Pitch rises slightly with higher BPM to heighten anxiety
    const bpmFactor = (this.currentBpm - 80) * 0.4;
    osc.frequency.setValueAtTime(baseFreq + bpmFactor, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.12);

    gain.gain.setValueAtTime(isDownbeat ? 0.35 : 0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(now);
    osc.stop(now + 0.13);

    // Urgent high ticking hi-hat and iconic PIP-PIP bomb beeper
    const pipOsc = this.ctx.createOscillator();
    const pipGain = this.ctx.createGain();
    pipOsc.type = 'sine';
    // Frequency rises from 1200Hz to 2400Hz as BPM speeds up
    const pipFreq = Math.min(2600, 1100 + (this.currentBpm - 80) * 8);
    pipOsc.frequency.setValueAtTime(pipFreq, now);

    pipGain.gain.setValueAtTime(0.28, now);
    pipGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    pipOsc.connect(pipGain);
    pipGain.connect(this.musicGain);

    pipOsc.start(now);
    pipOsc.stop(now + 0.05);

    const noiseBuffer = this.getNoiseBuffer();
    if (noiseBuffer) {
      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = isDownbeat ? 6000 : 8500;

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(isDownbeat ? 0.12 : 0.07, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      noiseSource.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.musicGain);

      noiseSource.start(now);
      noiseSource.stop(now + 0.06);
    }
  }

  // --- Sound Effects ---

  // Passing Whoosh Sound
  public playPassWhoosh() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(950, now + 0.1);
    osc.frequency.exponentialRampToValueAtTime(450, now + 0.22);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  // Sudden random acceleration warning sound
  public playAccelerationAlarm() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    for (let i = 0; i < 2; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      const startTime = now + i * 0.11;
      osc.frequency.setValueAtTime(650, startTime);
      osc.frequency.linearRampToValueAtTime(1150, startTime + 0.08);

      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(startTime);
      osc.stop(startTime + 0.11);
    }
  }

  // Heartbeat thump when potato is in your hands
  public playHeartbeatThump() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const playThump = (time: number, freq: number, vol: number) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      osc.frequency.exponentialRampToValueAtTime(35, time + 0.12);

      gain.gain.setValueAtTime(vol, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(time);
      osc.stop(time + 0.16);
    };

    playThump(now, 90, 0.55);
    playThump(now + 0.14, 75, 0.4);
  }

  // Burning Sizzle loop
  public startSizzle() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.sizzleNode) return;

    const noiseBuffer = this.getNoiseBuffer();
    if (!noiseBuffer) return;

    this.sizzleNode = this.ctx.createBufferSource();
    this.sizzleNode.buffer = noiseBuffer;
    this.sizzleNode.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 3200;
    filter.Q.value = 3;

    this.sizzleGain = this.ctx.createGain();
    this.sizzleGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    this.sizzleGain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 0.15);

    this.sizzleNode.connect(filter);
    filter.connect(this.sizzleGain);
    this.sizzleGain.connect(this.sfxGain);

    this.sizzleNode.start();
  }

  public stopSizzle() {
    if (this.sizzleGain && this.ctx) {
      this.sizzleGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
    }
    setTimeout(() => {
      if (this.sizzleNode) {
        try {
          this.sizzleNode.stop();
          this.sizzleNode.disconnect();
        } catch {
          // Ignore
        }
        this.sizzleNode = null;
      }
    }, 120);
  }

  // Frantic Tap/Spam charging click with rising pitch
  public playTapCharge(chargePercent: number = 0) {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Pitch rises dynamically with charge from 380Hz to 1100Hz
    const baseFreq = 380 + (Math.min(100, Math.max(0, chargePercent)) / 100) * 720;
    osc.type = chargePercent > 75 ? 'sawtooth' : 'triangle';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.35, now + 0.05);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.07);

    // If charge is high, add a laser spark pop
    if (chargePercent > 70) {
      const sparkOsc = this.ctx.createOscillator();
      const sparkGain = this.ctx.createGain();
      sparkOsc.type = 'sine';
      sparkOsc.frequency.setValueAtTime(1400 + chargePercent * 8, now);
      sparkOsc.frequency.exponentialRampToValueAtTime(800, now + 0.04);

      sparkGain.gain.setValueAtTime(0.2, now);
      sparkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      sparkOsc.connect(sparkGain);
      sparkGain.connect(this.sfxGain);

      sparkOsc.start(now);
      sparkOsc.stop(now + 0.05);
    }
  }

  // Massive EXPLOSION sound
  public playExplosion() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    // 1. Noise burst
    const noiseBuffer = this.getNoiseBuffer();
    if (noiseBuffer) {
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3000, now);
      filter.frequency.exponentialRampToValueAtTime(100, now + 1.2);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.9, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.sfxGain);

      noise.start(now);
      noise.stop(now + 1.5);
    }

    // 2. Sub-bass boom
    const boomOsc = this.ctx.createOscillator();
    const boomGain = this.ctx.createGain();

    boomOsc.type = 'triangle';
    boomOsc.frequency.setValueAtTime(140, now);
    boomOsc.frequency.exponentialRampToValueAtTime(25, now + 0.8);

    boomGain.gain.setValueAtTime(0.8, now);
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);

    boomOsc.connect(boomGain);
    boomGain.connect(this.sfxGain);

    boomOsc.start(now);
    boomOsc.stop(now + 1.1);

    // 3. Shockwave crunch
    const crunchOsc = this.ctx.createOscillator();
    const crunchGain = this.ctx.createGain();
    crunchOsc.type = 'sawtooth';
    crunchOsc.frequency.setValueAtTime(90, now);
    crunchOsc.frequency.exponentialRampToValueAtTime(20, now + 0.4);

    crunchGain.gain.setValueAtTime(0.5, now);
    crunchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    crunchOsc.connect(crunchGain);
    crunchGain.connect(this.sfxGain);

    crunchOsc.start(now);
    crunchOsc.stop(now + 0.46);
  }

  // Victory fanfare
  public playVictoryFanfare() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99]; // C, E, G, C5, E5, G5
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      const noteTime = now + idx * 0.1;
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.3, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.45);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(noteTime);
      osc.stop(noteTime + 0.48);
    });
  }

  // General UI Click
  public playClick() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  // Purchase / Coin Chime
  public playCoin() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(987.77, now); // B5
    osc1.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    osc2.frequency.setValueAtTime(987.77 * 1.5, now);
    osc2.frequency.setValueAtTime(1318.51 * 1.5, now + 0.08);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.sfxGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.36);
    osc2.stop(now + 0.36);
  }

  // Voice Chat Bleep / Radio Chatter Simulation
  public playVoiceBleep(pitchShift: number = 1.0) {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440 * pitchShift, now);
    osc.frequency.linearRampToValueAtTime(520 * pitchShift, now + 0.04);
    osc.frequency.linearRampToValueAtTime(390 * pitchShift, now + 0.08);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  // --- Real Microphone Analysis for Voice Chat ---
  public async enableRealMic(): Promise<boolean> {
    try {
      this.initContext();
      if (!this.ctx) return false;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      this.micStream = stream;

      const source = this.ctx.createMediaStreamSource(stream);
      this.micAnalyser = this.ctx.createAnalyser();
      this.micAnalyser.fftSize = 64;
      this.micDataArray = new Uint8Array(this.micAnalyser.frequencyBinCount);

      source.connect(this.micAnalyser);
      return true;
    } catch {
      return false;
    }
  }

  public disableRealMic() {
    if (this.micStream) {
      this.micStream.getTracks().forEach((t) => t.stop());
      this.micStream = null;
    }
    this.micAnalyser = null;
    this.micDataArray = null;
  }

  public getMicVolumeLevel(): number {
    if (!this.micAnalyser || !this.micDataArray) return 0;
    this.micAnalyser.getByteFrequencyData(this.micDataArray);
    let sum = 0;
    for (let i = 0; i < this.micDataArray.length; i++) {
      sum += this.micDataArray[i];
    }
    const avg = sum / this.micDataArray.length;
    return Math.min(1, avg / 128); // 0 to 1
  }

  // Cacheable white noise buffer
  private cachedNoiseBuffer: AudioBuffer | null = null;
  private getNoiseBuffer(): AudioBuffer | null {
    if (!this.ctx) return null;
    if (this.cachedNoiseBuffer) return this.cachedNoiseBuffer;

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    this.cachedNoiseBuffer = buffer;
    return buffer;
  }
}

export const soundEngine = new SoundEngine();
