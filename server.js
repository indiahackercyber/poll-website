const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Database Connection (Replace with your MongoDB URI)
mongoose.connect('mongodb://localhost/pollsite', { useNewUrlParser: true, useUnifiedTopology: true });

// Poll Model
const pollSchema = new mongoose.Schema({
    question: String,
    options: [String],
    votes: { type: [Number], default: [0, 0, 0, 0] }, // Default 4 options
    correctAnswer: Number // Index of the correct answer (if quiz)
});
const Poll = mongoose.model('Poll', pollSchema);

// Get all polls (user & admin)
app.get('/api/get-polls', (req, res) => {
    Poll.find({}, (err, polls) => {
        if (err) return res.status(500).send(err);
        res.json(polls);
    });
});

// Create new poll (admin)
app.post('/api/create-poll', (req, res) => {
    const newPoll = new Poll(req.body);
    newPoll.save((err, poll) => {
        if (err) return res.status(500).send(err);
        res.json(poll);
    });
});

// Submit vote (user)
app.post('/api/submit-vote', (req, res) => {
    const { pollId, selectedOption } = req.body;
    Poll.findById(pollId, (err, poll) => {
        if (err) return res.status(500).send(err);

        poll.votes[selectedOption]++;
        poll.save((err, updatedPoll) => {
            if (err) return res.status(500).send(err);
            res.json({ message: 'Vote submitted successfully', poll: updatedPoll });
        });
    });
});

// Delete poll (admin)
app.delete('/api/delete-poll/:id', (req, res) => {
    Poll.findByIdAndDelete(req.params.id, (err, poll) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Poll deleted successfully' });
    });
});

// Server Listening
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
