import { TRIANGULATION, THRESHOLD } from '../constants/face-mesh.constant';

// Vẽ tam giác
const drawPath = (ctx, points, closePath) => {
  const region = new Path2D();
  region.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    region.lineTo(point[0], point[1]);
  }
  if (closePath) region.closePath();
  ctx.strokeStyle = 'grey';
  ctx.stroke(region);
};

// Vẽ mesh trên khuôn mặt
export const drawMesh = (predictions, ctx) => {
  if (predictions.length === 0) return;
  predictions.forEach((prediction) => {
    const keypoints = prediction.scaledMesh;

    // Vẽ tam giác từ các điểm landmark
    for (let i = 0; i < TRIANGULATION.length / 3; i++) {
      const points = [
        TRIANGULATION[i * 3],
        TRIANGULATION[i * 3 + 1],
        TRIANGULATION[i * 3 + 2],
      ].map((index) => keypoints[index]);
      drawPath(ctx, points, true);
    }

    // Vẽ các điểm landmark
    keypoints.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, 3 * Math.PI);
      ctx.fillStyle = 'aqua';
      ctx.fill();
    });
  });
};

// Chuyển toàn bộ keypoint thành vector đặc trưng phẳng
export const getFeatureVector = (landmarks) => {
  return landmarks.flat(); // [x1, y1, z1, x2, y2, z2, ...]
};

// Chuẩn hóa vector để loại bỏ ảnh hưởng của khoảng cách
export const normalizeVector = (vec) => {
  const norm = Math.sqrt(vec.reduce((acc, val) => acc + val * val, 0));
  return vec.map((v) => v / norm);
};

// Khoảng cách Euclid giữa hai vector
export const euclideanDistance = (vec1, vec2) => {
  return Math.sqrt(vec1.reduce((acc, val, index) => acc + Math.pow(val - vec2[index], 2), 0));
};

// So khớp với danh sách vector đã lưu
export const findBestMatch = (queryVector, knownFaces, threshold = THRESHOLD) => {
  let bestMatch = null;
  let minDistance = Infinity;

  for (const person of knownFaces) {
    const distance = euclideanDistance(queryVector, person.vector);
    if (distance < minDistance) {
      minDistance = distance;
      bestMatch = { name: person.name, distance };
    }
  }

  if (minDistance < threshold) return bestMatch;
  return null;
};
