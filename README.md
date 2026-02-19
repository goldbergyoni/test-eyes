> **⚠️ Work in Progress** - This project is under active development. Not ready for production use yet.

## Installation

- Grant GitHub pages permissions...
- Put this after your test command: 

```
uses: test-eyes/smart-reporter@v1
        with:
          junit-path: './junit.xml'
          post-comment-with-link-to-report: true
          cache_duration_in_minutes: 60
```


## Flow

- Tests run, they produce junit.xml somewhere
- Save a single run into the data branch
- Check if last sync date is greater than now + cache
    - Re-calculate main data including the last run
    - Deploy frontend
- Push comment