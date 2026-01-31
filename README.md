# 👻 Ghost Tac Toe

It's Tic-Tac-Toe but the pieces disappear so you actually have to use your brain.

I made this because I was bored of regular Tic-Tac-Toe ending in a draw every single time.

## 🤷‍♂️ What is this?

You know how in regular Tic-Tac-Toe you just place X's and O's until the grid is full? Yeah, that's boring.

In **Ghost Tac Toe**, you can only have **3 pieces** on the board. If you place a 4th one, your first one disappears. It's a FIFO queue (First In, First Out).

Basically, the game never ends until someone messes up.

## 🎲 Features 

* **The "Ghost" Mechanic:** Pieces fade away after 3 turns. It completely breaks your brain.
* **AI That Is Actually Cracked:**
    * **Easy:** Just picks random spots. Basically a toddler.
    * **Normal:** It tries, but you can beat it.
    * **Hard:** Calculates 6 moves ahead. It sweats.
    * **Impossible:** I added Alpha-Beta pruning to the Minimax algorithm (don't ask me to explain it fully, I just know it works). It looks 8 moves into the future. Good luck.
* **PvP Mode:** Play with a friend on the same device.
* **Visuals:**
    * The background does this cool retro wave thing (WebGL shader I found).
    * When you click, particles explode (Barely noticable).
    * Everything is neon because Cyberpunk aesthetic > boring white background.

## 🛠️ Tech Stack (How I built it)

* **React:**
* **Vite:** 
* **Tailwind CSS:** "Google how to center div"
* **Framer Motion:** From reactbits.dev

## 🐛 Known Bugs

* If you play on "Impossible" mode, your computer might get slightly warmer because the AI is thinking really hard.
* Sometimes the background wave looks weird on mobile. It's a feature, not a bug.\
