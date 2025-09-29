let teams = [];
let currentTeamIndex = 0;
let currentQuestion = null;

const defaultQuestions = {
    "HTML Structure": [
        { value: 100, question: "You need to create a navigation menu. What semantic HTML tag should you use?", answer: "<nav> - it tells browsers and screen readers this is navigation" },
        { value: 200, question: "Your image isn't showing up. What are 2 things to check in your <img> tag?", answer: "Check the src attribute has the correct file path, and make sure the file extension matches (.jpg, .png, etc.)" },
        { value: 300, question: "Fix this code: <div class='button'Click Me<div>", answer: "<div class='button'>Click Me</div> - need closing > on opening tag and proper closing tag with /" },
        { value: 400, question: "You want a clickable button that submits a form. Should you use <button> or <div>?", answer: "<button> - it's semantic, accessible, and works with keyboards. Don't use <div> for buttons!" },
        { value: 500, question: "Your website needs a main content area, sidebar, and footer. What HTML5 semantic tags should you use?", answer: "<main> for main content, <aside> for sidebar, <footer> for footer - these help with accessibility and SEO" }
    ],
    "CSS Layouts": [
        { value: 100, question: "How do you add space BETWEEN flex items?", answer: "Use gap: 20px; on the flex container (super easy!)" },
        { value: 200, question: "Your navbar items are stacking vertically. How do you make them horizontal with flexbox?", answer: "Add display: flex; to the parent container - flex-direction defaults to row (horizontal)" },
        { value: 300, question: "Center a div both horizontally AND vertically on the page using flexbox.", answer: "On parent: display: flex; justify-content: center; align-items: center; min-height: 100vh;" },
        { value: 400, question: "You have 3 columns that should be equal width. Write the flexbox code.", answer: "Parent: display: flex; Children: flex: 1; (each child will take equal space)" },
        { value: 500, question: "Your flex items are squishing when the screen gets smaller. How do you prevent this?", answer: "Add flex-wrap: wrap; to the parent, or set flex-shrink: 0; on items you don't want to shrink" }
    ],
    "CSS Styling Tips": [
        { value: 100, question: "How do you make rounded corners on a button?", answer: "border-radius: 10px; (higher number = more rounded)" },
        { value: 200, question: "Add a shadow to make your card look like it's floating above the page.", answer: "box-shadow: 0 4px 8px rgba(0,0,0,0.2); (x, y, blur, color)" },
        { value: 300, question: "Your white text on a yellow background is hard to read. What should you do?", answer: "Change to a darker color for better contrast - aim for at least 4.5:1 contrast ratio for accessibility" },
        { value: 400, question: "Make a smooth color transition when hovering over a button (write the CSS).", answer: "button { transition: background 0.3s; } button:hover { background: blue; }" },
        { value: 500, question: "Create a 2-color gradient background from purple to blue.", answer: "background: linear-gradient(to right, purple, blue); or use degrees like: linear-gradient(135deg, purple, blue);" }
    ],
    "UI/UX Best Practices": [
        { value: 100, question: "Your website text is 10px and hard to read. What's a better minimum size?", answer: "16px (1rem) - this is the standard body text size for good readability" },
        { value: 200, question: "Should you use 10 different fonts on your website?", answer: "No! Use 2-3 max. One for headings, one for body text keeps it clean and professional" },
        { value: 300, question: "A user clicks a button but nothing happens. What feedback should you add?", answer: "Add hover effects (color change, cursor: pointer), active states, and maybe a loading indicator" },
        { value: 400, question: "Your page has bright red background, neon green text, and 5 flashing animations. What's wrong?", answer: "Way too much! Use a simple color scheme (2-3 colors), readable text, and minimal animations. Less is more!" },
        { value: 500, question: "How do you make sure your website works for people using keyboards (no mouse)?", answer: "Use semantic HTML (<button> not <div>), ensure tab order makes sense, add focus states, and test with Tab key" }
    ],
    "JavaScript Basics": [
        { value: 100, question: "Write code to select an element with id='myButton'", answer: "document.getElementById('myButton') or document.querySelector('#myButton')" },
        { value: 200, question: "Add a click event to a button that shows an alert saying 'Hello!'", answer: "button.addEventListener('click', function() { alert('Hello!'); });" },
        { value: 300, question: "Change the text content of a <h1> to 'Welcome!' using JavaScript.", answer: "document.querySelector('h1').textContent = 'Welcome!';" },
        { value: 400, question: "Toggle a class 'active' on and off when clicking a button.", answer: "button.addEventListener('click', function() { element.classList.toggle('active'); });" },
        { value: 500, question: "Your click event isn't working. What's one common mistake to check?", answer: "Make sure your script runs AFTER the HTML loads - put <script> at bottom of <body> or use DOMContentLoaded event" }
    ]
};

let questions = defaultQuestions;

