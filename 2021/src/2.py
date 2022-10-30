def readInstructions():
    instructionStrings = open('../inputs/2.txt').read().split('\n')
    instructionsStringParts = [ tuple(str.split(' ')) for str in instructionStrings ]
    instructions = [(a, int(b)) for (a,b) in instructionsStringParts]
    return instructions

def part1():
    instructions = readInstructions()
    # the order doesn't seem to matter in part 1
    # solution using list comprehensions seems slow, are list comprehensions not performant?
    # applying list comprehensions, yay
    forwardValues = [ b for a,b in instructions if a == 'forward']
    upValues = [ b for a,b in instructions if a == 'up']
    downValues = [ b for a,b in instructions if a == 'down']

    return sum(forwardValues) * (sum(downValues) - sum(upValues))

def part2():
    aim = 0
    hor_pos = 0
    depth = 0
    instructions = readInstructions()
    for a,b in instructions:
        if a == 'up':
            aim = aim - b
        elif a == 'down':
            aim = aim + b
        else:
            hor_pos = hor_pos + b
            depth = aim * b + depth
    return hor_pos * depth
    
print('part 1', part1())
print('part 2', part2())
