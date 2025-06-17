  // Calculate the progress percentage between milestones
  const calculateProgressPercentage = (
    points: number[],
    currentPoints: number
  ) => {
    // Find the current segment
    for (let i = 0; i < points.length - 1; i++) {
      const currentMilestone = points[i];
      const nextMilestone = points[i + 1];

      if (currentPoints >= currentMilestone && currentPoints < nextMilestone) {
        // Calculate percentage within this segment
        return (
          (currentPoints - currentMilestone) /
          (nextMilestone - currentMilestone)
        );
      }
    }

    // If user has reached or exceeded the last milestone
    if (currentPoints >= points[points.length - 1]) {
      return 1;
    }

    // If user hasn't reached the first milestone
    return 0;
  };

  // Generate path segments for differential coloring
  const generatePathSegments = (
    points: Array<{ x: number; y: number; points: number }>,
    userPoints: number
  ) => {
    if (points.length < 2) return { completedPath: "", remainingPath: "" };

    const segmentPaths: { start: number; end: number; path: string }[] = [];

    // Generate individual path segments
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];

      // Calculate control points for smooth curves
      const midY = current.y - (current.y - next.y) / 2;
      const cp1x = current.x;
      const cp1y = midY;
      const cp2x = next.x;
      const cp2y = midY;

      // Create path segment
      const segmentPath = `M ${current.x} ${current.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;

      segmentPaths.push({
        start: current.points,
        end: next.points,
        path: segmentPath,
      });
    }

    // Find the segment where user points fall
    let completedPath = "";
    let remainingPath = "";
    let partialSegmentPath = "";
    let foundPartialSegment = false;

    for (const segment of segmentPaths) {
      if (userPoints >= segment.end) {
        // This segment is completely achieved
        completedPath += " " + segment.path;
      } else if (userPoints <= segment.start) {
        // This segment hasn't been started yet
        remainingPath += " " + segment.path;
      } else {
        // This segment is partially completed
        foundPartialSegment = true;

        // Calculate how far along this segment the user is
        const progress =
          (userPoints - segment.start) / (segment.end - segment.start);

        // Split the segment at the right point
        const segmentParts = splitCubicBezier(
          {
            x: points[segmentPaths.indexOf(segment)].x,
            y: points[segmentPaths.indexOf(segment)].y,
          },
          {
            x: points[segmentPaths.indexOf(segment) + 1].x,
            y: points[segmentPaths.indexOf(segment) + 1].y,
          },
          progress
        );

        completedPath += " " + segmentParts.completed;
        remainingPath += " " + segmentParts.remaining;
      }
    }

    return { completedPath, remainingPath };
  };

  // Calculate points on a cubic Bezier curve at time t
  const calculateBezierPoint = (
    p0: { x: number; y: number },
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    p3: { x: number; y: number },
    t: number
  ) => {
    // Create midway control points for smooth transition between milestone points
    const midY = p0.y - (p0.y - p3.y) / 2;
    const cp1 = { x: p0.x, y: midY };
    const cp2 = { x: p3.x, y: midY };

    // Calculate point on curve at parameter t using the cubic Bezier formula
    return {
      x:
        Math.pow(1 - t, 3) * p0.x +
        3 * Math.pow(1 - t, 2) * t * cp1.x +
        3 * (1 - t) * Math.pow(t, 2) * cp2.x +
        Math.pow(t, 3) * p3.x,
      y:
        Math.pow(1 - t, 3) * p0.y +
        3 * Math.pow(1 - t, 2) * t * cp1.y +
        3 * (1 - t) * Math.pow(t, 2) * cp2.y +
        Math.pow(t, 3) * p3.y,
    };
  };

  // Split a cubic Bezier curve at a specific t value
  const splitCubicBezier = (
    p0: { x: number; y: number },
    p3: { x: number; y: number },
    t: number
  ) => {
    // For zigzag path with control points based on midY calculation
    const midY = p0.y - (p0.y - p3.y) / 2;
    const p1 = { x: p0.x, y: midY }; // First control point
    const p2 = { x: p3.x, y: midY }; // Second control point

    // Calculate split point
    const splitPoint = calculateBezierPoint(p0, p1, p2, p3, t);

    // Calculate intermediate control points for first segment
    const p01 = {
      x: p0.x + (p1.x - p0.x) * t,
      y: p0.y + (p1.y - p0.y) * t,
    };

    const p12 = {
      x: p1.x + (p2.x - p1.x) * t,
      y: p1.y + (p2.y - p1.y) * t,
    };

    const p23 = {
      x: p2.x + (p3.x - p2.x) * t,
      y: p2.y + (p3.y - p2.y) * t,
    };

    const p012 = {
      x: p01.x + (p12.x - p01.x) * t,
      y: p01.y + (p12.y - p01.y) * t,
    };

    const p123 = {
      x: p12.x + (p23.x - p12.x) * t,
      y: p12.y + (p23.y - p12.y) * t,
    };

    // Return paths for completed segment and remaining segment
    return {
      completed: `M ${p0.x} ${p0.y} C ${p01.x} ${p01.y}, ${p012.x} ${p012.y}, ${splitPoint.x} ${splitPoint.y}`,
      remaining: `M ${splitPoint.x} ${splitPoint.y} C ${p123.x} ${p123.y}, ${p23.x} ${p23.y}, ${p3.x} ${p3.y}`,
    };
  };

  const sentenceCase = (str: string): string => {
    if (!str) return "";
    return str
      .toLowerCase()
      .replace(/(^\w|\s\w)/g, (match) => match.toUpperCase());
  };

export {
  calculateProgressPercentage,
  generatePathSegments,
  calculateBezierPoint,
  splitCubicBezier,
  sentenceCase,
}