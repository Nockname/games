# RESTRICTIONS ON DIFFERENT WORDS
# These are functions to be used when assessing whether words are valid

import string

def len6(x):
    return len(x) == 6

def ln(n):
    return lambda x: len(x) == n

# only allows word to end in s if it ends in ss
def no_s(x):
    if x[-1] != 's': return True
    return x[-2] == 's'

def no_er(x):
    return x[-2:] != 'er'

def no_ed(x):
    return x[-2:] != 'ed'

def no_ing(x):
    return x[-3:] != 'ing'

def no_punctuation(x):
    for punc in string.punctuation:
        if punc in x: return False
    return True

def no_comments(x):
    if x[0] == "#": return False
    return True

def lower_case_roman(x):
    for letter in x:
        if letter not in string.ascii_lowercase: return False
    return True