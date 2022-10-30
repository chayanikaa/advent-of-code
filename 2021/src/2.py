def part1():
    instructionStrings = open('../inputs/2.txt').read().split('\n')
    instructions = [ tuple(str.split(' ')) for str in instructionStrings ]
    # the order doesn't seem to matter in part 1
    # solution using list comprehensions seems slow, are list comprehensions not performant?
    # applying list comprehensions, yay
    forwardValues = [ int(b) for a,b in instructions if a == 'forward']
    upValues = [ int(b) for a,b in instructions if a == 'up']
    downValues = [ int(b) for a,b in instructions if a == 'down']

    return sum(forwardValues) * (sum(downValues) - sum(upValues))

print(part1())
