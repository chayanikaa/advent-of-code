const maxNum = 1000000;

interface Node {
	next?: Node;
	previous?: Node;
	value: number;
}

function playMove2(nodeList: Node[], node: Node, min = 1, max = maxNum): Node {
	const nextNodes: Node[] = [];
	let i = 0;
	let prev = node;
	while (i <= 2) {
		nextNodes.push(prev.next as Node);
		prev = prev.next as Node;
		i++;
	}

	let targetDest = node.value - 1;

	let destNode;
	while (!destNode) {
		if (targetDest < min) {
			targetDest = max;
		}
		if (nextNodes.includes(nodeList[targetDest])) {
			targetDest--;
		} else {
			destNode = nodeList[targetDest];
		}
	}
	node.next = nextNodes[2].next;
	nextNodes[2].previous = node;
	nextNodes[0].previous = destNode;
	nextNodes[2].next = destNode.next;
	destNode.next = nextNodes[0];
	destNode.next.previous = nextNodes[2];

	return node.next as Node;

}

function part2() {
	const inputStr = '562893147';
	let input = inputStr.split('').map(l => +l);

	const start: Node = {
		value: input[0],
	};

	let prev = start;

	const nodeList: Node[] = [];

	nodeList[prev.value] = prev;
	
	input.slice(1).forEach(num => {
		const node: Node = {
			value: num,
		};
		prev.next = node;
		node.previous = prev;
		prev = node;
		nodeList[num] = node;
	});
	let numI = Math.max(...input) + 1;
	while (numI <= maxNum) {
		const node: Node = {
			value: numI,
		};
		prev.next = node;
		node.previous = prev;
		prev = node;
		nodeList[numI] = node;
		numI++;
	}

	prev.next = start;
	start.previous = prev;

	let i = 0, node = nodeList[input[0]];
	while (i < 10000000) {
		node = playMove2(nodeList, node);
		i++;
		
	}

	const next = (nodeList[1].next && nodeList[1].next.value) as number;
	const nextnext = (nodeList[1].next && nodeList[1].next.next && nodeList[1].next.next.value) as number;
	

	console.log('Part 2', next * nextnext);

}

function printList(node: Node) {
	const values = [node.value];
		let currNode = node.next as Node;

		while (currNode !== node) {
			// console.log(currNode)
			values.push(currNode.value);
			currNode = currNode.next as Node;
		}

	console.log(values.join(','));
}


part2();