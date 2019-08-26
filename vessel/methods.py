# bay_index to num
def index_to_num(bay_list):
    arr = []
    if len(bay_list) == 0:
        return arr
    for i in bay_list:
        if i[0] == '0':
            i = int(i[1])
        else:
            i = int(i)
        arr.append(i)
    return arr


# single bayIndex to num
def single_index_to_num(index):
    if index[0] == '0':
        return int(index[1])
    else:
        return int(index)


# num to bay_index
def num_to_index(val):
    if val < 10:
        return '0'+str(val)
    else:
        return str(val)


def combined_bay_list(bay_inch20s, bay_inch40s):
    bay_list = []
    count = 0
    count_no_com = 0
    is_jump = False
    if len(bay_inch40s) == 0:
        for n in bay_inch20s:
            count_no_com += 1
            bay_list.append({
                'id': count_no_com,
                'type': "single",
                'bayInch20': [
                    {
                        'index': num_to_index(n),
                    }
                ],
            })
    else:
        for i in bay_inch20s:
            if is_jump:
                is_jump = False
                continue
            for j in bay_inch40s:
                if i + 1 == j:
                    count += 1
                    bay_list.append(
                        {
                            'id': count,
                            'type': "combine",
                            'bayInch20s': [
                                {
                                    'index': num_to_index(j - 1),
                                },
                                {
                                    'index': num_to_index(j + 1),
                                },
                            ],
                            'bayInch40': [
                                {
                                    'index': num_to_index(j),
                                },
                            ],
                        },
                    )
                    is_jump = True
                    break
                elif j == bay_inch40s[-1] and i != j:
                    count += 1
                    bay_list.append({
                        'id': count,
                        'type': "single",
                        'bayInch20': [
                            {
                                'index': num_to_index(i),
                            }
                        ],
                    })
                    break
                else:
                    continue
    return bay_list

# print('\n'.join('{}: {}'.format(*k) for k in enumerate(combined_bay_list(test_a, test_b))))


# index: min to max
def create_engine_index(eng_pos, eng_wid):
    if eng_pos % 2 == 0 or eng_pos < 0:
        print("engine_position is illegal!")
        return False
    else:
        temp_list = []
        eng_body_list = []
        for k in range(0, eng_wid):
            real_num = 2*k + eng_pos
            temp_list.append(real_num)
        for m in temp_list:
            eng_body_list.append(m)
        return eng_body_list


def create_index_list(max_lay_num):
    lay_list = []
    for i in range(0, max_lay_num):
        lay_list.append(num_to_index((i+1)*2))
    return lay_list


def bay_num_to_index_list(max_bay_num):
    bay_list = []
    if max_bay_num > 50:
        return []
    for a in range(0, max_bay_num*2-1, 1):
        temp_index = num_to_index(a + 1)
        bay_size = bay_index_to_bay_size(temp_index)
        bay_list.append({'index': temp_index, 'size': bay_size})
    return bay_list


def bay20_num_index_list(max_bay_num):
    index_list = []
    if max_bay_num > 50:
        return []
    for c in range(0, max_bay_num, 1):
        bay_index = num_to_index((c+1)*2-1)
        index_list.append(bay_index)
    return index_list


def bay_index_to_bay_size(val):
    temp = single_index_to_num(val)
    if temp % 2 == 0:
        return '40'
    else:
        return '20'


# one layer
def layer_con_list_to_db(con_list):
    list_len = len(con_list)
    if list_len % 2 == 0:
        lay_str = ''
        count = 0
        for i in con_list:
            count += 1
            if count == int(list_len / 2)+1:
                lay_str += '#'
            lay_str += i
        return lay_str
    else:
        lay_str = ''
        count = 0
        for j in con_list:
            count += 1
            if count == int(list_len / 2)+1:
                if j == '1':
                    lay_str += '*'
                else:
                    lay_str += '#'
                continue
            lay_str += j
        return lay_str


def db_layer_info_to_list(items):
    lay_info = []
    for i in items:
        if i == '1' or i == '*':
            lay_info.append('1')
        else:
            if i == '#':
                continue
            lay_info.append('0')
    return lay_info


def get_bay_width(items):
    count = 0
    for i in items:
        if i == '1' or i == '*':
            count += 1
    return count


# test area
# print(bay20_num_index_list(0))