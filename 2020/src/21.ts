import { inputAsArray } from './utils/util';

interface Food {
	ingredients: string[];
	allergens: string[];
}

interface Data {
	foods: Food[];
	allergens: string[];
	ingredients: string[];
}

function parseInput(arr: string[]): Data {
	const allergens: string[] = [];
	const ingredients: string[] = [];
	const foods = arr.map((str) => {
		const [ingStr, allStr] = str.split(' (contains ');
		const food = {
			ingredients: ingStr.split(' '),
			allergens: allStr.replace(')', '').split(', '),
		};
		ingredients.push(...food.ingredients);
		allergens.push(...food.allergens);
		return food;
	});

	return {
		foods,
		allergens: Array.from(new Set(allergens)),
		ingredients: Array.from(new Set(ingredients)),
	};
}

function findAllergenContainers(data: Data) {
	const result: Record<string, string[]> = {};
	const finalResult: Record<string, string> = {};

	data.allergens.forEach((allergen) => {
		const foods = data.foods;
		const allergenContainers: Set<string> = new Set(
			(foods.find((food) => food.allergens.includes(allergen)) as Food).ingredients
		);
		Object.values(result).forEach((container) => {
			if (container.length === 1) {
				allergenContainers.delete(container[0]);
			}
		});
		let i = 0;
		while (allergenContainers.size > 1 && i < foods.length) {
			if (foods[i].allergens.includes(allergen)) {
				const newIngredients = foods[i].ingredients;
				const toDelete: string[] = [];
				allergenContainers.forEach((allergenContainer) => {
					if (!newIngredients.includes(allergenContainer)) {
						toDelete.push(allergenContainer);
					}
				});
				toDelete.forEach((ing) => allergenContainers.delete(ing));
			}
			i++;
		}
		allergenContainers.forEach(
			(container) => (result[allergen] = result[allergen] ? [...result[allergen], container] : [container])
		);
	});

	while (Object.keys(result).length !== Object.keys(finalResult).length) {
		Object.entries(result).forEach(([allergen, containers], i) => {
			if (containers.length === 1) {
				finalResult[allergen] = containers[0];
			} else {
				result[allergen] = result[allergen].filter(
					(container) => !Object.values(finalResult).includes(container)
				);
			}
		});
	}

	return finalResult;
}

inputAsArray('inputs/21.txt').then((arr) => {
	const foods = parseInput(arr);
	const result = findAllergenContainers(foods);
	const allergenFoods = new Set(Object.values(result));
	const noAllergenFoods = foods.ingredients.filter((ingredient) => {
		return !allergenFoods.has(ingredient);
	});

	let count = noAllergenFoods.reduce((acc, allergen) => {
		return (
			acc +
			foods.foods.reduce((acc, food) => {
				if (food.ingredients.includes(allergen)) {
					return (acc += 1);
				}
				return acc;
			}, 0)
		);
	}, 0);

	const sortedAllergens = Object.keys(result).sort();

	const canList = sortedAllergens.map((all) => result[all]).join(',');

  console.log('Part 1', count);
  console.log('Part 2', canList);

});
