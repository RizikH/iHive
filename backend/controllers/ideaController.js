const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Get all ideas
exports.getAllIdeas = async (req, res) => {
    try {
        const { data: ideas, error } = await supabase
            .from('ideas')
            .select('*');
        if (error) throw error;
        res.json(ideas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new idea
exports.createIdea = async (req, res) => {
    try {
        const { data: newIdea, error } = await supabase
            .from('ideas')
            .insert([req.body])
            .single();
        if (error) throw error;
        res.status(201).json(newIdea);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get an idea by ID
exports.getIdeaById = async (req, res) => {
    try {
        const { data: idea, error } = await supabase
            .from('ideas')
            .select('*')
            .eq('id', req.params.id)
            .single();
        if (error) throw error;
        if (!idea) return res.status(404).json({ message: 'Idea not found' });
        res.json(idea);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an idea by ID
exports.updateIdea = async (req, res) => {
    try {
        const { data: idea, error } = await supabase
            .from('ideas')
            .update(req.body)
            .eq('id', req.params.id)
            .single();
        if (error) throw error;
        if (!idea) return res.status(404).json({ message: 'Idea not found' });
        res.json(idea);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an idea by ID
exports.deleteIdea = async (req, res) => {
    try {
        const { data: idea, error } = await supabase
            .from('ideas')
            .delete()
            .eq('id', req.params.id)
            .single();
        if (error) throw error;
        if (!idea) return res.status(404).json({ message: 'Idea not found' });
        res.json({ message: 'Idea deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};