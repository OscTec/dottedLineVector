const width = 800;
const height = 800;
const maxLinkDistance = 200;
const maxVelocity = 3;
const maxLinks = 3;
const pointsToGenerate = 50;
const points = [];

function setup() {
  const myCanvas = createCanvas(width, height);
  myCanvas.parent("canvas");
  background(51);
  for (let i = 0; i < pointsToGenerate; i++) points.push(generatePoint());
}

function draw() {
  background(51);
  movePoints();
  calcNearestNeighbors();
  drawLines();
  drawPoints();
}

function mouseClicked() {
  points.push(generatePoint(mouseX, mouseY));
}

const generatePoint = (xCoord = null, yCoord = null) => {
  return {
    id: points.length + 1,
    x: xCoord ? xCoord : random(0, width),
    y: yCoord ? yCoord : random(0, height),
    xVelocity: random(-maxVelocity, maxVelocity),
    yVelocity: random(-maxVelocity, maxVelocity),
    diameter: 20,
    nearestNeighbors: [],
    draw() {
      fill(color(255, 204, 0));
      circle(this.x, this.y, this.diameter);
    },
  };
};

const boundaryCalc = (itemObject) => {
  const radius = itemObject.diameter / 2;

  if (itemObject.x >= width - radius) {
    itemObject.xVelocity = -itemObject.xVelocity;
  }
  if (itemObject.x <= 0 + radius) {
    itemObject.xVelocity = -itemObject.xVelocity;
  }
  if (itemObject.y >= height - radius) {
    itemObject.yVelocity = -itemObject.yVelocity;
  }
  if (itemObject.y <= 0 + radius) {
    itemObject.yVelocity = -itemObject.yVelocity;
  }
};

const moveObject = (itemObject) => {
  itemObject.x = itemObject.x + itemObject.xVelocity;
  itemObject.y = itemObject.y + itemObject.yVelocity;
};

const euclideanDistance = (p1, p2) => {
  x = Math.pow(p1.x - p2.x, 2);
  y = Math.pow(p1.y - p2.y, 2);

  return Math.sqrt(x + y);
};

const calcNearestNeighbors = () => {
  points.forEach((point) => {
    point.nearestNeighbors = [];
    const neighbors = points.filter((p) => p.id != point.id);

    let tempNeighborsArray = [];

    neighbors.forEach((neighbor) => {
      const distance = euclideanDistance(point, neighbor);

      tempNeighborsArray.push({
        neighborObject: neighbor,
        distance,
      });
    });

    tempNeighborsArray = tempNeighborsArray.filter(
      (neighbor) => neighbor.distance < maxLinkDistance
    );

    tempNeighborsArray.sort((a, b) => a.distance - b.distance);

    const nearestNeighbors = tempNeighborsArray.slice(0, maxLinks);

    nearestNeighbors.forEach((neighbor) =>
      point.nearestNeighbors.push(neighbor.neighborObject)
    );
  });
};

const movePoints = () => {
  points.forEach((point) => {
    boundaryCalc(point);
    moveObject(point);
  });
};

const drawPoints = () => {
  points.forEach((point) => {
    point.draw();
  });
};

const drawLines = () => {
  stroke(222, 222, 222);
  strokeWeight(2);

  points.forEach((point) => {
    point.nearestNeighbors.forEach((neighbor) => {
      line(point.x, point.y, neighbor.x, neighbor.y);
    });
  });
};
