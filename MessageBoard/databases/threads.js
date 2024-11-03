const threads = [
    {
        title: "Can't write a fucking for loop",
        description: "title.",
    },
    {
        title: "How to center a div?",
        description: "I'm struggling to center a div element in CSS."
    },
    {
        title: "JavaScript async/await",
        description: "Can someone explain how async/await works in JavaScript?"
    },
    {
        title: "Best practices for React components",
        description: "What are some best practices for writing React components?"
    },
    {
        title: "Understanding closures in JavaScript",
        description: "Can someone help me understand how closures work in JavaScript?"
    }
]

let id = 0
threads.forEach(thread => {
    thread.likes = Math.floor(Math.random() * 1000)
    thread.id = id
    id++
})

async function getThreadById(threadId) {
    return threads.find(thread => thread.id === threadId)
}

function getAll() {
    return threads;
}

function addThread(title, description) {
    threads.push({
        title: title,
        description: description,
        id: id,
        likes: 0,
      });
    id++
}

module.exports = { getThreadById, getAll, addThread }