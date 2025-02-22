import { generateTags } from "./backend/services/chatgptService.js";

// Sample idea title and description
const testIdea = {
    title: "Automatic Paper Grader",
    description: "A grading machine that will automatically grade papers for teachers."
};

async function testTagGeneration() {
    try {
        console.log("Generating tags for:", testIdea.title);
        
        const tags = await generateTags(testIdea.title, testIdea.description);
        
        console.log("Generated Tags:", tags);
    } catch (error) {
        console.error("Error generating tags:", error);
    }
}

testTagGeneration();