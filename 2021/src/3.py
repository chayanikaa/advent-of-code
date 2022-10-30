def read_report():
    lines = open('../inputs/3.txt').read().split('\n')
    return lines

def get_least_and_most_common(lines):
    least_and_most = []
    for index in range(len(lines[0])):
        chars = []
        for line in lines:
            chars.append(line[index])
        if chars.count('0') > (len(lines) / 2):
            least_and_most.append(('1','0'))
        else:
            least_and_most.append(('0','1'))
    return least_and_most

def convert_bin_list_to_dec_num(bin_chars):
    return int(''.join(map(str, bin_chars)) ,2)


def part1():
    lines = read_report()
    least_and_most = get_least_and_most_common(lines)
    # least common
    epsilon = convert_bin_list_to_dec_num([ a for a,_ in least_and_most])
    # most common
    gamma = convert_bin_list_to_dec_num([ b for _,b in least_and_most])
    return epsilon * gamma

    
# print('part 1', part1())
print('part 1', part1())
