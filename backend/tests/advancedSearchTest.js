const fetch = require('node-fetch');

const advancedSearchTags = async () => {
    const tags = [
        { id: 9, name: "innovation" },
        { id: 10, name: "creativity" },
        { id: 11, name: "concept" }
    ];

    try {
        const response = await fetch('http://localhost:5000/api/ideas/search/tags', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tags })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch ideas: ${errorText}`);
        }

        const ideas = await response.json();
        console.log("Fetched Ideas:", ideas);
    } catch (error) {
        console.error("Error fetching ideas:", error.message);
    }
};

advancedSearchTags();