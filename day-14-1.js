// const leftovers = [];

function nFuelFor(ip, totalOre, leftovers = []) {
  let nOre = totalOre;
  let i = 0;
  while (nOre >= 0){
    nOre -= calcRequiredOre(ip, leftovers);
    i++;
  }
  console.log({ nOre, i });
  if (nOre === 0) return i;
  return i - 1;
}

function calcRequiredOre(ip, leftovers = []) {
  const reactions = parseReactions(ip);
  return calculateOreFor({ name: 'FUEL', qty: 1 }, reactions, leftovers);
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
  // console.log(JSON.stringify(reactions, undefined, 2));
  
}

function calculateOreFor(chem, reactions, leftovers = []) {
  // let oreRequired = 0;
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
    // console.log({ reaction, producedOutputQty, chem, requiredInput, leftoverInput, leftoverOutput });
    if (input.name === 'ORE') {
      // console.log(leftovers);
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
  calcRequiredOre,
  nFuelFor,
}