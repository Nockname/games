from FillIn import *

title = "words_alpha"
title = "wiki-100k"
title = "usa"

word_file = open(f"../{title}.txt", 'r')
words = word_file.read().split("\n")[:-1]

ran = False
mn = 00000
mx = 50000

if ran:
    WC = FillIn(words, [len6, no_s, no_er, no_ed, no_ing, no_punctuation, no_comments, lower_case_roman], [lambda x: mn < x and x < mx])
    d = WC.makeJSON(f"2_{mn}-{mx}_Wiki100k", 2, 10)
    
else: 
    WC = FillIn(words, [len6, no_s, no_er, no_ed, no_ing, no_punctuation, no_comments, lower_case_roman])
    d = WC.makeJSON(f"2_SUBTRACT3_{title}", 3, 2, 0)