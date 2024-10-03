document.addEventListener("DOMContentLoaded", () => {
    fetch('/api/get-polls')
        .then(res => res.json())
        .then(polls => {
            const pollsDiv = document.getElementById('polls');
            polls.forEach(poll => {
                const pollDiv = document.createElement('div');
                pollDiv.classList.add('poll');
                pollDiv.innerHTML = `
                    <h3>${poll.question}</h3>
                    ${poll.options.map(option => `
                        <input type="radio" name="${poll._id}" value="${option}"> ${option} <br>
                    `).join('')}
                    <button onclick="submitVote('${poll._id}')">Vote</button>
                `;
                pollsDiv.appendChild(pollDiv);
            });
        });
});

function submitVote(pollId) {
    const selectedOption = document.querySelector(`input[name="${pollId}"]:checked`).value;
    fetch('/api/submit-vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pollId, selectedOption })
    })
    .then(res => res.json())
    .then(data => alert(data.message));
}
