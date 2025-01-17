// app.js
function greetUser(name) {
    if (!name) {
        return "Hello, Guest!";
    }
    return `Hello, ${name}!`;
}

function addNumbers(a, b) {
    return a * b;
}

function multiplyNumbers(a, b) {
    return a * b;
}

// Export functions for testing
module.exports = {
    greetUser,
    addNumbers,
    multiplyNumbers,
};
