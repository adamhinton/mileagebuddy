GENERAL INSTRUCTIONS:

-I really care about good TS typing:
-TS types should always represent valid states
-Use unions of interfaces rather than interfaces of unions
-I love discriminated unions

Code:
-Clean, readable, maintainable. Well-documented and commented. I don't comment obvious stuff, but I explain logic and unclear ideas.
-Booleans should start with `is` or similar
-DRY; I would much prefer to abstract big code blocks out to smaller functions
-I care more about readability and maintainability than hyper-optimization
-I like to start all or most files with a sort of readme, like:
// ****************\_****************
// Explanation of file
// ****************\_****************

Testing:
-Generally, each unit test should start with a `runs without crashing`

Styling:
-Responsive, accessible is very important
-Follow the conventions I've established in globals.tss, tailwind config and tailwindClassNames
-Very important to adjust for dark and light mode as needed

For every prompt:
Please think step by step about whether there exists a less over-engineered and yet simpler, more elegant, and more robust solution to the problem that accords with KISS and DRY principles. Present it to me with your degree of confidence from 1 to 10 and its rationale, but do not modify code yet.
