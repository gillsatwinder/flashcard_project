const fs = require("fs/promises");
const OpenAI = require("openai");
const pdfParse = require('pdf-parse');
const cardFunctions = require('./cardFunctions');
const Card = require('../models/Card');
require('dotenv').config({ path: '../../.env' });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


exports.generateFlashcards = async (req, res) => {
    try {
        const { numFlashcards, deckID, userEmail } = req.body;
        const pdfPath = req.file?.path;


        if (!pdfPath) {
            return res.status(400).json({ error: "No PDF file uploaded." });
        }

        const pdfBuffer = await fs.readFile(pdfPath);
        const pdfData = await pdfParse(pdfBuffer);
        const pdfText = pdfData.text;

        const response = await openai.chat.completions.create({
            model: process.env.GPT_MODEL,
            messages: [
                {
                    role: "system",
                    content: `You are a helpful assistant that creates flashcards from text content.
                              Given text content, generate ${numFlashcards || 10} flashcards.
                              Return ONLY a valid JSON array of flashcard objects like this:
                              [
                                {
                                    "question": "short statement or question",
                                    "answer": "concise explanation or elaboration"  
                                },
                                {
                                    "question": "another question",
                                    "answer": "another answer"
                                }
                              ]
                              Make sure to return an ARRAY, not a single object.`
                },


                {
                    role: "user",
                    content: `Generate ${numFlashcards || 10} flashcards from this text: ${pdfText}`
                }
            ],
            temperature: 0.7
        });

        const textOutput = response.choices[0].message.content.trim();

        let flashcards;


        try {
            flashcards = JSON.parse(textOutput);

            if (!Array.isArray(flashcards)) {
                flashcards = [flashcards];
            }

        } catch {
            return res.status(500).json({
                error: "Model did not return valid JSON.",
                raw: textOutput
            });
        }


        const savedCards = [];
        for (let i = 0; i < flashcards.length; i++) {
            const flashcard = flashcards[i];

            const cardData = { 
                cardID: Date.now() + i, 
                deckID: deckID, 
                userEmail: userEmail, 
                qSide: flashcard.question, 
                aSide: flashcard.answer
            };

            try { const card = new Card(cardData);   const savedCard = await card.save();   savedCards.push(savedCard);
            } catch (error) {
                console.error("Error saving card:", error);
            }
        }



        console.log("Final flashcards being sent:", flashcards); // Add this line
        res.json({ flashcards });

        await fs.unlink(pdfPath); // cleanup

    } catch (err) {
        console.error("Flashcard generation error:", err);
        res.status(500).json({ error: "Failed to generate flashcards." });
    }
};
