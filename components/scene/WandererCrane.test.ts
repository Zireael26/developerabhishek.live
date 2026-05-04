import { describe, expect, test } from 'vitest';

import {
  POSES,
  computeCranePoseTarget,
  normalizeScrollVelocity,
} from './WandererCrane';

describe('Wanderer crane pose model', () => {
  test('resets to the hero pose at the top of the page', () => {
    const heroPose = POSES.hero!;
    const target = computeCranePoseTarget({
      sections: [
        { key: 'hero', top: 0, bottom: 760, height: 760 },
        { key: 'work', top: 760, bottom: 1480, height: 720 },
      ],
      scrollY: 0,
      viewportWidth: 1280,
      viewportHeight: 760,
    });

    expect(target.activeKey).toBe('hero');
    expect(target.pose.rotY).toBeCloseTo(heroPose.rotY);
    expect(target.pose.rotX).toBeCloseTo(heroPose.rotX);
    expect(target.pose.spin).toBe(0);
  });

  test('prefers the section aligned under the top navigation anchor', () => {
    const workPose = POSES.work!;
    const target = computeCranePoseTarget({
      sections: [
        { key: 'hero', top: -720, bottom: 24, height: 744 },
        { key: 'work', top: 88, bottom: 900, height: 812 },
        { key: 'about', top: 910, bottom: 1680, height: 770 },
      ],
      scrollY: 720,
      viewportWidth: 1280,
      viewportHeight: 760,
    });

    expect(target.activeKey).toBe('work');
    expect(target.pose.x).toBeCloseTo(workPose.x);
    expect(target.pose.rotY).toBeCloseTo(workPose.rotY);
  });

  test('keeps mobile poses smaller while preserving section-specific targets', () => {
    const contactPose = POSES.contact!;
    const desktop = computeCranePoseTarget({
      sections: [{ key: 'contact', top: 72, bottom: 720, height: 648 }],
      scrollY: 3200,
      viewportWidth: 1280,
      viewportHeight: 760,
    });
    const mobile = computeCranePoseTarget({
      sections: [{ key: 'contact', top: 72, bottom: 720, height: 648 }],
      scrollY: 3200,
      viewportWidth: 390,
      viewportHeight: 844,
    });

    expect(desktop.activeKey).toBe('contact');
    expect(mobile.activeKey).toBe('contact');
    expect(mobile.pose.scale).toBeLessThan(desktop.pose.scale);
    expect(Math.abs(mobile.pose.x)).toBeLessThan(Math.abs(desktop.pose.x));
    expect(mobile.pose.rotY).toBeCloseTo(contactPose.rotY);
  });

  test('clamps scroll velocity effects in both directions', () => {
    expect(normalizeScrollVelocity(4000)).toBeLessThanOrEqual(0.42);
    expect(normalizeScrollVelocity(-4000)).toBeGreaterThanOrEqual(-0.42);
    expect(normalizeScrollVelocity(0)).toBe(0);
  });
});
