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

def get_least_and_most_common_index(lines, index, pref_bit):
    least_and_most = ()
    chars = []
    for line in lines:
        chars.append(line[index])
    if chars.count('0') > (len(lines) / 2):
        least_and_most = ('1','0')
    elif chars.count('1') > (len(lines) / 2):
        least_and_most = ('0','1')
    else:
        least_and_most = (pref_bit, pref_bit)
    return least_and_most

def convert_bin_list_to_dec_num(bin_chars):
    return int(''.join(map(str, bin_chars)) ,2)


# try iterative first
# but would prefer recursive for this
def get_rating(lines, is_least, pref_bit):
    filtered_lines = lines
    for index in range(len(lines[0])):
        (least, most) = get_least_and_most_common_index(filtered_lines, index, pref_bit)
        bit_to_match = least if is_least else most
        filtered_lines = [ line for line in filtered_lines if line[index] == bit_to_match ]
        if len(filtered_lines) == 1:
            return filtered_lines[0]

def part1():
    lines = read_report()
    least_and_most = get_least_and_most_common(lines)
    # least common
    epsilon = convert_bin_list_to_dec_num([ a for a,_ in least_and_most])
    # most common
    gamma = convert_bin_list_to_dec_num([ b for _,b in least_and_most])
    return epsilon * gamma

def part2():
    lines = read_report()
    # get least and most for each bit
    # most -> O2
    # least -> CO2
    # keep only codes with that number in that position
    o2 = convert_bin_list_to_dec_num(get_rating(lines, False, '1'))
    co2 = convert_bin_list_to_dec_num(get_rating(lines, True, '0'))
    return o2 * co2

print('part 1', part1())
print('part 2', part2())
