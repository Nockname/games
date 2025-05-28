# Add Letter

Play **ADD LETTER**, a New-York-Times-inspired website for daily games at [games.nicholashagedorn.com](https://games.nicholashagedorn.com).

## Rules

Each day consists of three puzzles of increasing difficulty. You are given three to five letters, depending on the level, and asked to find the two six-letter English words formed by inserting, without rearranging, additional letters into the existing sequence. For example, **GRUND** can be turned into **GERUND** or **GROUND** by adding an **E** or **O**. Similarly, **EUK** can be transformed into **EUREKA** or **SQUEAK**.

## Design

The website's code is found in `/add_letter`, and the programs to generate the puzzle clue's and answers can be found in `/generate`. The latter requires supplying your own word dictionary.