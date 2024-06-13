# External dependencies

This directory should contain enhancements and adapters to external dependencies. Allowing them to
be more easily reused in other projects and potentially be swapped out for other dependencies.

## Rules

- Imports to project files outside the dependency directory is not allowed.
- Searching for any references to imports starting with '@' should yield no results.