function addTeamInput() {
    const colors = ['#4949B4', '#7BEFD3', '#F77D2B', '#f56565', '#9f7aea', '#ed64a6', '#4299e1', '#38b2ac'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const teamNumber = document.querySelectorAll('.team-input-group').length + 1;

    const teamInputSection = document.getElementById('teamInputs');
    const newGroup = document.createElement('div');
    newGroup.className = 'team-input-group';
    newGroup.innerHTML = `
                <input type="text" placeholder="Team Name" value="Team ${teamNumber}" class="team-name-input">
                <input type="color" value="${randomColor}" class="color-picker">
                <button class="remove-team-btn" onclick="removeTeamInput(this)">✕</button>
            `;
    teamInputSection.appendChild(newGroup);
}

function removeTeamInput(btn) {
    const groups = document.querySelectorAll('.team-input-group');
    if (groups.length > 2) {
        btn.parentElement.remove();
    } else {
        alert('You need at least 2 teams to play!');
    }
}

function startGame() {
    const teamInputGroups = document.querySelectorAll('.team-input-group');
    teams = [];

    teamInputGroups.forEach(group => {
        const nameInput = group.querySelector('.team-name-input');
        const colorInput = group.querySelector('.color-picker');
        if (nameInput.value.trim()) {
            teams.push({
                name: nameInput.value.trim(),
                color: colorInput.value,
                score: 0
            });
        }
    });

    if (teams.length < 2) {
        alert('Please add at least 2 teams!');
        return;
    }

    document.getElementById('setupScreen').style.display = 'none';
    document.getElementById('gameScreen').classList.add('active');
    currentTeamIndex = 0;
    createBoard();
    updateScoreBoard();
}

function createBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';

    for (let category in questions) {
        const column = document.createElement('div');
        column.className = 'category-column';

        const header = document.createElement('div');
        header.className = 'category-header';
        header.textContent = category;
        column.appendChild(header);

        questions[category].forEach((q, idx) => {
            const card = document.createElement('div');
            card.className = 'question-card';
            card.textContent = `$${q.value}`;
            card.dataset.category = category;
            card.dataset.index = idx;
            card.onclick = () => openQuestion(category, idx, card);
            column.appendChild(card);
        });

        board.appendChild(column);
    }
}

function updateScoreBoard() {
    const container = document.getElementById('teamsContainer');
    container.innerHTML = '';

    teams.forEach((team, idx) => {
        const teamDiv = document.createElement('div');
        teamDiv.className = 'team-score';
        if (idx === currentTeamIndex) {
            teamDiv.classList.add('active');
        }
        teamDiv.style.background = team.color;
        teamDiv.innerHTML = `
                    <div class="team-name">${team.name}</div>
                    <div class="team-points">$${team.score}</div>
                `;
        container.appendChild(teamDiv);
    });
}

function nextTeam() {
    currentTeamIndex = (currentTeamIndex + 1) % teams.length;
    updateScoreBoard();
}

function openQuestion(category, index, cardElement) {
    if (cardElement.classList.contains('answered')) return;

    const q = questions[category][index];
    currentQuestion = { category, index, value: q.value, cardElement };

    document.getElementById('modalValue').textContent = `$${q.value}`;
    document.getElementById('modalQuestion').textContent = q.question;

    const currentTeamDisplay = document.getElementById('currentTeamDisplay');
    currentTeamDisplay.textContent = `${teams[currentTeamIndex].name}'s Turn`;
    currentTeamDisplay.style.background = teams[currentTeamIndex].color;

    document.getElementById('modal').classList.add('active');
}

function answerQuestion(correct) {
    const answerSection = document.getElementById('answerSection');
    const answer = questions[currentQuestion.category][currentQuestion.index].answer;

    document.getElementById('modalAnswer').textContent = answer;
    answerSection.style.display = 'block';

    if (correct) {
        teams[currentTeamIndex].score += currentQuestion.value;
        currentQuestion.cardElement.style.background = teams[currentTeamIndex].color;
    } else {
        teams[currentTeamIndex].score -= currentQuestion.value;
        currentQuestion.cardElement.style.background = '#f56565';
    }

    currentQuestion.cardElement.classList.add('answered');
    updateScoreBoard();
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
    document.getElementById('answerSection').style.display = 'none';
    currentQuestion = null;
    nextTeam();
}

function resetGame() {
    if (confirm('Start a new game? This will reset all scores and teams.')) {
        teams = [];
        currentTeamIndex = 0;
        document.getElementById('gameScreen').classList.remove('active');
        document.getElementById('setupScreen').style.display = 'block';
        createBoard();
    }
}

function loadCustomQuestions(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            questions = JSON.parse(event.target.result);
            createBoard();
            alert('Custom questions loaded successfully! 🎉');
        } catch (error) {
            alert('Error loading JSON file. Please check the format.');
        }
    };
    reader.readAsText(file);
}