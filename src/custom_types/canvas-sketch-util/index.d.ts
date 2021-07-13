declare module 'canvas-sketch-util/math' {
  function linspace(val: number): any;
  function mapRange(n1: number, n2: number, n3: number, n4: number, n5: number): any;
}

declare module 'canvas-sketch-util/random' {
  type Seed = string;
  function noise2D(d1: number, d2: number, frequency?: number, amplitude?: number): number;
  function setSeed(n: Seed): void;

  interface Random {
    noise2D: any;
    setSeed: any;
  }

  function createRandom(): Random;
}

declare module 'canvas-sketch-util/penplot' {
  function pathsToSVGPaths(
    arr: any,
    { width, height, units }: { width: number; height: number; units: string }
  ): any;
}
