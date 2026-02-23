import { Optional } from "../../util/types/types";

export interface Point {
  x: number;
  y: number;
}

export class Hex {
  readonly q: number;
  readonly r: number;
  readonly s: number;
  constructor(q: number, r: number, s: number) {
    this.q = q;
    this.r = r;
    this.s = s;
  }

  static up = new Hex(0, -1, 1);
  static down = new Hex(0, 1, -1);
  static topLeft = new Hex(-1, 0, 1);
  static topRight = new Hex(1, -1, 0);
  static bottomLeft = new Hex(-1, 1, 0);
  static bottomRight = new Hex(1, 0, -1);
  static directionToHex(dir: Direction): Hex {
    switch (dir) {
      case "UP":
        return Hex.up;
      case "DOWN":
        return Hex.down;
      case "TOP LEFT":
        return Hex.topLeft;
      case "BOTTOM LEFT":
        return Hex.bottomLeft;
      case "TOP RIGHT":
        return Hex.topRight;
      case "BOTTOM RIGHT":
        return Hex.bottomRight;
    }
  }
  // Order matters. It needs to be a clockwise circle, starting at the top.
  static directions(): Hex[] {
    return [
      Hex.bottomRight,
      Hex.down,
      Hex.bottomLeft,
      Hex.topLeft,
      Hex.up,
      Hex.topRight,
    ];
  }
  // Returns the direction that the unit hex represents.
  // If opposite is set, returns the reverse of that.
  static hexToDirection(hex: Hex, opposite: boolean): Optional<Direction> {
    if (hex.equals(Hex.up)) {
      return opposite ? "DOWN" : "UP";
    } else if (hex.equals(Hex.down)) {
      return opposite ? "UP" : "DOWN";
    } else if (hex.equals(Hex.topLeft)) {
      return opposite ? "BOTTOM RIGHT" : "TOP LEFT";
    } else if (hex.equals(Hex.bottomRight)) {
      return opposite ? "TOP LEFT" : "BOTTOM RIGHT";
    } else if (hex.equals(Hex.topRight)) {
      return opposite ? "BOTTOM LEFT" : "TOP RIGHT";
    } else if (hex.equals(Hex.bottomLeft)) {
      return opposite ? "TOP RIGHT" : "BOTTOM LEFT";
    }
  }

  // Returns true if the 2 hexes are the same.
  equals(other: Hex): boolean {
    return this.q === other.q && this.r === other.r && this.s === other.s;
  }

  // Retuns a new Hex by adding the two together.
  add(other: Hex): Hex {
    return new Hex(this.q + other.q, this.r + other.r, this.s + other.s);
  }

  // Returns a new Hex by subtracting the other.
  subtract(other: Hex): Hex {
    return new Hex(this.q - other.q, this.r - other.r, this.s - other.s);
  }

  // Alias for add, used for neighbor finding.
  neighbor(direction: Hex): Hex {
    return this.add(direction);
  }

  // Returns a new Hex, scaled by a constant factor.
  scale(factor: number): Hex {
    return new Hex(this.q * factor, this.r * factor, this.s * factor);
  }

  // Returns all Hexes in a ring of size radius around this hex.
  ring(radius: number): Hex[] {
    const results: Hex[] = [];

    let hex = this.add(Hex.up.scale(radius));
    for (const direction of Hex.directions()) {
      for (let ring = 0; ring < radius; ring++) {
        results.push(hex);
        hex = hex.neighbor(direction);
      }
    }
    return results;
  }

  // Returns all Hexes from the current Hex out in a spiral of numRings.
  spiral(numRings: number): Hex[] {
    let results: Hex[] = [this];
    for (let ring = 1; ring < numRings; ring++) {
      results = results.concat(this.ring(ring));
    }
    return results;
  }

  toPixel(size: number): Point {
    const x = size * ((3 / 2) * this.q);
    const y = size * ((Math.sqrt(3) / 2) * this.q + Math.sqrt(3) * this.r);
    return { x, y };
  }

  toSystem(spiral: Hex[], systems: string[]): Optional<string> {
    const index = spiral.findIndex((value) => this.equals(value));
    if (index === -1) {
      return;
    }
    return systems[index];
  }
}
