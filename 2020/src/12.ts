// 3
import { get } from 'https';
import { inputAsArray } from './utils/util';

interface Position {
  x: number;
  y: number;
  direction: number;
}

const directions: any = {
  '0': 'N',
  '90': 'E',
  '180': 'S',
  '270': 'W',
};

function moveShip(start: Position, instruction: string): Position {
	const action = instruction[0];
  const value = +instruction.substring(1);
  console.log({ instruction, action, value });
	let newPosition = { ...start };
	switch (action) {
		case 'N':
			newPosition.y -= value;
			break;
		case 'S':
			newPosition.y += value;
			break;
		case 'E':
			newPosition.x += value;
			break;
		case 'W':
			newPosition.x -= value;
			break;
		case 'L':
			newPosition.direction -= value;
			break;
		case 'R':
			newPosition.direction += value;
      break;
    case 'F':
      const direction = directions[newPosition.direction];
      const newInstruction = `${direction}${value}`;
      newPosition = moveShip(start, newInstruction);
      break;
    default:
			console.log('Invalid Action!');
      break;
  }
  if (newPosition.direction < 0) {
    newPosition.direction += 360;
  } else {
    newPosition.direction %= 360;
  }
  return newPosition;
}

function executeInstructions(start: Position, instructions: string[]): Position {
  let currPosition = start;
  instructions.forEach(instruction => {
    currPosition = moveShip(currPosition, instruction);
    console.log({currPosition })
  });
  
  return currPosition;
}

function getManhattanDistance(pos1: Position, pos2: Position): number {
  return Math.abs(pos2.x - pos1.x) + Math.abs(pos2.y - pos1.y);
}


inputAsArray('inputs/12.txt').then(inputs => {
  console.time();
  console.log('Part 1', getManhattanDistance({x: 0, y: 0, direction: 90}, executeInstructions({
    x: 0,
    y: 0,
    direction: 90,
  }, inputs)));
  console.timeEnd();
  console.time();
  // console.log('Part 2', simulateTillStabilize(inputs));
  console.timeEnd();
});