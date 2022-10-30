from asyncore import read

import utils

def part1():
    nums = utils.get_int_list_input('../inputs/1.txt')
    curr = nums[0]
    diffs = []
    for i in range(1, len(nums)):
        diffs.append(nums[i] - curr)
        curr = nums[i]
    return len(list(filter(lambda a : a > 0, diffs)))

def part2():
    # https://www.reddit.com/r/adventofcode/comments/r66vow/comment/hp0fbgz/?utm_source=share&utm_medium=web2x&context=3
    # Wanted to have a better way than a simple loop
    # List comprehensions are poweful, apparently
    nums = utils.get_int_list_input('../inputs/1.txt')
    sums = [ sum(w) for w in zip(nums, nums[1:], nums[2:]) ]
    pairs = zip(sums, sums[1:])
    increases = [ b - a for a,b in pairs if b > a]
    return len(increases)

print('part 1', part1())
print('part 2', part2())