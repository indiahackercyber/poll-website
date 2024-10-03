document.getElementById('pollForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const pollData = {
        question: formData.get('question'),
        options: [
            formData.getAll('option')[0],
            formData.getAll('option')[1],
            formData.getAll('option')[2],
            formData.getAll('option')[3]
        ],
        correctAnswer: formData.get('correctAnswer') ? formData.get('correctAnswer') - 1 : null
    };

    fetch('/api/create-poll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pollData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Poll created successfully');
        loadExistingPolls(); 
    });
});

function loadExistingPolls() {
    fetch('/api/get-polls')
        .then(res => res.json())
        .then(polls => {
            const pollsDiv = document.getElementById('existingPolls');
            pollsDiv.innerHTML = ''; 
            polls.forEach(poll => {
                const pollDiv = document.createElement('div');
                pollDiv.classList.add('poll');
                pollDiv.innerHTML = `
                    <h3>${poll.question}</h3>
                    ${poll.options.map((option, index) => `
                        <div>${index + 1}. ${option}</div>
                    `).join('')}
                    <button onclick="deletePoll('${poll._id}')">Delete Poll</button>
                `;
                pollsDiv.appendChild(pollDiv);
            });
        });
}

function deletePoll(pollId) {
    fetch(`/api/delete-poll/${pollId}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(data => {
            alert('Poll deleted successfully');
            loadExistingPolls(); 
        });
}

document.addEventListener('DOMContentLoaded', loadExistingPolls);
