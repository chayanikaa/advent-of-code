// 3

import { inputAsArray } from './utils/util';

interface Position {
  ship: {
    x: number,
    y: number,
  };
  waypoint: {
    x: number,
    y: number,
  }
}

function calculateNewWaypointPosition(pos: Position, angle: number) {
  const radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians);
        
  let newPosition: Position = JSON.parse(JSON.stringify(pos));
  newPosition.waypoint = {
    x: cos * pos.waypoint.x + sin * pos.waypoint.y,
    y: cos * pos.waypoint.y - sin * pos.waypoint.x
  };
  return newPosition;
}

function moveShip(start: Position, instruction: string): Position {
	const action = instruction[0];
  const value = +instruction.substring(1);
	let newPosition = JSON.parse(JSON.stringify(start));
	switch (action) {
		case 'N':
			newPosition.waypoint.y -= value;
			break;
		case 'S':
			newPosition.waypoint.y += value;
			break;
		case 'E':
			newPosition.waypoint.x += value;
			break;
		case 'W':
			newPosition.waypoint.x -= value;
			break;
		case 'L':
      newPosition = calculateNewWaypointPosition(start, value);
			break;
		case 'R':
			newPosition = calculateNewWaypointPosition(start, -value);
      break;
    case 'F':
      newPosition.ship.x += start.waypoint.x * value;
      newPosition.ship.y += start.waypoint.y * value;
      break;
    default:
			console.log('Invalid Action!');
      break;
  }
  return newPosition;
}

function executeInstructions(start: Position, instructions: string[]): Position {
  let currPosition = start;
  instructions.forEach(instruction => {
    currPosition = moveShip(currPosition, instruction);
  });
  
  return currPosition;
}

function getManhattanDistance(pos1: Position, pos2: Position): number {
  return Math.abs(pos2.ship.x - pos1.ship.x) + Math.abs(pos2.ship.y - pos1.ship.y);
}

inputAsArray('inputs/12.txt').then(inputs => {
  const start: Position = {
    ship: {
      x: 0, y: 0,
    },
    waypoint: {
      x: 10, y: -1
    }
  };
  console.time();
  console.log('Part 2', getManhattanDistance(start,
    executeInstructions(start, inputs)));
  console.timeEnd();
});