const mongoose = require('mongoose');
const dotenv = require('dotenv');
const LearningHubContent = require('../models/LearningHubContent');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedData = [
  // --- Data Structures ---
  {
    subject: 'Data Structures',
    type: 'theory',
    title: 'Asymptotic Analysis & Big O',
    contentPayload: {
      question: 'Explain the difference between O(n) and O(log n) time complexity. Which one is generally more efficient for large datasets and why?',
      expectedKeywords: ['linear', 'logarithmic', 'divide and conquer', 'halves', 'more efficient', 'large dataset', 'scales better']
    }
  },
  {
    subject: 'Data Structures',
    type: 'mcq',
    title: 'Choosing a Tree Structure',
    contentPayload: {
      question: 'Which tree structure guarantees O(log n) search time in the worst case by actively balancing itself after insertions?',
      options: ['Binary Search Tree (BST)', 'AVL Tree', 'Heap', 'Trie'],
      expectedKeywords: ['Option B', 'AVL Tree', 'self-balancing', 'balanced']
    }
  },
  {
    subject: 'Data Structures',
    type: 'coding',
    title: 'Reverse a Linked List',
    contentPayload: {
      question: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
      starterCode: 'function reverseList(head) {\n  let prev = null;\n  let current = head;\n  // Your code here\n  \n  return prev;\n}',
      testCases: [{ input: '[1,2,3]', expectedOutput: '[3,2,1]' }]
    }
  },

  // --- Algorithms ---
  {
    subject: 'Algorithms',
    type: 'theory',
    title: 'Dynamic Programming vs Divide & Conquer',
    contentPayload: {
      question: 'What is the primary structural difference between Dynamic Programming and Divide & Conquer?',
      expectedKeywords: ['overlapping subproblems', 'memoization', 'tabulation', 'reuse', 'recalculate', 'independent']
    }
  },
  {
    subject: 'Algorithms',
    type: 'mcq',
    title: 'Sorting Time Complexities',
    contentPayload: {
      question: 'What is the average time complexity of QuickSort?',
      options: ['O(n)', 'O(n^2)', 'O(n log n)', 'O(log n)'],
      expectedKeywords: ['Option C', 'n log n']
    }
  },

  // --- DBMS ---
  {
    subject: 'DBMS',
    type: 'theory',
    title: 'ACID Properties',
    contentPayload: {
      question: 'What does the "I" in ACID stand for, and why is it critical for database transactions?',
      expectedKeywords: ['Isolation', 'concurrent', 'simultaneous', 'interference', 'independently']
    }
  },
  {
    subject: 'DBMS',
    type: 'coding',
    title: 'SQL: Nth Highest Salary',
    contentPayload: {
      question: 'Write a SQL query to find the second highest salary from the Employee table.',
      starterCode: 'SELECT MAX(salary) AS SecondHighestSalary FROM Employee\nWHERE salary < (SELECT MAX(salary) FROM Employee);',
      testCases: []
    }
  },

  // --- Operating Systems ---
  {
    subject: 'Operating Systems',
    type: 'theory',
    title: 'Deadlocks',
    contentPayload: {
      question: 'What are the four Coffman conditions required for a deadlock to occur?',
      expectedKeywords: ['mutual exclusion', 'hold and wait', 'no preemption', 'circular wait']
    }
  },

  // --- Computer Networks ---
  {
    subject: 'Computer Networks',
    type: 'mcq',
    title: 'OSI Model Layers',
    contentPayload: {
      question: 'Which OSI layer is responsible for routing packets across different networks?',
      options: ['Data Link Layer', 'Transport Layer', 'Network Layer', 'Physical Layer'],
      expectedKeywords: ['Option C', 'Network Layer', 'IP']
    }
  },

  // --- OOPs ---
  {
    subject: 'OOPs',
    type: 'theory',
    title: 'The Four Pillars',
    contentPayload: {
      question: 'Explain the concept of Polymorphism with an example.',
      expectedKeywords: ['many forms', 'overloading', 'overriding', 'same interface', 'different implementation']
    }
  },

  // --- System Design ---
  {
    subject: 'System Design',
    type: 'theory',
    title: 'Scalability',
    contentPayload: {
      question: 'What is the difference between Horizontal and Vertical scaling?',
      expectedKeywords: ['horizontal', 'adding more machines', 'servers', 'vertical', 'adding more power', 'CPU', 'RAM']
    }
  },

  // --- Web Development ---
  {
    subject: 'Web Development',
    type: 'mcq',
    title: 'DOM vs Virtual DOM',
    contentPayload: {
      question: 'Why does React use a Virtual DOM instead of directly manipulating the Real DOM?',
      options: ['It is a completely different language', 'It avoids expensive repaints and reflows by batching updates', 'It uses less memory', 'It bypasses the browser entirely'],
      expectedKeywords: ['Option B', 'expensive repaints', 'batching', 'efficiency']
    }
  },

  // --- Machine Learning ---
  {
    subject: 'Machine Learning',
    type: 'theory',
    title: 'Bias-Variance Tradeoff',
    contentPayload: {
      question: 'Explain the difference between overfitting and underfitting in a machine learning model.',
      expectedKeywords: ['overfitting', 'memorizes training data', 'fails on unseen data', 'underfitting', 'too simple', 'cannot capture patterns']
    }
  },

  // --- Cloud Computing ---
  {
    subject: 'Cloud Computing',
    type: 'mcq',
    title: 'Cloud Service Models',
    contentPayload: {
      question: 'Which cloud service model provides a fully managed application where you do not need to manage servers or runtimes?',
      options: ['IaaS', 'PaaS', 'SaaS', 'FaaS'],
      expectedKeywords: ['Option C', 'SaaS', 'Software as a Service']
    }
  },

  // --- Cybersecurity ---
  {
    subject: 'Cybersecurity',
    type: 'theory',
    title: 'Cryptography',
    contentPayload: {
      question: 'What is the primary difference between hashing and encryption?',
      expectedKeywords: ['hashing is one-way', 'cannot be reversed', 'encryption is two-way', 'can be decrypted', 'key']
    }
  },

  // --- Computer Architecture ---
  {
    subject: 'Computer Architecture',
    type: 'mcq',
    title: 'Memory Hierarchy',
    contentPayload: {
      question: 'Which type of memory is the fastest but has the smallest capacity?',
      options: ['RAM', 'L1 Cache', 'Registers', 'Hard Drive'],
      expectedKeywords: ['Option C', 'Registers', 'CPU']
    }
  }
];

async function seedContent() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected.');

    console.log('Clearing existing LearningHubContent...');
    await LearningHubContent.deleteMany();

    console.log('Seeding new subjects...');
    await LearningHubContent.insertMany(seedData);

    console.log('Learning Hub Content seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seedContent();
