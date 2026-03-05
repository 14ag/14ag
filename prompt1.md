
You are working inside the full repository with complete read and write access. Your task is to perform a comprehensive frontend debugging and remediation pass.

First, scan the entire codebase. Map out the project structure, identify all frontend-related files (UI components, pages, routes, stylesheets, state management, API integrations, configuration files, build scripts, and environment files), and determine the framework, bundler, and runtime assumptions in use. Do not modify anything yet.

Second, build a mental model of how the frontend is intended to function. Trace entry points (e.g., main.tsx, index.js, app initialization), routing configuration, global state flow, and API communication paths. Identify mismatches between intended architecture and actual implementation.

Third, debug the frontend systematically:

1. Identify compile-time errors (type errors, missing imports, invalid exports, incorrect module resolution).
2. Identify runtime errors (undefined values, null dereferencing, async misuse, race conditions, unhandled promise rejections).
3. Detect broken UI logic (incorrect conditional rendering, stale state, improper dependency arrays, incorrect event binding).
4. Check API integration issues (wrong endpoints, bad payload structure, missing error handling, improper async/await usage).
5. Validate state management consistency (duplicate sources of truth, improper mutation, unnecessary re-renders).
6. Review styling conflicts (CSS collisions, specificity issues, unused styles, layout-breaking rules).
7. Check environment/config mismatches (missing env vars, incorrect base URLs, build-time vs runtime config issues).
8. Identify dead code, redundant logic, circular dependencies, and conflicting implementations.

Fourth, for every issue found:

* Explain the root cause.
* Explain how it manifests (build error, runtime crash, incorrect UI behavior, silent bug).
* Propose a minimal, precise fix.
* Show the corrected code snippet only where necessary.
* Avoid refactoring beyond what is required to fix the issue unless the current structure makes the bug unavoidable.

Fifth, categorize findings into:

* Critical (breaks build or core functionality)
* High (major feature malfunction)
* Medium (logic flaw, performance issue, maintainability risk)
* Low (cleanup, redundancy, minor UX issue)

Finally, provide a concise prioritized action plan to stabilize the frontend, ensuring fixes are ordered by impact and dependency risk. Do not introduce new features. Focus strictly on debugging, stabilization, and correctness.
