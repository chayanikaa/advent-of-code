def get_int_list_input(path):
    return list(
        map(int, open(path).read().split('\n'))
    )