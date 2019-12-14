function nFuelFor(reactions, totalOre) {
  let low = 0,
    high = totalOre / calcRequiredOre(reactions, 1) * 2;
  do {
    let mid = Math.floor((high+low)/2);
    const curr = calcRequiredOre(reactions, mid);
    if (curr > totalOre) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  } while (high >= low);
  return low - 1;
}

function calcRequiredOre(reactions, nFuels, leftovers) {
  return calculateOreFor({ name: 'FUEL', qty: nFuels }, reactions, leftovers);
}

function parseReactions(ip) {
  const reactionStrings = ip.split('\n').map(str => str.trim());
  return reactionStrings.map(str => {
    const [ ipStr, opStr ] = str.split('=>').map(str => str.trim());
    return {
      inputs: ipStr.split(',').map(parseChemical),
      output: parseChemical(opStr),
    }
  });
  
}

function calculateOreFor(chem, reactions, leftovers = []) {
  const reaction = reactions.find(({ output }) => output.name === chem.name);
  let leftoverOutput = leftovers.find(({ name }) => name === reaction.output.name);
  if (!leftoverOutput) {
    leftoverOutput = { name: reaction.output.name, qty: 0};
    leftovers.push(leftoverOutput);
  }

  const requiredOutput = { ...chem };
  if (leftoverOutput.qty && leftoverOutput.qty >= requiredOutput.qty) {
    requiredOutput.qty = 0;
    leftoverOutput.qty -= chem.qty;
  } else {
    requiredOutput.qty -= leftoverOutput.qty;
    leftoverOutput.qty = 0;
  }

  const nReactions = Math.ceil(requiredOutput.qty / reaction.output.qty);
  let producedOutputQty = nReactions * reaction.output.qty;

  // console.log({ leftoverOutput, nReactions, requiredOutput });
  if (!nReactions) {
    return 0;
  }
  const nOres = reaction.inputs.reduce((acc, input) => {
    let nOre;
    let leftoverInput = leftovers.find(({ name }) => name === input.name);
    if (!leftoverInput) {
      leftoverInput = { name: input.name, qty: 0 };
      leftovers.push(leftoverInput);
    }
    let requiredInput = { ...input };
    requiredInput.qty = nReactions * input.qty;
    if (leftoverInput.qty && leftoverInput.qty >= requiredInput.qty) {
      leftoverInput.qty -= requiredInput.qty;
      requiredInput.qty = 0;
    } else {
      requiredInput.qty -= leftoverInput.qty;
      leftoverInput.qty = 0;
    }
    if (input.name === 'ORE') {
      nOre = Math.ceil(chem.qty / reaction.output.qty) * input.qty;
    } else {
      nOre = calculateOreFor(requiredInput, reactions, leftovers);
    }
    return acc + nOre;
  }, 0);

  leftoverOutput.qty = Math.max(0, leftoverOutput.qty + producedOutputQty - requiredOutput.qty);
  return nOres;
}

function parseChemical(chemStr) {
  const [qty, name] = chemStr.trim().split(' ').map(str => str.trim());
  return { qty: parseFloat(qty), name };
}

module.exports = {
  parseReactions,
  calcRequiredOre,
  nFuelFor,
}