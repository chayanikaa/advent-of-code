import { promises as fs } from 'fs';
import { toEditorSettings } from 'typescript';

async function readAnswers() {
  const buffer = await fs.readFile('inputs/6.txt');
  const str = buffer.toString();
  let groupStrings = str.split('\n\n');
  return groupStrings.map(groupStr => {
    const groupParts = [ ...groupStr.split('\n') ];
    const nonFlatArr = [ ...groupParts.map(groupPart => groupPart.split('')) ];
    console.log(nonFlatArr)
    return nonFlatArr;
  });
}

readAnswers().then(answerArrs => {
  const sizes = answerArrs.map(answerArr => {
    const everyoneYesSet = new Set(answerArr[0]);
    answerArr.forEach((groupAnswers, i) => {
      if (i === 0) {
        return;
      }
      const toRemove: string[] = [];
      everyoneYesSet.forEach(answer => {
        if (!groupAnswers.includes(answer)) {
          toRemove.push(answer);
        }
      });
      toRemove.forEach(answer => {
        if (everyoneYesSet.has(answer)) {
          everyoneYesSet.delete(answer);
        }
        
      });
    });
    return everyoneYesSet.size;

  });
  console.log(sizes.reduce((acc, cur) => acc + cur, 0));
});