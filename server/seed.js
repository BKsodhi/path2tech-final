require('dotenv').config();
const mongoose = require('mongoose');
const Problem = require('./models/Problem');
const Topic = require('./models/Topic');
const Assessment = require('./models/Assessment');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB connected for seeding...');
  
  // Seed Problems
  await Problem.deleteMany({});
  await Assessment.deleteMany({});
  const existingProblems = 0;
  if (existingProblems === 0) {
    await Problem.create([
      {
        title: "Two Sum",
        difficulty: "Easy",
        tags: ["Arrays", "Hash Maps"],
        description: "Given an array of integers nums and an integer target, return the indices of the two numbers that add up to the target.\n\nYou may assume:\n• Each input has exactly one solution.\n• You may not use the same element twice.",
        xp: 50,
        examples: [
          { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
          { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
        ],
        starterCode: "def two_sum(nums, target):\n    # Write your code here\n    pass",
        testCases: [
          { input: "[2,7,11,15], 9", expected: "[0,1]" },
          { input: "[3,2,4], 6", expected: "[1,2]" }
        ]
      },
      {
        title: "Longest Palindrome Substring",
        difficulty: "Medium",
        tags: ["Dynamic Programming", "Strings"],
        description: "Given a string s, return the longest palindromic substring in s.",
        xp: 120,
        examples: [
          { input: "s = \"babad\"", output: "\"bab\"" }
        ],
        starterCode: "def longestPalindrome(s):\n    pass",
        testCases: [
          { input: "\"babad\"", expected: "\"bab\"" }
        ]
      },
      {
        title: "Merge K Sorted Lists",
        difficulty: "Hard",
        tags: ["Linked List", "Divide and Conquer"],
        description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
        xp: 200,
        examples: [],
        starterCode: "# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\ndef mergeKLists(lists):\n    pass",
      },
      {
        title: "Valid Parentheses",
        difficulty: "Easy",
        tags: ["Stack", "Strings"],
        description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.",
        xp: 60,
        examples: [
          { input: "s = \"()\"", output: "true" },
          { input: "s = \"()[]{}\"", output: "true" },
          { input: "s = \"(]\"", output: "false" }
        ],
        starterCode: "def isValid(s):\n    # Write your code here\n    pass",
        testCases: []
      },
      {
        title: "Number of Islands",
        difficulty: "Medium",
        tags: ["Graph", "DFS", "BFS"],
        description: "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
        xp: 150,
        examples: [
          { input: "grid = [[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]", output: "3" }
        ],
        starterCode: "def numIslands(grid):\n    pass",
        testCases: []
      },
      {
        title: "LRU Cache",
        difficulty: "Medium",
        tags: ["Design", "Hash Maps", "Linked List"],
        description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the LRUCache class:\n- LRUCache(int capacity) Initialize the LRU cache with positive size capacity.\n- int get(int key) Return the value of the key if the key exists, otherwise return -1.",
        xp: 180,
        examples: [],
        starterCode: "class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n\n    def get(self, key: int) -> int:\n        pass\n\n    def put(self, key: int, value: int) -> None:\n        pass",
        testCases: []
      }
    ]);
    
    // Conceptual / Verbal problems
    const theoryQuestions = [
      {
        title: "Explain ACID Properties",
        description: "In the context of databases, explain what ACID stands for and why it is important for transactions. Give an example of a failure that ACID prevents.",
        difficulty: "Medium",
        xp: 80,
        tags: ["DBMS", "Transactions", "Verbal"],
        starterCode: "",
        testCases: []
      },
      {
        title: "What is Normalization?",
        description: "Explain the concept of database normalization. Describe 1NF, 2NF, and 3NF with examples.",
        difficulty: "Hard",
        xp: 120,
        tags: ["DBMS", "Verbal"],
        starterCode: "",
        testCases: []
      },
      {
        title: "Deadlocks in OS",
        description: "Explain what a deadlock is in an operating system. What are the four Coffman conditions required for a deadlock to occur?",
        difficulty: "Medium",
        xp: 100,
        tags: ["Operating Systems", "Verbal"],
        starterCode: "",
        testCases: []
      },
      {
        title: "TCP vs UDP",
        description: "Compare and contrast the TCP and UDP protocols. In what scenarios would you choose UDP over TCP?",
        difficulty: "Easy",
        xp: 50,
        tags: ["Computer Networks", "Verbal"],
        starterCode: "",
        testCases: []
      }
    ];
    await Problem.create(theoryQuestions);
    console.log("Problems and theory questions seeded!");

    // Seed Assessments
    const allProblems = await Problem.find({ difficulty: { $in: ['Easy', 'Medium'] } }).limit(4);
    
    await Assessment.create([
      {
        title: "Weekly Mock Assessment: DSA Core",
        description: "Test your fundamental data structure and algorithmic skills. Solve these challenges within the time limit to earn bonus XP.",
        timeLimitMinutes: 45,
        problems: allProblems.map(p => p._id),
        xpReward: 300
      },
      {
        title: "Speed Run: Array Manipulation",
        description: "A fast-paced test focused entirely on array traversal and manipulation.",
        timeLimitMinutes: 20,
        problems: allProblems.slice(0, 2).map(p => p._id),
        xpReward: 150
      }
    ]);
    console.log('Assessments seeded!');
  } else {
    console.log("Problems already exist, skipping seed.");
  }
  
  // Seed Topics
  await Topic.deleteMany({});
  await Topic.create([
    { title: "Data Structures", description: "Learn arrays, linked lists, trees, graphs, and more.", icon: "Database", totalTopics: 18, color: "violet" },
    { title: "Algorithms", description: "Master sorting, searching, DP, and graph algorithms.", icon: "Activity", totalTopics: 15, color: "orange" },
    { title: "DBMS", description: "Understand databases, SQL, normalization, and ACID.", icon: "Server", totalTopics: 12, color: "cyan" },
    { title: "Operating Systems", description: "Learn processes, threads, memory, and concurrency.", icon: "Cpu", totalTopics: 10, color: "rose" },
    { title: "Computer Networks", description: "Explore OSI model, TCP/IP, routing, and security.", icon: "Network", totalTopics: 12, color: "emerald" },
    { title: "OOPs", description: "Master objects, classes, inheritance, and polymorphism.", icon: "Box", totalTopics: 8, color: "amber" },
    { title: "System Design", description: "Learn scalability, microservices, load balancing, and CAP theorem.", icon: "Server", totalTopics: 14, color: "cyan" },
    { title: "Web Development", description: "Master HTML, CSS, JS, React, and Backend frameworks.", icon: "Activity", totalTopics: 20, color: "violet" },
    { title: "Machine Learning", description: "Explore supervised/unsupervised learning, neural networks.", icon: "Cpu", totalTopics: 15, color: "orange" },
    { title: "Cloud Computing", description: "Understand AWS, Azure, virtualization, and containers.", icon: "Network", totalTopics: 10, color: "emerald" },
    { title: "Cybersecurity", description: "Learn cryptography, network security, and ethical hacking.", icon: "Lock", totalTopics: 12, color: "rose" },
    { title: "Computer Architecture", description: "Explore CPU design, instruction sets, and pipelining.", icon: "Cpu", totalTopics: 8, color: "amber" }
  ]);
  console.log("Topics seeded!");

  process.exit();
})
.catch(err => console.log('MongoDB connection error:', err));
