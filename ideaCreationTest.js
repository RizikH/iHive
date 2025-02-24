const User = require("./backend/models/User"); // Import User model
const supabase = require("./backend/config/db"); // Import Supabase client

const createNewIdea = async () => {
    const userId = "2625c67a-06c1-462c-8f92-6703f38e092e"; // Manually provided user ID

    try {
        // Step 1: Fetch the user object
        const user = await User.getUserById(userId);
        if (!user) {
            throw new Error("User not found.");
        }

        // Step 2: Get the user's Supabase Auth session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !sessionData || !sessionData.session) {
            throw new Error("❌ No active Supabase session found. Please log in.");
        }

        // Step 3: Extract the Supabase Auth token
        const authToken = sessionData.session.access_token;

        // Step 4: Construct the idea object
        const newIdea = {
            title: "AI-Powered Idea Repository",
            description: "An online GitHub-inspired repo for innovators and investors. Like a virtual Shark Tank.",
            category: "AI-Powered"
        };

        // Step 5: Send the API request with Supabase Auth token
        const response = await fetch("http://localhost:5000/api/ideas/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}` // Pass Supabase token for authentication
            },
            body: JSON.stringify(newIdea)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to create idea. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Idea created successfully:", data);
    } catch (error) {
        console.error("❌ Error creating idea:", error.message);
    }
};

// Run test
createNewIdea();
