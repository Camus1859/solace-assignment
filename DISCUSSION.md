## Discussion

I haven’t written Tailwind in a few years, but it was fun to jump back into it.

I spent around 4 hours on the assignment. If I had more time, I would:

- Add unit tests for the search functionality to ensure it behaves correctly as the dataset scales or changes
- Replace the basic `.includes` logic with fuzzy search using [fuse.js](https://www.npmjs.com/package/fuse.js) to support partial and misspelled queries
- Add pagination (or infinite scroll) to improve frontend performance with large datasets
- Improve accessibility by ensuring all table cells and filters are keyboard-navigable and follow ARIA best practices
