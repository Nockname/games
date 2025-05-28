from WordRestrictions import *
from rich import print
from curses. ascii import isupper
from random import shuffle
import json


class FillIn:
    
    def __init__(self, words, word_restrictions = [], frequency_restrictions = []) -> None:
        
        # create self.words, a set of all words that satisfy every restriction in restrictions
        self.words = []
        self.all_words = words
        
        for number, word in enumerate(words):
            passes_restriction = True
            
            for restriction in word_restrictions:
                if not restriction(word): 
                    passes_restriction = False
                    break
            if not passes_restriction:
                continue
            
            for restriction in frequency_restrictions:
                if not restriction(number): 
                    passes_restriction = False
                    break
            if not passes_restriction:
                continue
            
            self.words.append(word)
            
    def getWords(self):
        return self.words
    
    # returns [String] which are all possible words that are smaller than the inputted word
    @staticmethod
    def diminishWord(word):
        
        s = []
        for i in range(len(word)):
            dim = word[:i] + word[i+1:]
            if len(s) == 0 or s[-1][0] != dim:
                s.append((dim, i))
                
        return s
            
    # returns dictionary mapping n-1 length strings to a set of length n words that reduce to said string
    def takeAwayLetter(self):
        
        # dictionary; keys are n-1 length string, value is set of length n valid words with one extra letter
        d = dict()
        
        for word in self.words:
            for diminished in self.diminishWord(word):
                if diminished[0] not in d:
                    d[diminished[0]] = []
                d[diminished[0]].append((word, diminished[1]))
            
        return d
    
    # returns dictionary mapping n-2 length strings to a set of length n words that reduce to said string
    def takeAwayTwoLetters(self):
        
        # dictionary; keys are n-1 length string, value is set of length n valid words with one extra letter
        d = dict()
        
        for word in self.words:
            for diminished1 in self.diminishWord(word):
                for diminished2 in self.diminishWord(diminished1[0]):
                    if diminished2[1] >= diminished1[1]: continue
                    if diminished2[0] not in d:
                        d[diminished2[0]] = []
                    d[diminished2[0]].append((word, diminished1[1], diminished2[1]))
            
        return d
    
    
    # returns dictionary mapping n-2 length strings to a set of length n words that reduce to said string
    def takeAwayThreeLetters(self):
        
        # dictionary; keys are n-1 length string, value is set of length n valid words with one extra letter
        d = dict()
        
        for word in self.words:
            for diminished1 in self.diminishWord(word):
                for diminished2 in self.diminishWord(diminished1[0]):
                    if diminished2[1] >= diminished1[1]: continue
                    for diminished3 in self.diminishWord(diminished2[0]):
                        if diminished3[1] >= diminished2[1]: continue
                        if diminished3[0] not in d:
                            d[diminished3[0]] = []
                        d[diminished3[0]].append((word, diminished1[1], diminished2[1], diminished3[1]))
            
        return d
    
    # scoring metric for sorting words
    @staticmethod
    def score(dim, dic):
        s = dic[dim]
        
        # if one letter change
        # if len(s[0]) == 2:
        return (3*len(dim) - (s[0][1] + s[1][1])) * (abs(s[0][1]-s[1][1]))
               
    def printCombinations(self):
        d = self.takeAwayLetter()
        all = []
        for dim in d:
            if len(d[dim]) == 2 and dim not in self.all_words and self.score(dim, d) > 0: 
                all.append(dim)
            
        # all.sort(key=lambda x: self.score(x, d))
        shuffle(all)

        for i in range(max(20, len(all))):
            dim = all[i]
            # print(f"{(dim.upper())} ({self.score(dim, d)})): {d[dim]}")
            print(f"{(dim.upper())}: ______\t______\t\t{d[dim][0][0].upper()} {d[dim][1][0].upper()}")
            
    def playGame(self):
        d = self.takeAwayLetter()
        all = []
        for dim in d:
            if len(d[dim]) == 2 and dim not in self.all_words and self.score(dim, d) >= 15: 
                all.append(dim)
        
        shuffle(all)

        for i in range(len(all)):
            dim = all[i]
            # print(f"{(dim.upper())} ({self.score(dim, d)})): {d[dim]}")
            print(f"{(dim.upper())}: ______\t______")
            print("       ", end="")
            ans1 = input().strip().upper()
            if ans1 == d[dim][0][0].upper() or ans1 == d[dim][1][0].upper():
                print("Correct!")
            else:
                print("So close!")
            
            print("            \t", end="")
            ans2 = input().strip().upper()
            if (ans2 == d[dim][0][0].upper() or ans2 == d[dim][1][0].upper()) and ans1 != ans2:
                print("Correct!")
            else:
                print("So close!")
            
            
            print(f"       {d[dim][0][0].upper()}\t{d[dim][1][0].upper()}")
            
    def makeJSON(self, file_name, letters_gone, options = 2, min_score = 15):
        if letters_gone == 1:
            d = self.takeAwayLetter()
        if letters_gone == 2:
            d = self.takeAwayTwoLetters()
        if letters_gone == 3:
            d = self.takeAwayThreeLetters()
        all = []
        for dim in d:
            if len(d[dim]) == options and dim not in self.all_words and self.score(dim, d) >= min_score: 
                all.append([dim, d[dim]])
                
        shuffle(all)
        
        json_object = json.dumps(all, indent=4)
        with open(f"{file_name}.json", "w") as outfile:
            outfile.write(json_object)

        
        

if __name__ == '__main__':
    word_file = open("../usa.txt", 'r')
    words = word_file.read().split("\n")[:-1]
    
    WC = FillIn(words, [len6, no_s, no_er, no_ed, no_ing, no_punctuation])
    
    d = WC.playGame()