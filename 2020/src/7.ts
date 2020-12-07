import { promises as fs } from 'fs';

interface QBag {
  color: string,
  qty: number | null,
}

interface Rule {
  container: string;
  contained: QBag[];
}

async function readInput() {
  const buffer = await fs.readFile('inputs/7.txt');
  const str = buffer.toString();
  let parts = str.split('\n');
  return parts;
}

function parseInput(input: string[]): Rule[] {
  return input.map(ip => {
    const split = ip.split(' contain ');
    const containedStr = split[1].split(',');
    const contained = containedStr.map(str => {
      const trimmed = str.trim();
      const qty = parseInt(str, 10);
      const color = trimmed
        .replace(/^[0-9]*/, '')
        .replace(/bag(s)?/, '')
        .replace('.', '')
        .trim();
      return {
        qty: isNaN(qty) ? null : qty,
        color,
      }
    });
    return {
      container: split[0].replace(' bags', ''),
      contained,
    }
  });
}

function findParents(rules: Rule[], child: string) {
  let newParents: string[] = [];
  rules.forEach(rule => {
    const present = rule.contained.find(contained => {
      return contained.color === child;
    });
    if (present) {
      newParents.push(rule.container);
      newParents = [ ...newParents, ...findParents(rules, rule.container)];
    }
  });

  return Array.from(new Set(newParents));
}

function findChildren(rules: Rule[], parent: string, multiplier = 0) {
  let nChildren = 0;
  const rule = rules.find(rule => rule.container === parent);
  if (rule) {
    rule.contained.forEach(contained => {
      if (contained.qty) {
        nChildren += contained.qty * multiplier;
        nChildren += findChildren(rules, contained.color, contained.qty * multiplier);
      }
    });
  }

  return nChildren;
}

readInput().then((inputs) => {
  const rules = parseInput(inputs);
  console.log('Part 1', findParents(rules, 'shiny gold').length);
  console.log('Part 2', findChildren(rules, 'shiny gold', 1));
})