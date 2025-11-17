const fs = require("fs/promises");
const OpenAI = require("openai");
const pdfParse = require('pdf-parse');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


/**
 * Accepts a PDF and number of flashcards, returns flashcard JSON.
 */
exports.generateFlashcards = async (req, res) => {
    try {
        const { numFlashcards } = req.body;
        const pdfPath = req.file?.path;


        if (!pdfPath) {
            return res.status(400).json({ error: "No PDF file uploaded." });
        }

        const pdfBuffer = await fs.readFile(pdfPath);
        const pdfData = await pdfParse(pdfBuffer);
        const pdfText = pdfData.text;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Use "gpt-4o" for higher quality
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

        console.log("Final flashcards being sent:", flashcards); // Add this line
        res.json({ flashcards });

        await fs.unlink(pdfPath); // cleanup

    } catch (err) {
        console.error("Flashcard generation error:", err);
        res.status(500).json({ error: "Failed to generate flashcards." });
    }
};
